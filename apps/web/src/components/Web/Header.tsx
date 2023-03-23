import React from "react";

function Header({ heading }: { heading: string }) {
  return (
    <header className="h-20">
      <br />
      <h1
        style={{ textAlign: "center" }}
        className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 dark:text-white md:text-5xl lg:text-6xl"
      >
        {heading}
      </h1>
    </header>
  );
}

export default Header;
