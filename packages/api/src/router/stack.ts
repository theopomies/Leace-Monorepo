import { router, protectedProcedure } from "../trpc";
import { z } from "zod";
import { PostType, UserStatus, Roles, Attribute} from "@prisma/client";
import { LooseObject, queryFunction, queryHandler } from "../utils/stackUtils";

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


        if (input.postId !== undefined && input.postId !== null)
        {
            index = 1;
            query = {status: UserStatus.ACTIVE, attribute: {}};
            attribute = await ctx.prisma.post.findUniqueOrThrow({
                where: {
                    //createdById: ctx.session.user.id,
                    id: input.postId
                }}).attribute();
        }
        else
        {
            query = {type: PostType.TO_BE_RENTED, attribute: {}};
            attribute = await ctx.prisma.attribute.findUniqueOrThrow({
                    where: { userId: ctx.session.user.id}});
        }

        if (attribute !== null && attribute !== undefined)
            for (let tuple of queryHandler)
                (tuple[index] as queryFunction)(attribute, query.attribute);

        let finalQuery: LooseObject = {
            take: 10,
            where: query,
            orderBy: {
                id: 'asc',
            }};

        if (input.cursor !== null && input.cursor !== undefined)
        {
            finalQuery.skip = 1;
            finalQuery.cursor = {id: input.cursor};
        }

        if (input.postId !== undefined && input.postId !== null)
            return ctx.prisma.user.findMany(finalQuery as
                                            {[key: string]: never});
        return ctx.prisma.post.findMany(finalQuery as {[key: string]: never});
    })
});

