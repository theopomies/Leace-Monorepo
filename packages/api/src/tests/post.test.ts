import { type inferProcedureInput } from "@trpc/server";
import { createContextInner } from "../context";
import { appRouter, type AppRouter } from "../router/index";
import { describe, expect, test } from "vitest";

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
    });
    const caller = appRouter.createCaller(ctx);

    const post = await caller.post.createPost(input);
    expect(post).toMatchObject(input);
    id = post.id;
  });

  test("GetbyId Post", async () => {
    const ctx = await createContextInner({
      session: null,
    });
    const caller = appRouter.createCaller(ctx);

    const getbyIdPost = await caller.post.getPost(id);
    expect(getbyIdPost).toMatchObject(input);
  });

  test("DeleteById Post", async () => {
    const ctx = await createContextInner({
      session: null,
    });
    const caller = appRouter.createCaller(ctx);

    const deleted = await caller.post.deletePost(id);
    expect(deleted).toMatchObject(input);
  });
});
