import { useSession } from "@clerk/nextjs";
import { Loader } from "../../components/shared/Loader";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";
import { useEffect } from "react";

export default function CreateUser() {
  const session = useSession();
  const createUser = trpc.user.createUser.useMutation();
  const router = useRouter();

  useEffect(() => {
    if (!session.isLoaded || !session) {
      return;
    }

    createUser
      .mutateAsync()
      .then(() => {
        router.push("/"); // Redirect to home page
      })
      .catch((err) => {
        console.error(err);
        router.push("/"); // Redirect to home page
      });
  }, [session, createUser, router]);

  if (!session.isLoaded) {
    return <Loader />;
  }

  if (!session) {
    router.push("/sign-in");
    return <Loader />;
  }

  return <Loader />;
}
