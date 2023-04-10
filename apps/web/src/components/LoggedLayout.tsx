import { useRouter } from "next/router";
import { NavBar } from "./NavBar";
import Head from "next/head";
import { useSession } from "@clerk/nextjs";
import { trpc } from "../utils/trpc";
import { BanMessage } from "./Moderation/Ban/BanMessage";

export function LoggedLayout({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  const session = useSession();
  const router = useRouter();
  const { data: auth } = trpc.auth.getSession.useQuery();

  if (!session.isLoaded) {
    return <p>Loading...</p>;
  }

  if (!session.isSignedIn) {
    router.push("/sign-in");
    return null;
  }

  return (
    <>
      <Head>
        <title>{title ?? "Leace"}</title>
      </Head>
      <div className="flex min-h-screen flex-row bg-gray-100">
        <NavBar />
        {auth && auth.ban ? <BanMessage ban={auth.ban} /> : children}
      </div>
    </>
  );
}
