import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as Dialog from "@radix-ui/react-dialog";
import { useRouter } from "next/navigation";
import { featureList } from "./PremiumPage";

export interface PremiumDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function PremiumDialog({ open, setOpen }: PremiumDialogProps) {
  const router = useRouter();

  const redirectToPremium = () => {
    router.push("/premium");
    setOpen(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-gray-300 opacity-70" />
        <Dialog.Content asChild>
          <div className="fixed top-[50%] left-[50%] h-[50vh] w-[70vh] -translate-x-[50%] -translate-y-[50%] rounded-xl bg-gradient-to-tl from-blue-200 to-gray-200 p-10">
            <div className="flex flex-col items-center justify-center space-y-10">
              <h1 className="text-center text-6xl font-extrabold text-gray-600">
                LEACE <b className="font-extrabold text-blue-400">Premium</b>
              </h1>
              <ul className="space-y-4 rounded-xl bg-white p-4 text-2xl font-bold text-gray-600">
                {featureList.map((feature, index) => (
                  <li
                    key={index}
                    className="text-gray 500 flex justify-center space-x-4"
                  >
                    <FontAwesomeIcon className="text-3xl" icon={feature.icon} />
                    <span>{feature.name}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={redirectToPremium}
                className="transform rounded-full bg-blue-400 px-10 py-6 text-2xl font-bold text-white shadow-lg transition duration-500 ease-in-out hover:scale-105"
              >
                Click here to know more
              </button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
