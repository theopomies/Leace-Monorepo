import { SignUp } from "@clerk/nextjs";

const SignUpPage = () => (
  <div className="flex h-screen items-center justify-center bg-slate-50">
    <SignUp
      path="/sign-up"
      routing="path"
      signInUrl="/sign-in"
      afterSignUpUrl={"/users/create"}
    />
  </div>
);

export default SignUpPage;
