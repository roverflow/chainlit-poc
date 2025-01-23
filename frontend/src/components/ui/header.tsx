import SBILogo from "../../assets/sbi-life.png";

function ChatHeader() {
  return (
    <header className="flex sticky top-0 bg-background py-1.5 items-center px-2 md:px-2 gap-2 border-b">
      <img src={SBILogo} alt="SBI Life" className="h-14" />
      <div className="text-lg flex flex-col font-bold text-black">
        <span>SBI Life</span>
        <span className="text-xs text-gray-500">Powered by Chainlit</span>
      </div>
    </header>
  );
}

export { ChatHeader };
