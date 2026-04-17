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
  return <div>ChatInput</div>;
}

export default ChatInput;
