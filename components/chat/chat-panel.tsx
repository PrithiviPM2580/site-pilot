import { ChatStatus, UIMessage } from "ai";
import { PromptInputMessage } from "../ai-elements/prompt-input";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
} from "../ai-elements/conversation";
import ChatInput from "./chat-input";
import { Skeleton } from "../ui/skeleton";
import {
  Message,
  MessageContent,
  MessageResponse,
} from "../ai-elements/message";
import {
  Attachment,
  AttachmentPreview,
  Attachments,
} from "../ai-elements/attachments";
import { Loader } from "../ui/loader";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { AlertCircleIcon } from "lucide-react";

type ChatPanelProps = {
  className?: string;
  input: string;
  isLoading: boolean;
  isProjectLoading?: boolean;
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
  isProjectLoading,
}: ChatPanelProps) {
  return (
    <div className="relative flex flex-col flex-1 overflow-hidden pb-8">
      <Conversation className={className}>
        <ConversationContent>
          {isProjectLoading ? (
            <div className="flex flex-col gap-2 pt-2">
              <Skeleton className="w-full h-6" />
              <Skeleton className="w-full h-6" />
              <Skeleton className="w-full h-6" />
            </div>
          ) : messages.length === 0 ? (
            <ConversationEmptyState />
          ) : (
            messages.map((message, msgIndex) => {
              const attachmentFromMessage = message.parts.filter(
                (part) => part.type === "file",
              );
              return (
                <>
                  <Message from={message.role} key={message.id}>
                    <MessageContent className="text-[14.5px]">
                      {attachmentFromMessage.length > 0 && (
                        <Attachments variant="grid">
                          {attachmentFromMessage.map((part, i) => {
                            const id = `${message.id}-file-${i}`;
                            const attachmentData = { ...part, id };
                            return (
                              <Attachment
                                data={attachmentData}
                                key={id}
                                className="size-20 border-primary/20"
                              >
                                <AttachmentPreview />
                              </Attachment>
                            );
                          })}
                          {message.parts.map((part, i) => {
                            switch (part.type) {
                              case "text":
                                return (
                                  <div
                                    className="flex items-start gap-2"
                                    key={`${message.id}-text-${i}`}
                                  >
                                    <MessageResponse>
                                      {part.text}
                                    </MessageResponse>
                                  </div>
                                );

                              case "data-generation":
                                const data = (part as any).data;
                                return (
                                  <GenerationCard
                                    key={`${message.id}-gen-${i}`}
                                  />
                                );
                              default:
                                return null;
                            }
                          })}
                        </Attachments>
                      )}
                    </MessageContent>
                  </Message>
                </>
              );
            })
          )}
          {isLoading ? (
            <div className="px-2">
              <Loader />
            </div>
          ) : null}

          {status === "error" && (
            <ErrorAlert title="Chat Error" message="Something went wrong" />
          )}
        </ConversationContent>
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

function ErrorAlert({ title, message }: { title: string; message: string }) {
  return (
    <>
      <Alert variant={"destructive"} className="w-full">
        <AlertCircleIcon className="size-4" />
        <div>
          <AlertTitle>{title}</AlertTitle>
          <AlertDescription>{message}</AlertDescription>
        </div>
      </Alert>
    </>
  );
}

function GenerationCard() {
  return <div className=""></div>;
}
export default ChatPanel;
