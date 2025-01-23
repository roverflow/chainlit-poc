import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useMemo, useState } from "react";
import { ChatHeader } from "./ui/header";
import MessageComponent from "./ui/message-component";

import { useMessageHistory } from "@/hooks/useMessageHistory";

import { generateUUID } from "@/lib/utils";
import { LoadingDots } from "@/assets/icons";

export function Playground({
  sessionId,
  startNewChat,
}: {
  sessionId: string | null;
  startNewChat: () => void;
}) {
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const { getMessages, addMessage } = useMessageHistory(sessionId);

  const messages = useMemo(
    () => (sessionId ? getMessages() : []),
    [sessionId, getMessages]
  );

  const handleSendMessage = async () => {
    const content = inputValue.trim();
    if (!content) return;

    if (!sessionId) {
      console.error("Session ID is null");
      return;
    }

    addMessage({
      id: generateUUID(),
      name: "User",
      output: content,
      time: new Date().toISOString(),
    });

    const message = {
      session_id: sessionId,
      user_input: content,
    };
    setLoading(true);
    setInputValue("");
    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/chat/response`,
        {
          method: "POST",
          headers: myHeaders,
          body: JSON.stringify(message),
          redirect: "follow",
        }
      );
      const data = await response.json();
      addMessage({
        id: generateUUID(),
        name: "Assistant",
        output: data.response,
        time: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error sending message:", error);
      addMessage({
        id: generateUUID(),
        name: "Assistant",
        output: "Sorry, I'm having trouble processing your request",
        time: new Date().toISOString(),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col">
      <ChatHeader sessionId={sessionId} startNewChat={startNewChat} />
      <div className="flex-1 overflow-auto p-6">
        <div className="space-y-4">
          {messages.map((message) => (
            <MessageComponent message={message} />
          ))}
          {loading && (
            <div className="flex justify-start w-24">
              <LoadingDots />
            </div>
          )}
        </div>
      </div>
      <div className="border-t p-4 bg-white dark:bg-gray-800 sticky bottom-0">
        <div className="flex items-center space-x-2">
          <Input
            autoFocus
            disabled={loading}
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
