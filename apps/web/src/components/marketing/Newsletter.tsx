import { useState } from "react";
import { Button } from "../shared/button/Button";
import { Input } from "../shared/forms/Input";

export function Newsletter() {
  const [email, setEmail] = useState("");

  const handleSumbit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // TODO
    console.log(`submited user email: ${email}`);
    setEmail("");
  };

  return (
    <section
      id="newsletter"
      className="my-32 flex flex-col items-center gap-5 py-8"
    >
      <h2 className="text-5xl font-light">Join the newsletter</h2>
      <p>
        Stay up to date with all the news, insights, and updates we have coming.
      </p>
      <form className="flex gap-4 pt-4" onSubmit={handleSumbit}>
        <Input
          placeholder="Your email address"
          className="w-80 bg-slate-50 aria-[invalid]:border-red-500"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <Button type="submit">Sign Up</Button>
      </form>
    </section>
  );
}
