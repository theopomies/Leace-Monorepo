type StackButtonProps = {
  onClick: () => void;
  className?: string;
  children: React.ReactNode;
};

export function StackButton({
  onClick,
  className,
  children,
}: StackButtonProps) {
  return (
    <button
      className={`rounded-full border-4 bg-white p-3 shadow ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
