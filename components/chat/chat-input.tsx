import { ChatStatus } from "ai";
import {
  PromptInput,
  PromptInputActionAddAttachments,
  PromptInputActionMenu,
  PromptInputActionMenuContent,
  PromptInputActionMenuTrigger,
  PromptInputBody,
  PromptInputFooter,
  PromptInputMessage,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
  usePromptInputAttachments,
} from "../ai-elements/prompt-input";
import { useAuth } from "@insforge/nextjs";
import { useState } from "react";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "../ui/item";
import { ArrowUpIcon, LockIcon, Square, XIcon } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import {
  Attachment,
  AttachmentPreview,
  AttachmentRemove,
  Attachments,
} from "../ai-elements/attachments";

type ChatInputProps = {
  input: string;
  isLoading: boolean;
  status: ChatStatus;
  setInput: (input: string) => void;
  onStop: () => void;
  onSubmit: (message: PromptInputMessage, options?: any) => void;
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
  return (
    <div className="w-full flex flex-col gap-2">
      {!showAuthBanner && (
        <Item
          variant="outline"
          size="sm"
          className="bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/30 animate-in fade-in slide-in-from-bottom-2 duration-200"
        >
          <ItemMedia variant="icon" className="bg-transparent">
            <LockIcon />
          </ItemMedia>
          <ItemContent>
            <ItemTitle className="text-sm">Sign in to continue</ItemTitle>
            <ItemDescription>
              Create a free account to start designing with SitePilot.
            </ItemDescription>
          </ItemContent>
          <ItemActions>
            <Button asChild variant="outline" size="sm">
              <Link href="/sign-in">Login</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/sign-up">Sign up</Link>
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setShowAuthBanner(false)}
            >
              <XIcon className="size-3.5" />
            </Button>
          </ItemActions>
        </Item>
      )}

      <PromptInput
        globalDrop
        className="rounded-xl shadow-md bg-background border "
        onSubmit={handleSubmit}
      >
        <PromptInputAttachmentsDisplay />
        <PromptInputBody>
          <PromptInputTextarea
            placeholder="Describe your design vision..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="pt-5"
          />
        </PromptInputBody>
        <PromptInputFooter>
          <PromptInputTools>
            <PromptInputActionMenu>
              <PromptInputActionMenuTrigger>
                <PromptInputActionMenuContent>
                  <PromptInputActionAddAttachments />
                </PromptInputActionMenuContent>
              </PromptInputActionMenuTrigger>
            </PromptInputActionMenu>
          </PromptInputTools>
          {isLoading ? (
            <StopButton onStop={onStop} />
          ) : (
            <PromptInputSubmit
              status={status}
              disabled={!input.trim() || isLoading}
              className="absolute right-2 rounded-full bottom-1.5"
            >
              <ArrowUpIcon size={25} />
            </PromptInputSubmit>
          )}
        </PromptInputFooter>
      </PromptInput>
    </div>
  );
}

function PromptInputAttachmentsDisplay() {
  const attachments = usePromptInputAttachments();

  if (attachments.files.length === 0) {
    return null;
  }

  return (
    <Attachments
      variant="grid"
      className="w-full px-4 justify-start flex-nowrap min-h-20 h-auto overflow-x-auto ml-0"
    >
      {attachments.files.map((attachment) => (
        <Attachment
          data={attachment}
          key={attachment.id}
          onRemove={() => attachments.remove(attachment.id)}
        >
          <AttachmentPreview />
          <AttachmentRemove />
        </Attachment>
      ))}
    </Attachments>
  );
}

function StopButton({ onStop }: { onStop: () => void }) {
  return (
    <Button
      size="icon"
      className="bg-muted rounded-full dark:bg-black border cursor-pointer"
      onClick={onStop}
    >
      <Square fill="black" size={14} className="text-black dark:text-white" />
    </Button>
  );
}

export default ChatInput;
