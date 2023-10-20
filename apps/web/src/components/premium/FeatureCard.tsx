export interface FeatureCardProps {
  name: string;
  description: string;
  icon: React.ReactNode;
}

export const FeatureCard = (feature: FeatureCardProps) => {
  return (
    <div className="h-full rounded-2xl bg-blue-400 p-3 text-white backdrop-blur-sm duration-500 ease-in hover:scale-105">
      <div className="flex items-center space-x-2">
        {feature.icon}
        <h2 className="text-xl font-bold">{feature.name}</h2>
      </div>
      <p>{feature.description}</p>
    </div>
  );
};
