import { useEffect } from "react";

import { Playground } from "./components/playground";
import useSession from "./hooks/useSession";

function App() {
  const { sessionId, startNewChat, createSession } = useSession();

  useEffect(() => {
    createSession();
  }, []);

  return (
    <>
      <div>
        <Playground sessionId={sessionId} startNewChat={startNewChat} />
      </div>
    </>
  );
}

export default App;
