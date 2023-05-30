import { prisma, Role } from "@leace/db";
import { type inferAsyncReturnType } from "@trpc/server";
import { type CreateNextContextOptions } from "@trpc/server/adapters/next";
import { S3Client } from "@aws-sdk/client-s3";
import { getAuth, createClerkClient, clerkClient } from "@clerk/nextjs/server";
import type {
  SignedInAuthObject,
  SignedOutAuthObject,
} from "@clerk/nextjs/api";

/**
 * Replace this with an object if you want to pass things to createContextInner
 */
type AuthContextProps = {
  clerkClient: typeof clerkClient;
  s3Client: S3Client;

  auth: SignedInAuthObject | SignedOutAuthObject;
  role: Role | undefined;
};

/** Use this helper for:
 *  - testing, where we dont have to Mock Next.js' req/res
 *  - trpc's `createSSGHelpers` where we don't have req/res
 * @see https://beta.create.t3.gg/en/usage/trpc#-servertrpccontextts
 */
export const createContextInner = async ({
  clerkClient,
  s3Client,
  auth,
  role,
}: AuthContextProps) => {
  return {
    clerkClient,
    s3Client: s3Client,
    prisma,
    auth,
    role,
  };
};

/**
 * This is the actual context you'll use in your router
 * @link https://trpc.io/docs/context
 **/
export const createContext = async (opts: CreateNextContextOptions) => {
  const clerkClient = createClerkClient({
    apiKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    secretKey: process.env.CLERK_SECRET_KEY,
  });

  const s3Client = new S3Client({
    region: "eu-west-3",
    apiVersion: "2006-03-01",
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
    },
  });

  const auth = getAuth(opts.req);

  let role: Role | undefined;
  if (auth.userId) {
    const user = await prisma.user.findFirst({
      where: { id: auth.userId },
      select: { role: true },
    });
    if (user && user.role) {
      role = user.role;
    }
  }

  return await createContextInner({
    auth,
    s3Client,
    role,
    clerkClient,
  });
};

export type Context = inferAsyncReturnType<typeof createContext>;
