import { MessageCircle } from "lucide-react";

const WHATSAPP_NUMBER = "5511947811422";
const DEFAULT_TEXT = "Olá! Vim pelo fontesan.online e quero falar com o suporte.";

export function WhatsAppCta({ text = DEFAULT_TEXT }: { text?: string }) {
  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground shadow-sm transition hover:brightness-105"
    >
      <MessageCircle className="h-4 w-4" />
      WhatsApp
    </a>
  );
}
