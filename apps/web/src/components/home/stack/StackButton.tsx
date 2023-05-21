type StackButtonProps = {
  children: React.ReactNode;
  onClick: () => void;
};

export function StackButton({ onClick, children }: StackButtonProps) {
  return (
    <button className="rounded-full bg-white p-2 shadow-md" onClick={onClick}>
      {children}
    </button>
  );
}
