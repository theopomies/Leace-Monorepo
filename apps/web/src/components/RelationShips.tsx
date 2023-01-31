/* eslint-disable @next/next/no-img-element */
import { Conversation, Message, Post, RelationShip, User } from "@leace/db";
import { useEffect, useRef, useState } from "react";
import { trpc } from "../utils/trpc";

const DisplayChat = () => {
  const [input, setInput] = useState("");

  const handleSend = () => {
    console.log(input);
  };

  return (
    <div className="mt-3 flex h-16 w-full flex-row items-center rounded-xl bg-white px-4">
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
          onKeyDown={(e) => {
            e.key === "Enter" && handleSend();
          }}
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
      <button
        className="ml-4 flex flex-shrink-0 items-center justify-center rounded-xl bg-indigo-500 px-4 py-1 text-white hover:bg-indigo-600"
        onClick={handleSend}
      >
        <span>Envoyer</span>
        <span className="ml-2">
          <svg
            className="-mt-px h-4 w-4 rotate-45 transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
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
    </div>
  );
};

const DisplayMessage = (props: {
  messages: (Message & {
    sender: User;
  })[];
  userId: string;
  chatOn: boolean | undefined;
}) => {
  const msgRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    if (msgRef.current) {
      msgRef.current.scrollTo({
        top: document.body.scrollHeight,
        left: 0,
        behavior: "smooth",
      });
    }
  });

  return (
    <div className="flex h-full w-full flex-auto flex-col p-6">
      <div className="flex h-full w-full flex-auto flex-shrink-0 flex-col rounded-2xl bg-gray-100 p-4">
        <div ref={msgRef} className="flex h-full w-full flex-col overflow-auto">
          <div className="flex h-full flex-col">
            {props.messages?.map((message) => (
              <div key={message.id} className="grid grid-cols-12 gap-y-2">
                {message.senderId === props.userId ? (
                  <div className="col-start-6 col-end-13 rounded-lg p-3">
                    <div className="flex flex-row-reverse items-center justify-start">
                      <div
                        className={`${
                          !message.sender.image && "bg-indigo-500"
                        } flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full uppercase`}
                      >
                        {message.sender.image ? (
                          <img
                            src={message.sender.image}
                            referrerPolicy="no-referrer"
                            alt="image"
                            className="mx-auto h-full rounded-full"
                          />
                        ) : (
                          message.sender.firstName?.charAt(0)
                        )}
                      </div>
                      <div className="mr-3 flex w-fit break-words rounded-xl bg-indigo-100 py-2 px-4 text-sm shadow">
                        {message.content}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="col-start-1 col-end-8 rounded-lg p-3">
                    <div className="flex flex-row items-center">
                      <div
                        className={`${
                          !message.sender.image && "bg-indigo-500"
                        } flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full uppercase`}
                      >
                        {message.sender.image ? (
                          <img
                            src={message.sender.image}
                            referrerPolicy="no-referrer"
                            alt="image"
                            className="mx-auto h-full rounded-full"
                          />
                        ) : (
                          message.sender.firstName?.charAt(0)
                        )}
                      </div>
                      <div className="ml-3 flex w-fit break-words rounded-xl bg-white py-2 px-4 text-sm shadow">
                        {message.content}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        {props.chatOn && <DisplayChat />}
      </div>
    </div>
  );
};

const RelationShips = (props: {
  userId: string;
  relationShips: (RelationShip & {
    user: User;
    conversation:
      | (Conversation & { messages: (Message & { sender: User })[] })
      | null;
    post: Post & { createdBy: User };
  })[];
  chatOn?: boolean;
}) => {
  const [messages, setMessages] = useState(
    props.relationShips && props.relationShips[0]?.conversation?.messages,
  ); //trouver le type

  useEffect(() => {
    if (props.relationShips && !messages)
      setMessages(props.relationShips[0]?.conversation?.messages);
  }, [props.relationShips, messages]);

  return (
    <div className="flex h-full w-full text-gray-800 antialiased">
      <div className="flex h-full w-full flex-row overflow-x-hidden">
        <div className="flex h-full w-1/5 flex-shrink-0 flex-col rounded-tl-lg rounded-bl-lg bg-white pb-6">
          <div className="flex w-full flex-row items-center justify-center rounded-tl-lg bg-indigo-500 p-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-700">
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
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                ></path>
              </svg>
            </div>
            <div className="ml-2 text-2xl font-bold">Leace</div>
          </div>
          <div className="mt-8 flex flex-col overflow-auto px-5">
            <div className="flex flex-row items-center justify-between pl-2 text-xs">
              <span className="font-bold">Conversations</span>
              <span className="flex w-4 items-center justify-center rounded-full bg-gray-300">
                {props.relationShips?.length}
              </span>
            </div>
            <div className="mt-4 flex h-full w-full flex-col space-y-1">
              {props.relationShips?.map((relationShip) => (
                <button
                  key={relationShip.id}
                  className="flex flex-row items-center rounded-xl p-2 hover:bg-gray-100"
                  onClick={() =>
                    setMessages(relationShip.conversation?.messages)
                  }
                >
                  {relationShip.user.id === props.userId ? (
                    <div
                      className={`${
                        !relationShip.post?.createdBy.image && "bg-gray-200"
                      } flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full uppercase`}
                    >
                      {relationShip.post?.createdBy.image ? (
                        <img
                          src={relationShip.post.createdBy.image}
                          referrerPolicy="no-referrer"
                          alt="image"
                          className="mx-auto h-full rounded-full"
                        />
                      ) : (
                        relationShip.post?.createdBy.firstName?.charAt(0)
                      )}
                    </div>
                  ) : (
                    <div
                      className={`${
                        !relationShip.user.image && "bg-gray-200"
                      } flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full uppercase`}
                    >
                      {relationShip.user.image ? (
                        <img
                          src={relationShip.user.image}
                          referrerPolicy="no-referrer"
                          alt="image"
                          className="mx-auto h-full rounded-full"
                        />
                      ) : (
                        relationShip.user.firstName?.charAt(0)
                      )}
                    </div>
                  )}
                  <div className="ml-2 text-sm font-semibold">
                    {relationShip.user.id === props.userId
                      ? `${relationShip.post?.createdBy.firstName} ${relationShip.post?.createdBy.lastName}`
                      : `${relationShip.user?.firstName} ${relationShip.user?.lastName}`}
                  </div>
                  <div className="ml-auto flex h-4 w-4 items-center justify-center rounded bg-red-500 text-xs leading-none text-white">
                    {relationShip.conversation?.messages?.length}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
        {messages && (
          <DisplayMessage
            messages={messages}
            userId={props.userId}
            chatOn={props.chatOn}
          />
        )}
      </div>
    </div>
  );
};

export default RelationShips;
