import { useEffect, useMemo, useState } from "react";
import { TeamMemberCard } from "./TeamMemberCard";
import { AnimatePresence, motion } from "framer-motion";

const TEAM_MEMBERS = [
  {
    name: "Theo Pomies",
    title: "CTO",
    id: 1,
  },
  {
    name: "Gregoire Bezier",
    title: "CEO",
    id: 2,
  },
  {
    name: "Hugo Maltese",
    title: "Lead Backend Engineer",
    id: 3,
  },
  {
    name: "Romain Dufourt",
    title: "Backend Engineer",
    id: 4,
  },
  {
    name: "Oriol Figueras",
    title: "Mobile Engineer",
    id: 5,
  },
  {
    name: "David Aphing-Kouassi",
    title: "Mobile Engineer",
    id: 6,
  },
  {
    name: "Benjamin Ziane",
    title: "Backend Engineer",
    id: 7,
  },
  {
    name: "Etienne Mulard",
    title: "Backend Engineer",
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
                description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed neque elit, tristique quis tempus id, scelerisque sed ligula. Curabitur sed risus eget arcu hendrerit mollis."
                image={
                  "https://picsum.photos/200?random=" +
                  (member.id % TEAM_MEMBERS.length)
                }
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      {/* <style jsx>
        {`
          .slider:hover {
            animation-play-state: paused;
          }

          .slider {
            animation: 5s slide infinite linear;
          }

          @keyframes slide {
            from {
              transform: translateX(0);
            }
            to {
              transform: translateX(-50%);
            }
          }
        `}
      </style> */}
    </section>
  );
};
