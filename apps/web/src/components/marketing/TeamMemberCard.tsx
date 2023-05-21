import Image from "next/image";

export interface TeamMemberCardProps {
  name: string;
  title: string;
  description: string;
  image: string;
}

export const TeamMemberCard = ({
  image,
  name,
  title,
  description,
}: TeamMemberCardProps) => {
  return (
    <div className="flex w-full shrink-0 flex-col gap-12 rounded-3xl bg-white p-8">
      <div className="flex w-full gap-8">
        <div className="relative h-20 w-16 flex-shrink-0">
          <Image src={image} alt={name} fill className="rounded-xl" />
        </div>
        <div className="flex flex-col justify-center gap-1">
          <h3 className="text-2xl">{name}</h3>
          <p className=" text-gray-500">{title}</p>
        </div>
      </div>
      <div>
        <p className="text-sm font-light">{description}</p>
      </div>
    </div>
  );
};
