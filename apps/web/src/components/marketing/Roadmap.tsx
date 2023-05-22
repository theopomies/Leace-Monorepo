import { RoadmapPortion } from "./RoadmapPortion";

const items = [
  {
    date: "Q4 2022",
    title: "Inception of the project and Alpha version",
    content: `The Leace team meets in their 4th year of engineering school during their study abroad year in New York.
    After struggling to find an apartment, they decide to create a platform that will make it easier for students, and anyone really, to find their next home,
    and to make it easier for landlords to find tenants.`,
    state: "completed",
  },
  {
    date: "Q1 2023",
    title: "Launch of the beta version",
    content: `After 6 months of development, the beta version of Leace is ready to be tested by a small group of users.
    Users can now create an account, set it up properly and describe their needs. Our algorithm will then match them with the best fitting landlords and apartments.
    But the choice remains theirs, they still need to swipe right to show interest in an apartment, and left to pass on it.
    If both the tenant and the landlord swipe right, they will be able to chat and schedule a visit, then negociate and send contracts through the platform.`,
    state: "completed",
  },
  {
    date: "Q2 2023",
    title: "User testing and feedback",
    content:
      "We will gather feedback from our users and improve the platform accordingly.",
    state: "in-progress",
  },
  {
    date: "Q3 2023",
    title: "Leace is ready for the public and official launch",
    content:
      "We have gathered enough feedback, fixed bugs and shipped the most requested features and are ready to launch.",
    state: "planned",
  },
] as const;

export function Roadmap() {
  return (
    <section id="roadmap" className="mt-12 py-12">
      <div className="container mx-auto">
        <h2 className="py-8 text-center text-5xl font-light">Roadmap</h2>
        <div className="wrap relative h-full overflow-hidden p-10">
          <div
            className="absolute h-full border border-gray-500 border-opacity-20"
            style={{ left: "50%" }}
          ></div>
          {items.map((item, idx) => (
            <RoadmapPortion key={idx} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}
