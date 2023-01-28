/* eslint-disable @next/next/no-img-element */
import type { NextPage } from "next";
import Head from "next/head";
import { signOut } from "next-auth/react";
import { trpc } from "../utils/trpc";
import type { inferProcedureOutput } from "@trpc/server";
import type { AppRouter } from "@leace/api";
import Link from "next/link";
import axios from "axios";

const PostCard: React.FC<{
  post: inferProcedureOutput<AppRouter["post"]["getAllPost"]>[number];
}> = ({ post }) => {
  return (
    <div className="max-w-2xl rounded-lg border-2 border-gray-500 p-4 transition-all hover:scale-[101%]">
      <h2 className="text-2xl font-bold">{post.title}</h2>
      <p>{post.content}</p>
    </div>
  );
};

const Home: NextPage = () => {
  const postQuery = trpc.post.getAllPost.useQuery();

  return (
    <>
      <Head>
        <title>Leace Home</title>
        <meta name="description" content="Leace real estate" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-screen flex-col items-center">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-8">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            Leace
          </h1>
          <AuthShowcase />

          <div className="flex h-[60vh] justify-center overflow-y-scroll px-4 text-2xl">
            {postQuery.data ? (
              <div className="flex flex-col gap-4">
                {postQuery.data?.map((p) => {
                  return <PostCard key={p.id} post={p} />;
                })}
              </div>
            ) : (
              <p>Loading..</p>
            )}
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;

const AuthShowcase: React.FC = () => {
  const { data: session } = trpc.auth.getSession.useQuery();

  const { data: secretMessage } = trpc.auth.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: !!session?.user },
  );

  const mut = trpc.image.PutSignedUserUrl.useMutation();
  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (!event.target.files?.[0]) return;
    const file = event.target.files[0];
    await mut.mutateAsync({ fileType: file.type }).then(async (url) => {
      console.log(file.type);
      await axios.put(url, file);
      refetchImages();
    });
  };

  const mut2 = trpc.image.DeleteSignedUserUrl.useMutation();
  const OnclickDelete = async () => {
    if (images && images[0]) {
      await mut2.mutateAsync(images[0].id).then(async (url) => {
        await axios.delete(url);
        refetchImages();
      });
    }
  };

  const { data: images, refetch: refetchImages } =
    trpc.image.GetSignedUserUrl.useQuery();

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      {session?.user && (
        <p className="text-center text-2xl">
          {session && <span>Logged in as {session?.user?.name}</span>}
          {secretMessage && <span> - {secretMessage}</span>}
        </p>
      )}
      <Link
        className="rounded-full px-10 py-3 font-semibold no-underline transition"
        href={"/api/auth/signin"}
        onClick={
          session
            ? (e) => {
                e.preventDefault();
                signOut();
              }
            : () => null
        }
      >
        {session ? "Sign out" : "Sign in"}
      </Link>
      {(session?.user.role == "ADMIN" || session?.user.role == "MODERATOR") && (
        <Link
          className="rounded-full px-10 py-3 font-semibold no-underline transition"
          href={"/moderation/moderation"}
        >
          {"Moderation"}
        </Link>
      )}
      <input type="file" onChange={handleFileSelect} />
      <button
        className="ml-2 rounded-full bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700"
        onClick={OnclickDelete}
      />
      {images ? (
        <img
          src={images[0]?.url}
          referrerPolicy="no-referrer"
          alt="image"
          className="mx-auto h-32 rounded-full shadow-xl"
        />
      ) : (
        <></>
      )}
    </div>
  );
};
