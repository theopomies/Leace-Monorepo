import { type inferProcedureInput } from "@trpc/server";
import { createContextInner } from "../context";
import { appRouter, type AppRouter } from "../tlo/index";
import { describe, expect, test } from "vitest";
import { S3Client } from "@aws-sdk/client-s3";

const param = {
  region: "eu-west-3",
  apiVersion: "2006-03-01",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
};

describe("[Router][post]", () => {
  let id = "";
  const input: inferProcedureInput<AppRouter["post"]["createPost"]> = {
    title: "NicePost",
    content: "SomeContent",
    desc: "LittleDescription",
  };

  test("Create Post", async () => {
    const ctx = await createContextInner({
      session: null,
      s3Client: new S3Client(param),
    });
    const caller = appRouter.createCaller(ctx);

    const post = await caller.post.createPost(input);
    expect(post).toMatchObject(input);
    id = post.id;
  });

  test("GetbyId Post", async () => {
    const ctx = await createContextInner({
      session: null,
      s3Client: new S3Client(param),
    });
    const caller = appRouter.createCaller(ctx);

    const getbyIdPost = await caller.post.getPost(id);
    expect(getbyIdPost).toMatchObject(input);
  });

  test("DeleteById Post", async () => {
    const ctx = await createContextInner({
      session: null,
      s3Client: new S3Client(param),
    });
    const caller = appRouter.createCaller(ctx);

    const deleted = await caller.post.deletePost(id);
    expect(deleted).toMatchObject(input);
  });
});
