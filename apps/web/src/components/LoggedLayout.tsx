import { useRouter } from "next/router";
import { NavBar } from "./NavBar";
import { useSession } from "next-auth/react";

export default function LoggedLayout({
  children,
}: {
  children: React.ReactNode;
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
    <div className="flex min-h-screen flex-row bg-gray-100">
      <NavBar />
      {children}
    </div>
  );
}
