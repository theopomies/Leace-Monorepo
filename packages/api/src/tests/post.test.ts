import { type inferProcedureInput } from "@trpc/server";
import { createContextInner } from "../context";
import { appRouter, type AppRouter } from "../router/index";
import { describe, expect, test } from "vitest";
import { PostType } from "@leace/db";

describe("[Router][post]", () => {
  let id = "";
  const input: inferProcedureInput<AppRouter["post"]["create"]> = {
    createdBy: "",
    type: PostType.WAITING_FOR_RENT,
    title: "NicePost",
    content: "SomeContent",
    desc: "LittleDescription",
    price: 1200,
    duration: new Date(10),
    size: 30,
    furnished: true,
  };

  test("Create Post", async () => {
    const ctx = await createContextInner({
      session: null,
    });
    const caller = appRouter.createCaller(ctx);

    const post = await caller.post.create(input);
    expect(post).toMatchObject(input);
    id = post.id;
  });

  test("GetbyId Post", async () => {
    const ctx = await createContextInner({
      session: null,
    });
    const caller = appRouter.createCaller(ctx);

    const getbyIdPost = await caller.post.byId(id);
    expect(getbyIdPost).toMatchObject(input);
  });

  test("DeleteById Post", async () => {
    const ctx = await createContextInner({
      session: null,
    });
    const caller = appRouter.createCaller(ctx);

    const deleted = await caller.post.deleteById(id);
    expect(deleted).toMatchObject(input);
  });
});
