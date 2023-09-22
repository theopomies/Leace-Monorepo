import { NewMatchToast } from "../components/matches/NewMatchToast";
import { NewMessageToast } from "../components/matches/NewMessageToast";
import { Button } from "../components/shared/button/Button";
import { useToast } from "../components/shared/toast/Toast";

export default function Test() {
  const { renderToast } = useToast();

  const handleShowSingleMatchToast = () => {
    renderToast(
      <NewMatchToast name="John Doe" conversationId="123" userId="123" />,
    );
  };

  const handleShowMultiMatchToast = () => {
    renderToast(<NewMatchToast count={15} userId="123" />);
  };

  const handleShowSingleMessageToast = () => {
    renderToast(
      <NewMessageToast name="John Doe" conversationId="123" userId="123" />,
    );
  };

  const handleShowMultiMessagesToast = () => {
    renderToast(<NewMessageToast count={15} userId="123" />);
  };

  return (
    <div>
      <Button onClick={handleShowSingleMatchToast}>
        Show Single Match Toast
      </Button>
      <Button onClick={handleShowMultiMatchToast}>
        Show Multiple Matches Toast
      </Button>
      <Button onClick={handleShowSingleMessageToast}>
        Show Single Message Toast
      </Button>
      <Button onClick={handleShowMultiMessagesToast}>
        Show Multiple Message Toast
      </Button>
    </div>
  );
}
