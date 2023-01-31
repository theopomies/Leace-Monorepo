import { router, protectedProcedure } from "../trpc";
import { z } from "zod";
import { PostType, Roles } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { prisma } from "../../../db/index.ts";


interface LooseObject
{
    [key: string]: any
}

type queryFunction = {(obj: any, queryObj: LooseObject): void; };
type queryTuple = [string, queryFunction, queryFunction];


function ValidValue(value: any): boolean
{
    return value !== null && value !== undefined;
}

function SimpleComparison(name: string, obj: any, queryObj: LooseObject): void
{
    let value = obj[name];

    if (ValidValue(value))
        queryObj[name] = value;
}

function LinearComparisonTenant(name: string, minName: string, maxName: string,
                                obj: any, queryObj: LooseObject): void
{
    let less = false;
    console.log(minName + " " + obj[minName]);
    console.log(maxName + " " + obj[maxName]);

    if (ValidValue(obj[minName]))
    {
        queryObj[name] = { gte: obj[minName] };
        less = true;
    }

    if (ValidValue(obj[maxName]))
        if (less)
            queryObj[name]["lte"] = obj[maxName];
        else
            queryObj[name] = { lte: obj[maxName] };
}

function LinearComparisonPost(name: string, minName: string, maxName: string,
                              obj: any, queryObj: LooseObject): void
{
    let value = obj[name];
    if (!ValidValue(value))
        return;

    queryObj[minName] = { lte: value };
    queryObj[maxName] = { gte: value };
}

function SetLinearComparison(name: string): queryTuple
{
    let minName = name.charAt(0).toUpperCase() + name.slice(1);
    let maxName = "max" + minName;
    minName = "min" + minName;

    return [name, (obj: any, queryObj: LooseObject): void => 
        LinearComparisonTenant(name, minName, maxName, obj, queryObj),
        (obj: any, queryObj: LooseObject): void => 
        LinearComparisonPost(name, minName, maxName, obj, queryObj)];
}

function CreateQueryHandler(): queryTuple[]
{
    const obj = prisma._baseDmmf.typeAndModelMap["Attribute"].fields;
    const skip: string[] = ["createdAt", "user", "post"];
    let queryHandler: queryTuple[] = [];

    console.log(obj);
    for (let name of Object.keys(obj))
    {
        const field = obj[name];
        name = field.name;
        if (field.isUnique || field.isId || field.isUpdatedAt ||
            skip.includes(field))
            continue;
        if ((field.type === "DateTime" || field.type === "Int"))
        {
            if (!name.startsWith("min") && !name.startsWith("max"))
            queryHandler.push(SetLinearComparison(name));
        }
        else
            queryHandler.push([name, (obj: any, queryObj: LooseObject):void =>
                              SimpleComparison(name, obj, queryObj),
                              (obj: any, queryObj: LooseObject):void =>
                              SimpleComparison(name, obj, queryObj)]);
    }

    return queryHandler;
}

function GetQuery(obj: any, isTenant: boolean): any
{
    let index: number = isTenant ? 1 : 2;
    let query = isTenant ? {type: PostType.TO_BE_RENTED} : {};

    if (!ValidValue(obj))
        return query;

    for (let tuple of queryHandler)
        tuple[index](obj, query);
    return query;
}

function QueryCursor(func: any, finalQuery: any, cursor: any)
{
    const cursorSize = 10;

    if (ValidValue(cursor))
        return func({
            take: cursorSize,
            skip: 1,
            cursor: {
                id: cursor,
            },
            where: finalQuery,
            orderBy: {
                id: 'asc',
            },
        });

    return func({
        take: cursorSize,
        where: finalQuery,
        orderBy: {
            id: 'asc',
        },
    });
}

const queryHandler: queryTuple[] = CreateQueryHandler();

export const stackRouter = router({
  getStack: protectedProcedure([Roles.AGENCY, Roles.OWNER, Roles.TENANT])
    .input(z.object({
        postId: z.string().optional(),
        cursor: z.string().optional()
    }))
    .query(async ({ ctx, input }) => {
        if (ctx.session.user.role == Roles.TENANT)
            return QueryCursor(ctx.prisma.post.findMany,
                               GetQuery(ctx.session.user.attribute, true),
                               input.cursor);
        else if (ValidValue(input))
            return QueryCursor(ctx.prisma.user.findMany,
                               { where: {
                                    attribute: GetQuery(
                                    await ctx.prisma.post.findUniqueOrThrow({
                                        where: {
                                            createdById: ctx.session.user.id,
                                            id: input
                                        }}),
                                    false
                                )}},
                                input.cursor);
        else
            throw new TRPCError({ code: "BAD_REQUEST" });
    })
});

