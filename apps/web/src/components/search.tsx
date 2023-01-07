import React from "react";
import { trpc } from "../utils/trpc";

const Search = () => {
  const [userId, setUserId] = React.useState("");

  trpc.moderation.getById.useQuery(userId);

  return (
    <div className="flex items-center justify-center px-96">
      <div className="flex w-full flex-col p-2 py-6">
        <div
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
          <a href={`/moderation/home?uid=${userId}`} className="cursor-pointer">
            <div className="mx-2 cursor-pointer rounded-full bg-gray-600 p-2 hover:bg-blue-400">
              <svg
                className="h-6 w-6 text-white"
                xmlns="http://www.w3.org/2000/svg"
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
          </a>
        </div>
      </div>
    </div>
  );
};

export default Search;
