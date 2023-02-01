import { router, protectedProcedure } from "../trpc";
import { z } from "zod";
import { PostType, UserStatus, Roles, Attribute} from "@prisma/client";
import { queryHandler, LooseObject } from "../utils/stackUtils";
//import { getDMMF, GetDMMFOptions } from "@prisma/internals";

//datamodel?: string | undefined
//cwd?: string | undefined;                                                                                                         
//prismaPath?: string | undefined;                                                                                                  
//datamodelPath?: string | undefined;                                                                                               
//retry?: number | undefined;                                                                                                       
//previewFeatures?: string[] | undefined;

export const stackRouter = router({
  getStack: protectedProcedure([Roles.AGENCY, Roles.OWNER, Roles.TENANT])
    .input(z.object({
        postId: z.string().optional(),
        cursor: z.string().optional()
    }))
    .query(async ({ ctx, input }) => {
        let query;
        let index = 0;
        let attribute;

        if (input.postId != null) {
            index = 1;
            query = {status: UserStatus.ACTIVE, attribute: {}};
            attribute = await ctx.prisma.post.findUniqueOrThrow({
                where: {
                    //createdById: ctx.session.user.id,
                    id: input.postId
                }}).attribute();
        } else {
            query = {type: PostType.TO_BE_RENTED, attribute: {}};
            attribute = await ctx.prisma.attribute.findUniqueOrThrow({
                    where: { userId: ctx.session.user.id}});
        }

        if (attribute != null) {
            if (index == 0) {
                for (const [queryFunction, ] of queryHandler) {
                    queryFunction(attribute, query.attribute);
                }
            } else {
                for (const [, queryFunction] of queryHandler) {
                    queryFunction(attribute, query.attribute);
                }
            }
        }

        let finalQuery: LooseObject = {};
        Object.assign(finalQuery, {
            take: 10,
            where: query,
            orderBy: {
                id: 'asc',
            }});

        if (input.cursor != null) {
            Object.assign(finalQuery, {skip: 1, cursor: {id : input.cursor}});
        }

        if (input.postId != null) {
            return ctx.prisma.user.findMany(finalQuery);
        }

        return ctx.prisma.post.findMany(finalQuery);
    })
});

