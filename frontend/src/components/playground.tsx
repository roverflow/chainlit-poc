import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useChatInteract, useChatMessages } from "@chainlit/react-client";
import { useMemo, useState } from "react";
import { ChatHeader } from "./ui/header";
import MessageComponent from "./ui/message-component";

import { flattenMessages } from "@/lib/utils";

export function Playground() {
  const [inputValue, setInputValue] = useState("");
  const { sendMessage } = useChatInteract();
  const { messages } = useChatMessages();

  const flatMessages = useMemo(() => {
    return flattenMessages(messages, (m) => m.type.includes("message"));
  }, [messages]);

  const handleSendMessage = () => {
    const content = inputValue.trim();
    if (content) {
      const message = {
        name: "user",
        type: "user_message" as const,
        output: content,
      };
      sendMessage(message, []);
      setInputValue("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col">
      <ChatHeader />
      <div className="flex-1 overflow-auto p-6">
        <div className="space-y-4">
          {flatMessages.map((message) => (
            <MessageComponent message={message} />
          ))}
        </div>
      </div>
      <div className="border-t p-4 bg-white dark:bg-gray-800">
        <div className="flex items-center space-x-2">
          <Input
            autoFocus
            className="flex-1 ring-0 focus:ring-0"
            id="message-input"
            placeholder="Type a message"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyUp={(e) => {
              if (e.key === "Enter") {
                handleSendMessage();
              }
            }}
          />
          <Button
            className="bg-[#0091EA]"
            onClick={handleSendMessage}
            type="submit"
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}
