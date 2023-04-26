import { useSession } from "@clerk/nextjs";
import { Loader } from "../../components/shared/Loader";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";
import { useEffect, useState } from "react";

export default function CreateUser() {
  const session = useSession();
  const createUser = trpc.user.createUser.useMutation();
  const router = useRouter();
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (!session.isLoaded || !session || redirecting || !session.isSignedIn) {
      return;
    }
    setRedirecting(true);

    createUser
      .mutateAsync()
      .catch((err) => {
        console.error(err);
      })
      .then(() => {
        router.push("/"); // Redirect to home page
      });
  }, [session, createUser, router, redirecting]);

  if (!session.isLoaded) {
    return <Loader />;
  }

  if (!session.isSignedIn) {
    router.push("/sign-in");
    return <Loader />;
  }

  return <Loader />;
}
