import Link from "next/link";
import { Button } from "../shared/button/Button";

export function Hero() {
  return (
    <section
      id="hero"
      className="container flex flex-col items-center gap-4 py-8"
    >
      <div className="overflow-hidden rounded-full bg-white px-6 py-2">
        <ul className="relative flex gap-8">
          {Array.from({ length: 2 }).map((_, index) => (
            <li
              key={index}
              className={
                index ? "absolute translate-x-[100%] animate-bounce" : ""
              }
            >
              <span
                className={`text-xl ${index == 0 ? "text-transparent" : ""}`}
              >
                Beta available now
              </span>
            </li>
          ))}
        </ul>
      </div>
      <div className="mx-4 sm:mx-10 md:mx-20 lg:mx-60">
        <h1 className="p-4 text-center text-[5rem] font-medium leading-[5rem]">
          Doing to Real Estate what Tinder did to dating
        </h1>
        <p className="p-4 text-center leading-8 text-gray-500">
          <span className="block">
            Leace is a platform that allows you to find your next home,
            roommate, or tenant with ease.
          </span>
          <span>
            It combines the best of real estate agencies with the best of online
            listing platforms.
          </span>
        </p>
      </div>
      <div className="flex gap-4">
        <Link href="/">
          <Button>Get Started</Button>
        </Link>
        <Link href="#newsletter">
          <Button theme="white">Stay informed</Button>
        </Link>
      </div>
    </section>
  );
}
