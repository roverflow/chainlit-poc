import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChatHeader } from "./ui/header";
import MessageComponent from "./ui/message-component";

import { useMessageHistory } from "@/hooks/useMessageHistory";

import { generateUUID } from "@/lib/utils";
import { LoadingDots } from "@/assets/icons";
import useWhisper from "@/hooks/useWhisper";
import { Mic, MicOff } from "lucide-react";

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

  const { isRecording, transcription, startRecording, stopRecording } =
    useWhisper();

  const messages = useMemo(
    () => (sessionId ? getMessages() : []),
    [sessionId, getMessages]
  );

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

  useEffect(() => {
    setInputValue(transcription || "");
  }, [transcription]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col">
      <ChatHeader sessionId={sessionId} startNewChat={startNewChat} />
      <div className="flex-1 overflow-auto p-6">
        <div className="space-y-4">
          {messages.map((message) => (
            <MessageComponent key={message.id} message={message} />
          ))}
          {loading && (
            <div className="flex justify-start w-24">
              <LoadingDots />
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <div className="border-t p-4 bg-white dark:bg-gray-800 sticky bottom-0">
        <div className="flex items-center justify-center space-x-2">
          <button
            className="p-2 rounded-full bg-[#0091EA] text-white mx-2"
            onMouseDown={startRecording}
            onMouseUp={stopRecording}
            onTouchStart={startRecording}
            onTouchEnd={stopRecording}
          >
            {!isRecording ? <MicOff /> : <Mic />}
          </button>
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
