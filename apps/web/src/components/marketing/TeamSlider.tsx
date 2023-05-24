import { useEffect, useMemo, useState } from "react";
import { TeamMemberCard } from "./TeamMemberCard";
import { AnimatePresence, motion } from "framer-motion";

const TEAM_MEMBERS = [
  {
    name: "Theo Pomies",
    title: "CTO",
    image: "/images/theo.jpeg",
    description:
      "Originaly from Bordeaux, France, Theo is a fullstack engineer with a passion for entrepreneurship. He is currently studying at Epitech from New York.",
    id: 1,
  },
  {
    name: "Gregoire Bezier",
    title: "CEO",
    image: "/images/gregoire.jpeg",
    description:
      "Originaly from Pau, France, Gregoire is a seasoned python engineer. He is currently studying at Epitech from New York.",
    id: 2,
  },
  {
    name: "Hugo Maltese",
    title: "Lead Backend Engineer",
    image: "/images/hugo.jpeg",
    description:
      "Originaly from Lyon, France, Hugo is a backend engineer that previously worked at Fruitz, a product by Bumble. He is currently studying at Epitech from New York.",
    id: 3,
  },
  {
    name: "Romain Dufourt",
    title: "Backend Engineer",
    image: "/images/romain.jpeg",
    description:
      "Originaly from Paris, France, Romain is a backend engineer. He is currently studying at Epitech from New York.",
    id: 4,
  },
  {
    name: "Oriol Figueras",
    title: "Mobile Engineer",
    image: "/images/oriol.jpeg",
    description:
      "Originaly from Barcelona, Spain, Oriol is a mobile engineer. He is currently studying at Epitech from New York.",
    id: 5,
  },
  {
    name: "David Aphing-Kouassi",
    title: "Mobile Engineer",
    image: "/images/david.jpeg",
    description:
      "Originaly from Bordeaux, France, David is a mobile engineer. He is currently studying at Epitech from California.",
    id: 6,
  },
  {
    name: "Benjamin Ziane",
    title: "Backend Engineer",
    image: "/images/benjamin.jpeg",
    description:
      "Originaly from Lyon, France, Benjamin is a Fullstack engineer. He is currently studying at Epitech from New York.",
    id: 7,
  },
  {
    name: "Etienne Mulard",
    title: "Backend Engineer",
    image: "/images/etienne.jpeg",
    description:
      "Originaly from Paris, France, Etienne is a backend engineer. He is currently studying at Epitech from Dublin.",
    id: 8,
  },
];

export const TeamSlider = () => {
  const [start, setStart] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  useEffect(() => {
    if (autoplay) {
      const interval = setInterval(() => {
        setStart((start) => (start + 1) % TEAM_MEMBERS.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [autoplay]);

  const MEMBERS_PER_SLIDE = 7;

  const shownMembers = useMemo(() => {
    return [...TEAM_MEMBERS, ...TEAM_MEMBERS].slice(
      start,
      start + MEMBERS_PER_SLIDE,
    );
  }, [start]);

  return (
    <section id="about-us" className="relative overflow-hidden py-12">
      <h2 className="py-8 text-center text-5xl font-light">
        Meet the team behind Leace
      </h2>
      <div
        className="slider flex -translate-x-24 gap-12 pt-8"
        onMouseEnter={() => setAutoplay(false)}
        onMouseLeave={() => setAutoplay(true)}
      >
        <AnimatePresence>
          {shownMembers.map((member) => (
            <motion.div
              layout
              className="flex w-[30rm] items-start justify-center"
              key={member.id}
            >
              <TeamMemberCard
                name={member.name}
                title={member.title}
                description={member.description}
                image={member.image}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
};
