import { useEffect, useRef, useState } from "react";
import { Sparkles, Send, Bot, User, Zap } from "lucide-react";
import { Section, Badge, Card } from "../components/ui";
import { getAssistantReply, starterPrompts, type AssistantReply } from "../lib/aiAssistant";

interface Msg {
  id: string;
  role: "user" | "assistant";
  text: string;
  reply?: AssistantReply;
}

export default function Assistant() {
  const [messages, setMessages] = useState<Msg[]>([
    {
      id: "intro",
      role: "assistant",
      text: "Hi! I'm your EventConnect AI planner 🤖 Ask me anything about your event — budget, vendors, timelines, seating, or risks.",
      reply: { text: "", followups: starterPrompts.slice(0, 4) },
    },
  ]);
  const [draft, setDraft] = useState("");
  const [thinking, setThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, thinking]);

  const ask = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Msg = { id: `u${Date.now()}`, role: "user", text };
    setMessages((m) => [...m, userMsg]);
    setDraft("");
    setThinking(true);

    window.setTimeout(() => {
      const reply = getAssistantReply(text);
      setMessages((m) => [...m, { id: `a${Date.now()}`, role: "assistant", text: reply.text, reply }]);
      setThinking(false);
    }, 1100);
  };

  return (
    <div className="bg-cream">
      <Section className="py-6 md:py-8">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <Badge variant="coral">
              <Zap className="h-3 w-3" /> Powered by OpenAI
            </Badge>
            <h1 className="mt-3 font-display text-4xl md:text-5xl">AI Assistant</h1>
            <p className="mt-1 text-ink/60">Your 24/7 event planning co-pilot.</p>
          </div>
          <Card className="hidden items-center gap-3 px-4 py-3 md:flex">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-coral/10 text-coral">
              <Sparkles className="h-4.5 w-4.5" />
            </div>
            <div className="text-xs">
              <div className="font-semibold">Context loaded</div>
              <div className="text-ink/50">Wedding · Lagos · 300 guests · ₦10M</div>
            </div>
          </Card>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1fr_280px]">
          <Card className="flex h-[64vh] min-h-[480px] flex-col overflow-hidden">
            <div ref={scrollRef} className="flex-1 space-y-5 overflow-y-auto p-4 md:p-6">
              {messages.map((m) => (
                <div key={m.id} className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                      m.role === "user" ? "bg-ink text-cream" : "bg-coral text-white"
                    }`}
                  >
                    {m.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  </div>
                  <div className={`max-w-[80%] ${m.role === "user" ? "items-end" : ""}`}>
                    <div
                      className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                        m.role === "user" ? "rounded-tr-sm bg-ink text-cream" : "rounded-tl-sm bg-cream-2"
                      }`}
                    >
                      {m.text && <p>{m.text}</p>}
                      {m.reply?.bullets && (
                        <ul className="mt-2 space-y-1.5">
                          {m.reply.bullets.map((b, i) => (
                            <li key={i} className="flex gap-2">
                              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-coral" />
                              <span>{b}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    {m.reply?.followups && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {m.reply.followups.map((f) => (
                          <button
                            key={f}
                            onClick={() => ask(f)}
                            className="rounded-full border border-ink/15 bg-white px-3 py-1.5 text-xs font-medium transition hover:border-ink hover:bg-ink hover:text-cream"
                          >
                            {f}
                          </button>
                        ))}
                      </div>
                    )}
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
                  placeholder="Ask about budget, vendors, schedule…"
                  className="max-h-32 flex-1 resize-none rounded-2xl border border-ink/10 bg-cream-2 px-4 py-3 text-sm outline-none focus:border-ink"
                />
                <button
                  onClick={() => ask(draft)}
                  disabled={!draft.trim()}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-coral text-white transition hover:-translate-y-0.5 disabled:opacity-40"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </Card>

          <div className="space-y-4">
            <Card className="p-5">
              <h3 className="font-display text-lg">Try asking</h3>
              <div className="mt-3 space-y-2">
                {starterPrompts.map((p) => (
                  <button
                    key={p}
                    onClick={() => ask(p)}
                    className="w-full rounded-xl border border-ink/10 px-3 py-2.5 text-left text-sm transition hover:border-ink/30 hover:bg-cream-2"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </Card>
            <Card className="bg-ink p-5 text-cream">
              <Sparkles className="h-5 w-5 text-coral" />
              <h3 className="mt-2 font-display text-lg">Smart suggestions</h3>
              <p className="mt-1 text-sm text-cream/70">
                The assistant uses your event details to give tailored advice and can draft messages, timelines, and budgets instantly.
              </p>
            </Card>
          </div>
        </div>
      </Section>
    </div>
  );
}
