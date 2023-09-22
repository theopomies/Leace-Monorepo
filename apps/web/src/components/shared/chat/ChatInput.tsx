import { FormEventHandler, useState } from "react";

export interface ChatInputProps {
  receiverId: string;
  onSend: (message: string, userId: string) => void;
}

export const ChatInput = ({ onSend, receiverId }: ChatInputProps) => {
  const [input, setInput] = useState("");

  const handleSend: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (!input) return;
    onSend(input, receiverId);
    setInput("");
  };

  return (
    <form
      onSubmit={handleSend}
      className="mt-3 flex h-16 w-full flex-row items-center rounded-xl bg-white px-4"
    >
      <button className="flex items-center justify-center text-gray-400 hover:text-gray-600">
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
          ></path>
        </svg>
      </button>
      <div className="relative ml-4 w-full flex-grow">
        <input
          type="text"
          className="flex h-10 w-full rounded-xl border pl-4 focus:border-indigo-300 focus:outline-none"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button className="absolute right-0 top-0 flex h-full w-12 items-center justify-center text-gray-400 hover:text-gray-600">
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
        </button>
      </div>
      <button className="ml-4 flex flex-shrink-0 items-center justify-center rounded-xl bg-indigo-500 px-4 py-1 text-white hover:bg-indigo-600">
        <span>Envoyer</span>
        <span className="ml-2">
          <svg
            className="-mt-px h-4 w-4 rotate-45 transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            ></path>
          </svg>
        </span>
      </button>
    </form>
  );
};
