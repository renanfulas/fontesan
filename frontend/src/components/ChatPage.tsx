import { useState } from "react";
import { EmptyState } from "@/components/chat/EmptyState";
import { MessageList } from "@/components/chat/MessageList";
import { Composer } from "@/components/chat/Composer";
import { useChat } from "@/hooks/useChat";

export function ChatPage() {
  const { messages, loading, send, updateFeedback, reset } = useChat();
  const [draft, setDraft] = useState("");
  const empty = messages.length === 0;

  function handlePick(text: string) {
    setDraft("");
    send(text);
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-1 flex-col">
      {empty ? (
        <main className="flex flex-1 flex-col">
          <EmptyState onPick={handlePick} />
          <div className="pb-8">
            <Composer onSend={send} disabled={loading} value={draft} onValueChange={setDraft} />
          </div>
        </main>
      ) : (
        <main className="flex flex-1 flex-col">
          <div className="flex-1 overflow-y-auto">
            <MessageList messages={messages} loading={loading} onFeedback={updateFeedback} />
          </div>
          <div className="border-t border-border/40 bg-background/80 py-4 backdrop-blur">
            <Composer onSend={send} disabled={loading} value={draft} onValueChange={setDraft} />
            <div className="mx-auto mt-3 flex max-w-3xl justify-center px-4">
              <button
                onClick={reset}
                className="text-xs text-muted-foreground underline-offset-2 hover:underline"
              >
                Começar nova conversa
              </button>
            </div>
          </div>
        </main>
      )}
    </div>
  );
}
