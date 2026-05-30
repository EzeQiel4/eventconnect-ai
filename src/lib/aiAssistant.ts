// AI Assistant — simulated LLM responses for event planning.
// In production this calls the OpenAI API (gpt-4o) with the event context as system prompt.

export interface AssistantReply {
  text: string;
  bullets?: string[];
  followups?: string[];
}

const KB: { match: RegExp; reply: AssistantReply }[] = [
  {
    match: /cater|food|menu|catering cost|reduce.*cater/i,
    reply: {
      text: "Catering is usually the largest line item. Here's how to trim it without hurting the guest experience:",
      bullets: [
        "Switch from plated service to premium buffet — saves 18–25%.",
        "Trim the menu to 2 proteins + 3 sides instead of 4 proteins.",
        "Serve a signature cocktail instead of a full open bar (save ~₦400k).",
        "Confirm final headcount 7 days out — you're likely over-catering by ~10%.",
      ],
      followups: ["Suggest cheaper caterers in Lagos", "How many tables do I need?", "Build me a catering checklist"],
    },
  },
  {
    match: /photograph|photo|videographer|cheaper photo/i,
    reply: {
      text: "Great photographers exist at every budget. For a 300-guest Lagos wedding I'd suggest:",
      bullets: [
        "FrameHouse Studios — ₦650k, 4.8★, fast 2-week delivery.",
        "Lumière Studios — ₦850k, 4.9★, cinematic films included.",
        "Tip: book photo + video as a bundle to save 10–15%.",
        "Avoid 'unlimited hours' packages — 8 hours covers most weddings.",
      ],
      followups: ["Compare photo vs video priorities", "Create a wedding schedule", "Reduce my catering cost"],
    },
  },
  {
    match: /schedule|timeline|run of show|run-of-show|itinerary/i,
    reply: {
      text: "Here's a clean wedding-day run of show you can adapt:",
      bullets: [
        "1:00 PM — Hair & makeup wraps, vendors arrive & set up.",
        "3:00 PM — Guest arrival, welcome drinks & live acoustic set.",
        "4:00 PM — Ceremony begins.",
        "5:00 PM — Cocktail hour + photos with family.",
        "6:30 PM — Reception entrance, first dance & dinner service.",
        "8:30 PM — Toasts, cake cutting, then DJ opens the floor.",
        "11:00 PM — Last dance & sparkler send-off.",
      ],
      followups: ["How many tables do I need?", "Add a vendor arrival checklist", "Reduce my catering cost"],
    },
  },
  {
    match: /how many table|tables do i need|seating/i,
    reply: {
      text: "For your guest count, here's the seating math (assuming round tables of 10):",
      bullets: [
        "300 guests ÷ 10 per table = 30 guest tables.",
        "Add 1 head table + 1 cake/gift table + 1 DJ table.",
        "Reserve ~5% extra seats for last-minute RSVPs (≈15 seats).",
        "Total floor plan: plan for 33 tables and a 12m × 18m space.",
      ],
      followups: ["Create a wedding schedule", "Suggest decorators", "Reduce my catering cost"],
    },
  },
  {
    match: /budget|allocat|spend|afford|money/i,
    reply: {
      text: "Here's a balanced budget split for a ₦10,000,000 wedding (300 guests):",
      bullets: [
        "Venue — ₦2.8M (28%)",
        "Catering — ₦2.6M (26%)",
        "Photo/Video — ₦1.2M (12%)",
        "Décor & florals — ₦1.1M (11%)",
        "Entertainment — ₦0.8M (8%)",
        "Attire, beauty, stationery & buffer — ₦1.5M (15%)",
      ],
      followups: ["Reduce my catering cost", "Suggest cheaper photographers", "What are my biggest risks?"],
    },
  },
  {
    match: /risk|wrong|worry|backup|contingen/i,
    reply: {
      text: "Top risks for a December Lagos wedding and how to de-risk them:",
      bullets: [
        "Peak season vendor scarcity — book venue & caterer 9+ months out.",
        "Harmattan dust affecting outdoor décor — have an indoor backup.",
        "Power outages — confirm your venue has a tested generator.",
        "Single points of failure — keep 1 backup vendor per critical category.",
      ],
      followups: ["Find backup vendors", "Create a wedding schedule", "Build a checklist"],
    },
  },
  {
    match: /checklist|to do|to-do|tasks|what should i do/i,
    reply: {
      text: "Here's your prioritized planning checklist:",
      bullets: [
        "✅ Lock venue & date",
        "✅ Book caterer (tasting first)",
        "⬜ Confirm photographer & videographer",
        "⬜ Send invitations + set RSVP deadline",
        "⬜ Finalize décor & florals",
        "⬜ Book DJ/MC & confirm playlist",
        "⬜ Arrange transportation & security",
      ],
      followups: ["Create a wedding schedule", "How many tables do I need?", "What are my biggest risks?"],
    },
  },
  {
    match: /decor|floral|flower|stage|backdrop/i,
    reply: {
      text: "For décor that photographs beautifully without overspending:",
      bullets: [
        "Invest in 1 statement backdrop (the photo magnet) + simple tablescapes.",
        "Use greenery + candles instead of dense florals — 30% cheaper.",
        "Rent, don't buy, large installations.",
        "BloomCraft Decor (₦1.6M) and Lagos Blooms (₦900k) are strong picks.",
      ],
      followups: ["Reduce my catering cost", "Create a wedding schedule", "What's my budget split?"],
    },
  },
];

const fallback: AssistantReply = {
  text: "I can help with budgets, vendors, timelines, seating, checklists, and risk planning. Try one of these:",
  followups: [
    "Reduce my catering cost",
    "Suggest cheaper photographers",
    "Create a wedding schedule",
    "How many tables do I need?",
  ],
};

export function getAssistantReply(input: string): AssistantReply {
  const found = KB.find((k) => k.match.test(input));
  return found ? found.reply : fallback;
}

// Context-aware reply — used by the AI Copilot to incorporate event details
export function getCopilotReply(
  input: string,
  context?: { eventType?: string; budget?: number; guests?: number; location?: string }
): AssistantReply {
  const base = getAssistantReply(input);
  if (!context || !context.eventType) return base;
  const ctxLine = `Using your context — ${context.eventType}, ${context.guests ?? "?"} guests in ${context.location ?? "?"}, budget ${context.budget ? "$" + context.budget.toLocaleString() : "?"} — `;
  return { ...base, text: ctxLine + base.text.toLowerCase().charAt(0) + base.text.slice(1) };
}

export const starterPrompts = [
  "Can I reduce my catering cost?",
  "Suggest cheaper photographers",
  "Create a wedding schedule",
  "How many tables do I need?",
  "What are my biggest risks?",
  "What's my budget split?",
];
