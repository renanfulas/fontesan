import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";

type Lead = {
  lead_id: string;
  nome: string;
  tipo_negocio: string;
  telefone: string;
  mensagem: string | null;
  created_at: string;
};

const STORAGE_KEY = "fontesan_admin_key";

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
  } catch {
    return iso;
  }
}

export function LeadsPage() {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem(STORAGE_KEY) ?? "");
  const [keyInput, setKeyInput] = useState(apiKey);
  const [leads, setLeads] = useState<Lead[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function fetchLeads(key: string) {
    if (!key) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/internal/fontesan-leads", {
        headers: { "X-API-Key": key },
      });
      if (res.status === 403) {
        setError("Chave inválida.");
        setLeads(null);
        return;
      }
      if (!res.ok) {
        setError(`Erro ${res.status} ao buscar leads.`);
        return;
      }
      const data = await res.json();
      setLeads(data.leads);
    } catch {
      setError("Falha de rede ao buscar leads.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (apiKey) fetchLeads(apiKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleUnlock() {
    localStorage.setItem(STORAGE_KEY, keyInput);
    setApiKey(keyInput);
    fetchLeads(keyInput);
  }

  if (!apiKey || (error === "Chave inválida." && leads === null)) {
    return (
      <div className="mx-auto flex max-w-sm flex-1 flex-col items-center justify-center gap-4 px-4 py-24 text-center">
        <h1 className="font-display text-2xl font-semibold text-foreground">Leads</h1>
        <p className="text-sm text-muted-foreground">
          Cole a chave de API do backend para ver os leads recebidos pelo site.
        </p>
        <input
          type="password"
          value={keyInput}
          onChange={(e) => setKeyInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleUnlock()}
          placeholder="X-API-Key"
          className="w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
        />
        {error && <p className="text-xs text-destructive">{error}</p>}
        <button
          onClick={handleUnlock}
          disabled={!keyInput}
          className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50"
        >
          Ver leads
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl flex-1 px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-foreground">
          Leads {leads ? `(${leads.length})` : ""}
        </h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchLeads(apiKey)}
            disabled={loading}
            className="flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:border-primary/40"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            Atualizar
          </button>
          <button
            onClick={() => {
              localStorage.removeItem(STORAGE_KEY);
              setApiKey("");
              setKeyInput("");
              setLeads(null);
            }}
            className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground hover:border-destructive/40 hover:text-destructive"
          >
            Sair
          </button>
        </div>
      </div>

      {error && <p className="mb-4 text-sm text-destructive">{error}</p>}

      {!leads ? (
        <p className="text-sm text-muted-foreground">Carregando...</p>
      ) : leads.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nenhum lead ainda.</p>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-3 font-medium">Nome</th>
                <th className="px-4 py-3 font-medium">Negócio</th>
                <th className="px-4 py-3 font-medium">Telefone</th>
                <th className="px-4 py-3 font-medium">Mensagem</th>
                <th className="px-4 py-3 font-medium">Recebido</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.lead_id} className="border-b border-border/60 last:border-0">
                  <td className="px-4 py-3 font-medium text-foreground">{lead.nome}</td>
                  <td className="px-4 py-3 text-muted-foreground">{lead.tipo_negocio}</td>
                  <td className="px-4 py-3">
                    <a
                      href={`https://wa.me/55${lead.telefone.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {lead.telefone}
                    </a>
                  </td>
                  <td className="max-w-xs px-4 py-3 text-muted-foreground">
                    {lead.mensagem ?? "—"}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-xs text-muted-foreground">
                    {formatDate(lead.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
