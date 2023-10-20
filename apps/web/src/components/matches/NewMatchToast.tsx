import { ToastTitle } from "@radix-ui/react-toast";
import { ToastAction, ToastDescription } from "../shared/toast/Toast";
import Link from "next/link";
import { Button } from "../shared/button/Button";
import { XOR } from "../../utils/types";

type NewMatchToastProps = XOR<
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

export const NewMatchToast = ({
  name,
  conversationId,
  count,
  userId,
}: NewMatchToastProps) => {
  if (count) {
    return (
      <>
        <ToastTitle>New matches! 🎉</ToastTitle>
        <ToastDescription>You have {count} new matches!</ToastDescription>
        <ToastAction altText="Go to matches page">
          <Link href="/users/${userId}/matches">
            <Button className="px-4 py-2 text-sm">View matches</Button>
          </Link>
        </ToastAction>
      </>
    );
  }

  return (
    <>
      <ToastTitle>New match! 🎉</ToastTitle>
      <ToastDescription>You have a new match with {name}!</ToastDescription>
      <ToastAction altText="Go to chat with them">
        <Link href={`/users/${userId}/matches/${conversationId}`}>
          <Button className="px-4 py-2 text-sm">Chat with {name}</Button>
        </Link>
      </ToastAction>
    </>
  );
};
