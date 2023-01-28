import { getServerSession, type Session } from "@leace/auth";
import { prisma } from "@leace/db";
import { type inferAsyncReturnType } from "@trpc/server";
import { type CreateNextContextOptions } from "@trpc/server/adapters/next";
import { S3Client } from "@aws-sdk/client-s3";

/**
 * Replace this with an object if you want to pass things to createContextInner
 */
type CreateContextOptions = {
  session: Session | null;
  s3Client: S3Client;
};

/** Use this helper for:
 *  - testing, where we dont have to Mock Next.js' req/res
 *  - trpc's `createSSGHelpers` where we don't have req/res
 * @see https://beta.create.t3.gg/en/usage/trpc#-servertrpccontextts
 */
export const createContextInner = async (opts: CreateContextOptions) => {
  return {
    session: opts.session,
    prisma,
    s3Client: opts.s3Client,
  };
};

/**
 * This is the actual context you'll use in your router
 * @link https://trpc.io/docs/context
 **/
export const createContext = async (opts: CreateNextContextOptions) => {
  const session = await getServerSession(opts);
  const s3Client = new S3Client({
    region: "eu-west-3",
    apiVersion: "2006-03-01",
    credentials: {
      accessKeyId: "AKIAZ6Z53GK2WND3XFFM",
      secretAccessKey: "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",
    },
  });

  return await createContextInner({
    session,
    s3Client,
  });
};

export type Context = inferAsyncReturnType<typeof createContext>;
