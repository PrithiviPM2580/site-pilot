import { ChatStatus } from "ai";
import { PromptInputMessage } from "../ai-elements/prompt-input";
import { useAuth } from "@insforge/nextjs";
import { useState } from "react";

type ChatInputProps = {
  input: string;
  isLoading: boolean;
  status: ChatStatus;
  setInput: (input: string) => void;
  onStop: () => void;
  onSubmit: (message: PromptInputMessage, options: any) => void;
};

function ChatInput({
  input,
  isLoading,
  status,
  setInput,
  onStop,
  onSubmit,
}: ChatInputProps) {
  const { isSignedIn } = useAuth();
  const [showAuthBanner, setShowAuthBanner] = useState<boolean>(false);

  const handleSubmit = (message: PromptInputMessage) => {
    if (!isSignedIn) {
      setShowAuthBanner(true);
      return;
    }

    setShowAuthBanner(false);
    onSubmit(message, {});
  };
  return <div className="w-full flex flex-col gap-2"></div>;
}

export default ChatInput;
