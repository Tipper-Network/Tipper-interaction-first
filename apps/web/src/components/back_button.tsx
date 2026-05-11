import { Button } from "./ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const BackButton = ({
  buttonText,
  callBackFunction,
  hrefLink,
}: {
  buttonText?: string;
  callBackFunction?: () => void;
  hrefLink?: string;
}) => {
  const router = useRouter();
  return (
    <Button
      variant="simple"
      onClick={
        callBackFunction
          ? callBackFunction
          : hrefLink
            ? () => router.push(hrefLink)
            : () => router.back()
      }
    >
      <ArrowLeft className="h-4 w-4" />
      Back to {buttonText ? buttonText : "previous page"}
    </Button>
  );
};

export default BackButton;
