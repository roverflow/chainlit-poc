import SBILogo from "../../assets/sbi-life.png";

function ChatHeader({
  sessionId,
  startNewChat,
}: {
  sessionId: string | null;
  startNewChat: () => void;
}) {
  return (
    <header className="flex sticky top-0 bg-background py-1.5 items-center justify-between px-2 md:px-2 gap-2 border-b">
      <div className="flex items-center gap-2">
        <img src={SBILogo} alt="SBI Life" className="h-14" />
        <div className="text-lg flex flex-col font-bold text-black">
          <span>SBI Life - {sessionId}</span>
        </div>
      </div>
      <button
        onClick={startNewChat}
        className="border border-[#0091EA] text-[#0091EA] bg-white px-4 py-2 rounded-md hover:border-2-[#0091EA]"
      >
        + New Chat
      </button>
    </header>
  );
}

export { ChatHeader };
