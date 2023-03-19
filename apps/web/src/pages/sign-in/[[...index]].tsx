import { SignIn } from "@clerk/nextjs";

const SignInPage = () => (
  <div className="flex h-screen items-center justify-center bg-slate-50">
    <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
  </div>
);

export default SignInPage;
