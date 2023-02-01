import { prisma } from "../../../db/index";

export interface LooseObject
{
    [key: string]: any
}

export type queryFunction = {(obj: LooseObject, queryObj: LooseObject): void; };
export type queryTuple = [queryFunction, queryFunction];


function SimpleComparison(name: string, attribute: LooseObject,
                          queryObj: LooseObject): void
{
    let value = attribute[name];

    if (value !== null && value !== undefined && value)
        queryObj[name] = value;
}

function LinearComparisonTenant(name: string, minName: string, maxName: string,
                                attribute: LooseObject,
                                queryObj: LooseObject): void
{
    let less = false;
    let value = attribute[minName];

    if (value !== null && value !== undefined)
    {
        queryObj[name] = { gte: value };
        less = true;
    }

    value = attribute[maxName];
    if (value !== null && value !== undefined)
        if (less)
            queryObj[name]["lte"] = value;
        else
            queryObj[name] = { lte: value };
}

function LinearComparisonPost(name: string, minName: string, maxName: string,
                              attribute: LooseObject,
                              queryObj: LooseObject): void
{
    let value = attribute[name];
    if (value !== null && value !== undefined)
        return;

    queryObj[minName] = { lte: value };
    queryObj[maxName] = { gte: value };
}

function SetLinearComparison(name: string): queryTuple
{
    let upperName = name.charAt(0).toUpperCase() + name.slice(1);
    let minName = "min" + upperName;
    let maxName = "max" + upperName;

    return [(obj: LooseObject, queryObj: LooseObject): void => 
        LinearComparisonTenant(name, minName, maxName, obj, queryObj),
        (obj: LooseObject, queryObj: LooseObject): void => 
        LinearComparisonPost(name, minName, maxName, obj, queryObj)];
}

function CreateQueryHandler(): queryTuple[]
{
    const obj = prisma._baseDmmf.typeAndModelMap["Attribute"].fields;
    const skip: string[] = ["createdAt", "user", "post"];
    let queryHandler: queryTuple[] = [];

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
            queryHandler.push([(obj: LooseObject, queryObj: LooseObject):void =>
                              SimpleComparison(name, obj, queryObj),
                              (obj: LooseObject, queryObj: LooseObject):void =>
                              SimpleComparison(name, obj, queryObj)]);
    }

    return queryHandler;
}

export const queryHandler: queryTuple[] = CreateQueryHandler();

