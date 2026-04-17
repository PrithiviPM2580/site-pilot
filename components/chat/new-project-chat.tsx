import { ChatStatus } from "ai";
import { PromptInputMessage } from "../ai-elements/prompt-input";
import { motion } from "motion/react";
import { Suggestion, Suggestions } from "../ai-elements/suggestion";
import ChatInput from "./chat-input";
import { SUGGESTIONS_ITEMS } from "@/constants/index";

type NewProjectChatProps = {
  input: string;
  isLoading: boolean;
  status: ChatStatus;
  setInput: (input: string) => void;
  onStop: () => void;
  onSubmit: (message: PromptInputMessage, options?: any) => void;
};

function NewProjectChat({
  input,
  isLoading,
  status,
  setInput,
  onStop,
  onSubmit,
}: NewProjectChatProps) {
  const handleSuggestionClick = (value: string) => {
    setInput(value);
  };
  return (
    <div className="w-full relative min-h-screen">
      <div className="w-full max-w-7xl mx-auto">
        <div className="flex flex-col items-center justify-center px-4 pt-28">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl text-center mb-4 tracking-tight"
          >
            Design your website with Ai
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground text-lg mb-4 text-center max-w-lg"
          >
            Describe your vision, and watch Sleek transform your ideas into a
            stunning web
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="w-full max-w-2xl mb-4"
          >
            <ChatInput
              input={input}
              isLoading={isLoading}
              status={status}
              setInput={setInput}
              onStop={onStop}
              onSubmit={onSubmit}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="w-full max-w-3xl mb-4"
          >
            <Suggestions className="justify-center flex-wrap">
              {SUGGESTIONS_ITEMS.map((item) => (
                <Suggestion
                  key={item.label}
                  suggestion={item.value}
                  onClick={() => handleSuggestionClick(item.value)}
                >
                  {item.label}
                </Suggestion>
              ))}
            </Suggestions>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex justify-center w-full max-w-3xl mx-auto"
          >
            Projects
            {/* <ProjectGrid /> */}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default NewProjectChat;
