import { useState } from "react";

interface Message {
  id: string;
  name: string;
  output: string;
  time: string;
}

interface MessageHistory {
  [sessionId: string]: Message[];
}

const useMessageHistory = (sessionId: string | null) => {
  const [messageHistory, setMessageHistory] = useState<MessageHistory>({});

  const addMessage = (content: Message) => {
    if (sessionId) {
      setMessageHistory((prevHistory) => ({
        ...prevHistory,
        [sessionId]: [...(prevHistory[sessionId] || []), content],
      }));
    }
  };

  const getMessages = () => {
    return sessionId ? messageHistory[sessionId] || [] : [];
  };

  return {
    getMessages,
    addMessage,
  };
};

export { useMessageHistory };
