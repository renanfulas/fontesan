import { useEffect, useState } from "react";
import { LogoMark } from "@/components/Logo";
import { WhatsAppCta } from "@/components/WhatsAppCta";
import { ChatPage } from "@/components/ChatPage";
import { LeadsPage } from "@/components/LeadsPage";

function usePath() {
  const [path, setPath] = useState(window.location.pathname);
  useEffect(() => {
    const onPop = () => setPath(window.location.pathname);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);
  return path;
}

export default function App() {
  const path = usePath();
  const isLeads = path.startsWith("/leads");

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <header className="flex h-16 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur sm:px-6">
        <a href="/" className="flex items-center gap-2.5">
          <LogoMark className="h-8 w-8 text-sm" />
          <span className="font-display text-base font-semibold text-foreground">Fontesan</span>
        </a>
        <WhatsAppCta />
      </header>

      {isLeads ? <LeadsPage /> : <ChatPage />}
    </div>
  );
}
