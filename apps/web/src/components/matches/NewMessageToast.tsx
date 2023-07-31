import { ToastTitle } from "@radix-ui/react-toast";
import { ToastAction, ToastDescription } from "../shared/toast/Toast";
import Link from "next/link";
import { Button } from "../shared/button/Button";
import { XOR } from "../../utils/types";

type NewMessageToastProps = XOR<
  {
    name: string;
    conversationId: string;
    userId: string;
  },
  {
    count: number;
    userId: string;
  }
>;

export const NewMessageToast = ({
  name,
  conversationId,
  count,
  userId,
}: NewMessageToastProps) => {
  if (count) {
    return (
      <>
        <ToastTitle>New messages! 💬</ToastTitle>
        <ToastDescription>You have {count} new messages!</ToastDescription>
        <ToastAction altText="Go to matches page">
          <Link href="/users/${userId}/matches">
            <Button className="px-4 py-2 text-sm">Check them</Button>
          </Link>
        </ToastAction>
      </>
    );
  }

  return (
    <>
      <ToastTitle>New message! 💬</ToastTitle>
      <ToastDescription>You have a new message from {name}!</ToastDescription>
      <ToastAction altText="Go to chat with them">
        <Link href={`/users/${userId}/matches/${conversationId}`}>
          <Button className="px-4 py-2 text-sm">Chat with {name}</Button>
        </Link>
      </ToastAction>
    </>
  );
};
