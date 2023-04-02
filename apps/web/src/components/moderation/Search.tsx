import { useRouter } from "next/router";
import { useState } from "react";

export interface SearchProps {
  setUid: React.Dispatch<React.SetStateAction<string>>;
}

export const Search = ({ setUid }: SearchProps) => {
  const router = useRouter();
  const [userId, setUserId] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userId) return;
    setUid(userId);
    router.push(`?id=${userId}`);
  };

  return (
    <div className="flex w-full items-center justify-center">
      <div className="flex w-full flex-col p-2 py-6">
        <form
          onSubmit={handleSubmit}
          className="sticky mb-5 flex w-full items-center justify-between rounded-full bg-white p-2 shadow-lg"
          style={{ top: "5px" }}
        >
          <input
            className="focus:shadow-outline ml-2 w-full rounded-full bg-gray-100 py-4 pl-4 text-xs font-bold uppercase leading-tight text-gray-700 focus:outline-none lg:text-sm"
            type="text"
            placeholder="Search"
            onChange={(e) => setUserId(e.target.value)}
            value={userId}
          />
          <button>
            <div className="mx-2 cursor-pointer rounded-full bg-gray-600 p-2 hover:bg-blue-400">
              <svg
                className="h-6 w-6 text-white"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </button>
        </form>
      </div>
    </div>
  );
};
