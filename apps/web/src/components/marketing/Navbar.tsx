import Link from "next/link";
import { Button } from "../shared/button/Button";

const sections = [
  {
    label: "Vision",
    href: "#vision",
  },
  {
    label: "About",
    href: "#about",
  },
  {
    label: "Roadmap",
    href: "#roadmap",
  },
  {
    label: "Newsletter",
    href: "#newsletter",
  },
];

export function Navbar() {
  return (
    <nav className="container m-auto flex items-center justify-between p-10">
      <div>
        <strong className="text-lg">Leace</strong>
      </div>
      <div>
        <ul className="flex gap-10">
          {sections.map(({ label, href }) => (
            <li key={label}>
              <Link href={href}>{label}</Link>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <Link href={"/"}>
          <Button>Get Started</Button>
        </Link>
      </div>
    </nav>
  );
}
