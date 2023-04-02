import { useRouter } from "next/router";
import { NavBar } from "./navbar/NavBar";
import Head from "next/head";
import { Role } from "@prisma/client";
import { trpc } from "../../../utils/trpc";

export interface LoggedLayoutProps {
  children: React.ReactNode;
  title: string;
  roles?: Role[];
}

export function LoggedLayout({
  children,
  title,
  roles = [],
}: LoggedLayoutProps) {
  const { data: session, isLoading } = trpc.auth.getSession.useQuery();
  const router = useRouter();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!session) {
    router.push("/sign-in");
    return null;
  }

  if (
    roles.length > 0 &&
    (!session.role || (roles && !roles.includes(session.role)))
  ) {
    children = <div>Not authorized</div>;
  }

  return (
    <>
      <Head>
        <title>{title ?? "Leace"}</title>
      </Head>
      <div className="flex min-h-screen flex-row bg-gray-100">
        <NavBar userId={session.userId} />
        {children}
      </div>
    </>
  );
}
