import { prisma } from "../../../db/index";
import { Attribute } from "@prisma/client";

export interface LooseObject
{
    [key: string]: never
}

export type queryFunction = {(obj: Attribute, queryObj: LooseObject): void; };
export type queryTuple = [queryFunction, queryFunction];


function assignComparisonIfNotNull(name: string, attribute: LooseObject,
    queryObj: LooseObject): void
{
    let value = attribute[name];

    if (value != null && value) {
        Object.assign(queryObj, {[name]: value })
    }
}

function assignRangeComparisonIfNotNullTenant(name: string, minName: string,
    maxName: string, attribute: LooseObject, queryObj: LooseObject): void
{
    let empty = true;
    let addToQuery = {};
    let value = attribute[minName];

    if (value != null) {
        Object.assign(addToQuery, { gte: value });
        empty = false;
    }

    value = attribute[maxName];
    if (value != null && value) {
        if (empty) {
            Object.assign(addToQuery, { lte: value });
            empty = false;
        } else {
            Object.assign(addToQuery, { lte: value });
        }
    }

    if (empty) {
        return;
    }

    Object.assign(queryObj, {[name] : addToQuery});
}

function assignRangeComparisonIfNotNullPost(name: string, minName: string,
    maxName: string, attribute: LooseObject, queryObj: LooseObject): void
{
    let value = attribute[name];

    if (value != null) {
        return;
    }

    Object.assign(queryObj,
                  {[minName]: { lte: value }, [maxName]: { gte: value }})
}

function assignLinearComparison(name: string): queryTuple
{
    let upperName = name.charAt(0).toUpperCase() + name.slice(1);
    let minName = "min" + upperName;
    let maxName = "max" + upperName;

    return [(obj: Attribute, queryObj: LooseObject): void => 
        assignRangeComparisonIfNotNullTenant(name, minName, maxName,
            obj as any, queryObj),
        (obj: Attribute, queryObj: LooseObject): void => 
        assignRangeComparisonIfNotNullPost(name, minName, maxName,
            obj as any, queryObj)];
}

function createQueryHandler(): queryTuple[]
{
    const obj = prisma._baseDmmf.typeAndModelMap["Attribute"].fields;
    const skip: string[] = ["createdAt", "user", "post"];
    let queryHandler: queryTuple[] = [];

    for (let name of Object.keys(obj)) {
        const field = obj[name];
        name = field.name;

        if (field.isUnique || field.isId || field.isUpdatedAt ||
            skip.includes(field)) {
            continue;
        }

        if ((field.type === "DateTime" || field.type === "Int")) {
            if (!name.startsWith("min") && !name.startsWith("max")) {
                queryHandler.push(assignLinearComparison(name));
            }
        } else {
            queryHandler.push([(obj: Attribute, queryObj: LooseObject):void =>
                    assignComparisonIfNotNull(name, obj as any, queryObj),
                (obj: Attribute, queryObj: LooseObject):void =>
                    assignComparisonIfNotNull(name, obj as any, queryObj)]);
        }
    }

    return queryHandler;
}

export const queryHandler: queryTuple[] = createQueryHandler();

