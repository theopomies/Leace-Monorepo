import React from "react";

export function Header({ heading }: { heading: string }) {
  return (
    <header className="h-20">
      <h1 className="mb-4 mt-8 text-center text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl">
        {heading}
      </h1>
    </header>
  );
}
