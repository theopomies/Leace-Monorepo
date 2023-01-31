import { useRouter } from "next/router";
import { NavBar } from "./NavBar";
import { useSession } from "next-auth/react";
import Head from "next/head";

export default function LoggedLayout({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  const { status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (status === "unauthenticated") {
    router.push("/api/auth/signin");
    return null;
  }

  return (
    <>
      <Head>
        <title>{title ?? "Leace"}</title>
      </Head>
      <div className="flex min-h-screen flex-row bg-gray-100">
        <NavBar />
        {children}
      </div>
    </>
  );
}
