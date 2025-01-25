import { useState, useRef } from "react";

const apiEndpoint = "https://api.openai.com/v1/audio/transcriptions";
const apiKey = import.meta.env.VITE_OPENAI_API_TOKEN;

const useWhisper = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.error("Media devices not supported");
      return;
    }

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;

    mediaRecorder.ondataavailable = (event) => {
      audioChunksRef.current.push(event.data);
    };

    mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
      audioChunksRef.current = [];

      const formData = new FormData();
      formData.append("file", audioBlob, "recording.wav");
      formData.append("model", "whisper-1");

      try {
        const response = await fetch(apiEndpoint, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Failed to send audio");
        }

        const data = await response.json();
        setTranscription(data.text);
        console.log("Audio sent successfully");

        console.log("Audio sent successfully");
      } catch (error) {
        console.error("Error sending audio:", error);
      }
    };

    mediaRecorder.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return {
    isRecording,
    transcription,
    startRecording,
    stopRecording,
  };
};

export default useWhisper;
