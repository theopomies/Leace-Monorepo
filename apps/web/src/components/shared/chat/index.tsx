import { ChatBox } from "./ChatBox";
import { ChatList } from "./ChatList";
import { MessageWithSender } from "./ChatMessage";

export type ChatProps = {
  userId: string;
  messages: MessageWithSender[];
  onSend?: (content: string) => void;
};

export const Chat = ({ userId, messages, onSend }: ChatProps) => {
  return (
    <div className="flex w-full items-center justify-center rounded-lg bg-slate-50 shadow-lg">
      <div className="flex h-full w-full text-gray-800 antialiased">
        <div className="flex w-full flex-row overflow-x-hidden">
          <ChatList />
          <ChatBox userId={userId} messages={messages} onSend={onSend} />
        </div>
      </div>
    </div>
  );
};
