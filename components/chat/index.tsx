"use client";

import { useEffect, useState } from "react";
import { generateSlugId } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { toast } from "sonner";
import { PromptInputMessage } from "../ai-elements/prompt-input";
import NewProjectChat from "./new-project-chat";

type ChatInterfaceProps = {
  isProjectPage?: boolean;
  slugId?: string;
};

function ChatInterface({
  isProjectPage = false,
  slugId: propSlugId,
}: ChatInterfaceProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [slugId, setSlugId] = useState(() => propSlugId || generateSlugId());

  const [input, setInput] = useState<string>("");
  const [projectTitle, setProjectTitle] = useState<string | null>(null);
  const [hasStarted, setHasStarted] = useState<boolean>(isProjectPage);
  const { messages, setMessages, sendMessage, status, error, stop } = useChat({
    messages: [],
    transport: new DefaultChatTransport({
      api: "/api/project",
      prepareSendMessagesRequest: ({ messages, body }) => {
        return {
          body: {
            ...body,
            messages,
          },
        };
      },
    }),
    onError: (err) => {
      console.log("Chat error:", err);
      toast.error("Failed to generate response");
    },
  });

  useEffect(() => {
    const checkReset = () => {
      if (window.location.pathname === "/" && (hasStarted || isProjectPage)) {
        setSlugId(generateSlugId());
        setMessages([]);
        setHasStarted(false);
        setProjectTitle(null);
      }
    };
    window.addEventListener("popstate", checkReset);

    if (pathname === "/" && hasStarted) {
      checkReset();
    }

    return () => {
      window.removeEventListener("popstate", checkReset);
    };
  }, [pathname, hasStarted, isProjectPage, setMessages]);

  const isLoading = status === "submitted" || status === "streaming";

  const onSubmit = async (message: PromptInputMessage, options: any = {}) => {
    if (message.text.trim()) {
      toast.error("Please enter a message");
      return;
    }

    if (!isProjectPage && !hasStarted) {
      window.history.pushState(null, "", `/project/${slugId}`);
      setHasStarted(true);
    }

    sendMessage(
      {
        text: message.text,
        files: message.files,
      },
      {
        body: {
          ...options,
          slugId,
        },
      },
    );
    setInput("");
  };

  if (!isProjectPage && !hasStarted) {
    return (
      <NewProjectChat
        input={input}
        setInput={setInput}
        isLoading={isLoading}
        status={status}
        onStop={stop}
        onSubmit={onSubmit}
      />
    );
  }

  return <div>ChatInterface</div>;
}

export default ChatInterface;
