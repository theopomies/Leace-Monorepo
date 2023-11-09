import {
  RedirectToSignIn,
  SignedIn,
  SignedOut,
  useSession,
} from "@clerk/nextjs";
import { Loader } from "../../components/shared/Loader";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";
import { useEffect, useMemo, useState } from "react";

export default function CreateUser() {
  const session = useSession();
  const createUser = trpc.user.createUser.useMutation();
  const router = useRouter();
  const [redirecting, setRedirecting] = useState(false);

  const from = useMemo(() => {
    const from = router.query.from;
    if (typeof from === "string") {
      // Decode the url encoded string
      return decodeURIComponent(from);
    }
    return "/";
  }, [router.query.from]);

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
        router.push(from); // Redirect to home page
      });
  }, [session, createUser, router, redirecting, from]);

  if (!session.isLoaded) {
    return <Loader />;
  }

  return (
    <>
      <SignedIn>
        <Loader />
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn
          afterSignUpUrl={"/users/create"}
          afterSignInUrl={router.asPath}
        />
      </SignedOut>
    </>
  );
}
