import { useEffect, useMemo, useRef, useState } from "react";
import { Bot, User, Send, Sparkles, Plus, Trash2, MessageCircle, Zap, Database } from "lucide-react";
import { Section, Badge, Card, Button } from "../components/ui";
import { usePlatformStore } from "../store/usePlatformStore";
import { getCopilotReply, starterPrompts, type AssistantReply } from "../lib/aiAssistant";
import { useApp } from "../context/AppContext";

export default function Copilot() {
  const { events } = useApp();
  const { copilotThreads, activeThreadId, newThread, setActiveThread, appendMessage, deleteThread } =
    usePlatformStore();

  const [draft, setDraft] = useState("");
  const [thinking, setThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-create welcome thread on first visit
  useEffect(() => {
    if (copilotThreads.length === 0) {
      const id = newThread("Welcome to EventConnect AI", { eventType: events[0]?.type });
      appendMessage(id, {
        role: "assistant",
        text:
          "Hi! I'm your EventConnect AI Copilot. I have full context of your events, vendors, budgets, and timeline. Ask me anything — from \"Can I host 500 guests with $10K?\" to \"Generate a corporate event budget.\"",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const activeThread = useMemo(
    () => copilotThreads.find((t) => t.id === activeThreadId) ?? copilotThreads[0],
    [copilotThreads, activeThreadId]
  );

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [activeThread?.messages.length, thinking]);

  const ask = (text: string) => {
    if (!text.trim() || !activeThread) return;
    appendMessage(activeThread.id, { role: "user", text });
    setDraft("");
    setThinking(true);

    const ctx = events[0]
      ? { eventType: events[0].type, budget: events[0].budget, guests: events[0].guests, location: events[0].location }
      : undefined;

    window.setTimeout(() => {
      const reply: AssistantReply = getCopilotReply(text, ctx);
      const text2 =
        reply.text + (reply.bullets ? "\n\n• " + reply.bullets.join("\n• ") : "");
      appendMessage(activeThread.id, { role: "assistant", text: text2 });
      setThinking(false);
    }, 1100);
  };

  const createThread = () => {
    const id = newThread(`New chat · ${new Date().toLocaleDateString()}`);
    appendMessage(id, { role: "assistant", text: "Fresh thread started. What's on your mind?" });
  };

  return (
    <div className="bg-cream pb-10">
      <Section className="pt-6 md:pt-8">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <Badge variant="coral">
              <Zap className="h-3 w-3" /> OpenAI · GPT-4o · Persistent history
            </Badge>
            <h1 className="mt-3 font-display text-4xl md:text-5xl">AI Event Copilot</h1>
            <p className="mt-1 text-ink/60">Context-aware planning assistant. Your entire chat history is saved.</p>
          </div>
          <Card className="hidden items-center gap-3 px-4 py-3 md:flex">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-coral/10 text-coral">
              <Database className="h-4 w-4" />
            </div>
            <div className="text-xs">
              <div className="font-semibold">Context loaded</div>
              <div className="text-ink/50">
                {events[0]?.type ?? "Event"} · {events[0]?.guests ?? "?"} guests · ${events[0]?.budget?.toLocaleString() ?? "?"}
              </div>
            </div>
          </Card>
        </div>

        <div className="grid h-[72vh] min-h-[560px] gap-0 overflow-hidden rounded-3xl border border-ink/10 bg-white md:grid-cols-[260px_1fr_300px]">
          {/* Threads sidebar */}
          <aside className="flex flex-col border-r border-ink/10">
            <div className="border-b border-ink/10 p-3">
              <button
                onClick={createThread}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-ink/15 bg-cream-2 py-2 text-sm font-semibold hover:border-ink/30"
              >
                <Plus className="h-4 w-4" /> New chat
              </button>
            </div>
            <div className="flex-1 space-y-1 overflow-y-auto p-2">
              {copilotThreads.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActiveThread(t.id)}
                  className={`group flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm ${
                    activeThread?.id === t.id ? "bg-ink text-cream" : "hover:bg-cream-2"
                  }`}
                >
                  <MessageCircle className="h-3.5 w-3.5 shrink-0" />
                  <span className="flex-1 truncate">{t.title}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteThread(t.id);
                    }}
                    className="opacity-0 transition hover:text-coral group-hover:opacity-100"
                    aria-label="Delete"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </button>
              ))}
            </div>
          </aside>

          {/* Thread body */}
          <div className="flex flex-col">
            <div ref={scrollRef} className="flex-1 space-y-5 overflow-y-auto p-4 md:p-6">
              {activeThread?.messages.map((m) => (
                <div key={m.id} className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                      m.role === "user" ? "bg-ink text-cream" : "bg-coral text-white"
                    }`}
                  >
                    {m.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  </div>
                  <div className={`max-w-[78%] ${m.role === "user" ? "items-end" : ""}`}>
                    <div
                      className={`whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                        m.role === "user" ? "rounded-tr-sm bg-ink text-cream" : "rounded-tl-sm bg-cream-2"
                      }`}
                    >
                      {m.text}
                    </div>
                    <div className="mt-1 px-2 text-[10px] text-ink/40">
                      {new Date(m.ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                </div>
              ))}
              {thinking && (
                <div className="flex gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-coral text-white">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="flex gap-1 rounded-2xl rounded-tl-sm bg-cream-2 px-4 py-3.5">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-ink/30 [animation-delay:-0.3s]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-ink/30 [animation-delay:-0.15s]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-ink/30" />
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-ink/10 p-3 md:p-4">
              <div className="flex items-end gap-2">
                <textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      ask(draft);
                    }
                  }}
                  rows={1}
                  placeholder="Ask about budget, vendors, timelines, themes…"
                  className="max-h-32 flex-1 resize-none rounded-2xl border border-ink/10 bg-cream-2 px-4 py-3 text-sm outline-none focus:border-ink"
                />
                <Button variant="primary" onClick={() => ask(draft)} disabled={!draft.trim()} className="!h-11 !w-11 !px-0">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Right rail — suggestions */}
          <aside className="hidden flex-col border-l border-ink/10 md:flex">
            <div className="border-b border-ink/10 p-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-ink/50">Try asking</div>
            </div>
            <div className="flex-1 space-y-2 overflow-y-auto p-3">
              {starterPrompts.map((p) => (
                <button
                  key={p}
                  onClick={() => ask(p)}
                  className="w-full rounded-xl border border-ink/10 px-3 py-2.5 text-left text-xs transition hover:border-ink/30 hover:bg-cream-2"
                >
                  {p}
                </button>
              ))}
              <div className="mt-4 rounded-xl bg-ink p-4 text-cream">
                <Sparkles className="h-4 w-4 text-coral" />
                <p className="mt-2 text-xs">
                  Upgrade to <span className="font-semibold text-coral">Premium</span> for unlimited Copilot messages, vendor outreach drafts, and timeline auto-generation.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </Section>
    </div>
  );
}
