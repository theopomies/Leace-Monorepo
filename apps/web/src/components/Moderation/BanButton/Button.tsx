export interface ButtonProps {
  handleClick: () => void;
  isBanned: boolean;
}

export const Button = ({ handleClick, isBanned }: ButtonProps) => {
  return (
    <div className="flex w-full flex-col items-center justify-center px-10">
      <button
        className={`${
          isBanned
            ? "bg-blue-500 hover:bg-blue-700"
            : "bg-red-500 hover:bg-red-700"
        } rounded-full py-2 px-4 font-bold text-white`}
        onClick={handleClick}
      >
        {isBanned ? "Débannir" : "Bannir"}
      </button>
    </div>
  );
};
