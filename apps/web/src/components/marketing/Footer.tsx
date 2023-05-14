import Link from "next/link";
import { sections } from "./Navbar";

export function Footer() {
  return (
    <nav className="mt-12 bg-black p-4 text-white">
      <div className="container m-auto flex justify-between">
        <div>
          <strong className="text-lg">Leace</strong>
        </div>
        <div className="font-light text-gray-300">
          <ul className="flex gap-10">
            {sections.map(({ label, href }) => (
              <li key={label} className="hover:underline">
                <Link href={href}>{label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}
