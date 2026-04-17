import { ChatStatus, UIMessage } from "ai";
import { PromptInputMessage } from "../ai-elements/prompt-input";
import { Conversation, ConversationContent } from "../ai-elements/conversation";
import ChatInput from "./chat-input";

type ChatPanelProps = {
  className?: string;
  input: string;
  isLoading: boolean;
  messages: UIMessage[];
  status: ChatStatus;
  setInput: (input: string) => void;
  onStop: () => void;
  error?: Error;
  onSubmit: (message: PromptInputMessage, options?: any) => void;
};

function ChatPanel({
  className,
  input,
  isLoading,
  messages,
  status,
  setInput,
  onStop,
  error,
  onSubmit,
}: ChatPanelProps) {
  return (
    <div className="relative flex flex-col flex-1 overflow-hidden pb-8">
      <Conversation className={className}>
        <ConversationContent>Hi</ConversationContent>
      </Conversation>

      <div className="p-4 bg-background border-t">
        <ChatInput
          input={input}
          isLoading={isLoading}
          status={status}
          setInput={setInput}
          onStop={onStop}
          onSubmit={onSubmit}
        />
      </div>
    </div>
  );
}

export default ChatPanel;
