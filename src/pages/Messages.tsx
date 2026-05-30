import { useEffect, useRef, useState } from "react";
import {
  Search,
  Send,
  Paperclip,
  ImageIcon,
  FileText,
  Check,
  CheckCheck,
  ShieldCheck,
  Phone,
  Video,
  MoreVertical,
  ArrowLeft,
  Receipt,
  Sparkles,
} from "lucide-react";
import { Section, Badge } from "../components/ui";
import { useApp, type Conversation, type ChatMessage } from "../context/AppContext";

export default function Messages() {
  const { conversations, sendMessage, openConversation } = useApp();
  const [activeId, setActiveId] = useState(conversations[0]?.id ?? "");
  const [draft, setDraft] = useState("");
  const [mobileThread, setMobileThread] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const active = conversations.find((c) => c.id === activeId) ?? conversations[0];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [active?.messages.length, active?.typing]);

  const handleSend = () => {
    if (!draft.trim() || !active) return;
    sendMessage(active.id, draft.trim());
    setDraft("");
  };

  const selectConversation = (id: string) => {
    setActiveId(id);
    openConversation(id);
    setMobileThread(true);
  };

  return (
    <div className="bg-cream">
      <Section className="py-6 md:py-8">
        <div className="mb-5">
          <Badge variant="coral">
            <span className="h-1.5 w-1.5 rounded-full bg-coral pulse-ring" /> Live · Socket.io
          </Badge>
          <h1 className="mt-3 font-display text-4xl md:text-5xl">Messages</h1>
          <p className="mt-1 text-ink/60">Chat with vendors in real time — share files, quotes, and photos.</p>
        </div>

        <div className="grid h-[70vh] min-h-[520px] grid-cols-1 overflow-hidden rounded-3xl border border-ink/10 bg-white md:grid-cols-[340px_1fr]">
          {/* Conversation list */}
          <aside className={`flex flex-col border-r border-ink/10 ${mobileThread ? "hidden md:flex" : "flex"}`}>
            <div className="border-b border-ink/10 p-4">
              <div className="relative">
                <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-ink/40" />
                <input
                  placeholder="Search conversations…"
                  className="w-full rounded-full border border-ink/10 bg-cream-2 py-2.5 pl-9 pr-4 text-sm outline-none focus:border-ink"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {conversations.map((c) => (
                <button
                  key={c.id}
                  onClick={() => selectConversation(c.id)}
                  className={`flex w-full items-center gap-3 border-b border-ink/5 p-4 text-left transition hover:bg-cream-2 ${
                    active?.id === c.id ? "bg-cream-2" : ""
                  }`}
                >
                  <div className="relative">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br ${c.cover} text-sm font-bold text-ink/70`}>
                      {c.avatar}
                    </div>
                    {c.online && (
                      <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-sage" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="truncate font-semibold">{c.name}</span>
                      {c.verified && <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-sage" />}
                    </div>
                    <div className="truncate text-xs text-ink/50">
                      {c.typing ? (
                        <span className="text-coral">typing…</span>
                      ) : (
                        lastPreview(c)
                      )}
                    </div>
                  </div>
                  {c.unread > 0 && (
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-coral px-1.5 text-[10px] font-bold text-white">
                      {c.unread}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </aside>

          {/* Thread */}
          <div className={`flex flex-col ${mobileThread ? "flex" : "hidden md:flex"}`}>
            {active ? (
              <>
                {/* Thread header */}
                <div className="flex items-center justify-between border-b border-ink/10 p-4">
                  <div className="flex items-center gap-3">
                    <button className="md:hidden" onClick={() => setMobileThread(false)}>
                      <ArrowLeft className="h-5 w-5" />
                    </button>
                    <div className="relative">
                      <div className={`flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br ${active.cover} text-sm font-bold text-ink/70`}>
                        {active.avatar}
                      </div>
                      {active.online && (
                        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-sage" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold">{active.name}</span>
                        {active.verified && <ShieldCheck className="h-3.5 w-3.5 text-sage" />}
                      </div>
                      <div className="text-xs text-ink/50">
                        {active.typing ? <span className="text-coral">typing…</span> : active.online ? "Online" : "Last seen recently"} · {active.category}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-ink/50">
                    <button className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-cream-2"><Phone className="h-4 w-4" /></button>
                    <button className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-cream-2"><Video className="h-4 w-4" /></button>
                    <button className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-cream-2"><MoreVertical className="h-4 w-4" /></button>
                  </div>
                </div>

                {/* Messages */}
                <div ref={scrollRef} className="grid-pattern flex-1 space-y-3 overflow-y-auto p-4 md:p-6">
                  <div className="mx-auto w-fit rounded-full bg-ink/5 px-3 py-1 text-[11px] text-ink/50">
                    Escrow-protected conversation · keep all payments on EventConnect
                  </div>
                  {active.messages.map((m) => (
                    <Bubble key={m.id} m={m} cover={active.cover} avatar={active.avatar} />
                  ))}
                  {active.typing && (
                    <div className="flex items-center gap-2">
                      <div className={`flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br ${active.cover} text-[10px] font-bold text-ink/70`}>
                        {active.avatar}
                      </div>
                      <div className="flex gap-1 rounded-2xl rounded-bl-sm bg-white px-4 py-3 shadow-sm">
                        <span className="h-2 w-2 animate-bounce rounded-full bg-ink/30 [animation-delay:-0.3s]" />
                        <span className="h-2 w-2 animate-bounce rounded-full bg-ink/30 [animation-delay:-0.15s]" />
                        <span className="h-2 w-2 animate-bounce rounded-full bg-ink/30" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Composer */}
                <div className="border-t border-ink/10 p-3 md:p-4">
                  <div className="flex items-end gap-2">
                    <div className="flex gap-1">
                      <button
                        onClick={() => active && sendMessage(active.id, "", "image")}
                        className="flex h-10 w-10 items-center justify-center rounded-full text-ink/50 hover:bg-cream-2"
                        title="Send image"
                      >
                        <ImageIcon className="h-4.5 w-4.5" />
                      </button>
                      <button
                        onClick={() => active && sendMessage(active.id, "", "file", { fileName: "document.pdf" })}
                        className="flex h-10 w-10 items-center justify-center rounded-full text-ink/50 hover:bg-cream-2"
                        title="Attach file"
                      >
                        <Paperclip className="h-4.5 w-4.5" />
                      </button>
                    </div>
                    <textarea
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSend();
                        }
                      }}
                      rows={1}
                      placeholder="Type a message…"
                      className="max-h-32 flex-1 resize-none rounded-2xl border border-ink/10 bg-cream-2 px-4 py-2.5 text-sm outline-none focus:border-ink"
                    />
                    <button
                      onClick={handleSend}
                      disabled={!draft.trim()}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-coral text-white transition hover:-translate-y-0.5 disabled:opacity-40 disabled:hover:translate-y-0"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center p-12 text-center">
                <Sparkles className="h-10 w-10 text-ink/30" />
                <h3 className="mt-4 font-display text-2xl">Select a conversation</h3>
              </div>
            )}
          </div>
        </div>
      </Section>
    </div>
  );
}

function lastPreview(c: Conversation) {
  const last = c.messages[c.messages.length - 1];
  if (!last) return "";
  if (last.kind === "file") return `📎 ${last.meta?.fileName ?? "File"}`;
  if (last.kind === "image") return "📷 Photo";
  if (last.kind === "quote") return `💰 Quote · $${last.meta?.amount?.toLocaleString()}`;
  return last.text;
}

function Bubble({ m, cover, avatar }: { m: ChatMessage; cover: string; avatar: string }) {
  const mine = m.from === "me";

  const content = () => {
    if (m.kind === "quote") {
      return (
        <div className="w-60 rounded-xl border border-ink/10 bg-cream-2 p-3">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-coral">
            <Receipt className="h-3.5 w-3.5" /> Quote
          </div>
          <div className="mt-1 font-display text-2xl">${m.meta?.amount?.toLocaleString()}</div>
          <div className="text-xs text-ink/60">{m.meta?.label}</div>
          <button className="mt-3 w-full rounded-lg bg-coral py-2 text-xs font-semibold text-white">
            Accept & fund escrow
          </button>
        </div>
      );
    }
    if (m.kind === "file") {
      return (
        <div className="flex items-center gap-3 rounded-xl bg-cream-2 p-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-coral/10 text-coral">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <div className="text-sm font-semibold">{m.meta?.fileName ?? "document.pdf"}</div>
            <div className="text-xs text-ink/50">PDF · Tap to download</div>
          </div>
        </div>
      );
    }
    if (m.kind === "image") {
      return (
        <div className="h-40 w-56 rounded-xl bg-gradient-to-br from-amber-200 via-orange-200 to-rose-200">
          <div className="flex h-full items-center justify-center text-5xl">🖼️</div>
        </div>
      );
    }
    return <p className="text-sm leading-relaxed">{m.text}</p>;
  };

  return (
    <div className={`flex items-end gap-2 ${mine ? "flex-row-reverse" : ""}`}>
      {!mine && (
        <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${cover} text-[10px] font-bold text-ink/70`}>
          {avatar}
        </div>
      )}
      <div className={`max-w-[78%] ${mine ? "items-end" : "items-start"} flex flex-col gap-0.5`}>
        <div
          className={`px-4 py-2.5 text-sm shadow-sm ${
            m.kind === "text"
              ? mine
                ? "rounded-2xl rounded-br-sm bg-ink text-cream"
                : "rounded-2xl rounded-bl-sm bg-white"
              : ""
          }`}
        >
          {content()}
        </div>
        <div className={`flex items-center gap-1 px-1 text-[10px] text-ink/40 ${mine ? "flex-row-reverse" : ""}`}>
          {m.time}
          {mine && (m.kind === "text" ? <CheckCheck className="h-3 w-3 text-coral" /> : <Check className="h-3 w-3" />)}
        </div>
      </div>
    </div>
  );
}
