import { getGroqClient } from "../../../lib/groq";
import { prisma } from "../../../lib/prisma";

type EventRecord = Awaited<ReturnType<typeof prisma.event.findMany>>[number];
const GROQ_MODEL = process.env.GROQ_MODEL || "llama-3.1-8b-instant";

const STOP_WORDS = new Set([
  "find",
  "me",
  "the",
  "a",
  "an",
  "events",
  "event",
  "this",
  "that",
  "for",
  "to",
  "with",
  "and",
  "or",
  "is",
  "are",
  "best",
  "which",
  "show",
  "any",
  "please",
]);

type ChatResult = {
  reply: string;
  matchedEvents: Array<{
    id: string;
    title: string;
    date: string;
    time: string;
    venue: string;
    fee: number;
    type: string;
    averageRating: number;
    reviewCount: number;
    isFeatured: boolean;
    eventStatus: string;
  }>;
};

const hasFreeIntent = (message: string) =>
  /\b(free|no\s+cost|without\s+cost)\b/i.test(message);

const hasThisWeekIntent = (message: string) =>
  /\b(this\s+week|within\s+this\s+week|next\s+7\s+days)\b/i.test(message);

const hasNetworkingIntent = (message: string) =>
  /\b(network|networking|connect|community|meet\s+people)\b/i.test(message);

const extractKeywords = (message: string) => {
  return message
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((token) => token.length > 2 && !STOP_WORDS.has(token))
    .slice(0, 6);
};

const rankEvents = (events: EventRecord[], networkingIntent: boolean) => {
  return [...events].sort((a, b) => {
    const aScore =
      (networkingIntent && a.type === "PUBLIC" ? 3 : 0) +
      (a.isFeatured ? 2 : 0) +
      a.reviewCount +
      a.averageRating * 2;

    const bScore =
      (networkingIntent && b.type === "PUBLIC" ? 3 : 0) +
      (b.isFeatured ? 2 : 0) +
      b.reviewCount +
      b.averageRating * 2;

    if (bScore !== aScore) {
      return bScore - aScore;
    }

    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });
};

const buildFallbackReply = (message: string, events: EventRecord[]) => {
  if (!events.length) {
    return `I could not find matching events for "${message}" right now. Try broadening your query, for example: "free public events this month" or "upcoming networking events in Dhaka".`;
  }

  const lines = events.slice(0, 3).map((event, index) => {
    const feeLabel = event.fee === 0 ? "Free" : `$${event.fee}`;
    return `${index + 1}. ${event.title} (${new Date(event.date).toDateString()} at ${event.venue}) - ${feeLabel}`;
  });

  return `Here are the best matches I found:\n${lines.join("\n")}`;
};

const askAssistant = async (message: string): Promise<ChatResult> => {
  const keywords = extractKeywords(message);
  const freeIntent = hasFreeIntent(message);
  const thisWeekIntent = hasThisWeekIntent(message);
  const networkingIntent = hasNetworkingIntent(message);

  const now = new Date();
  const endOfWeek = new Date(now);
  endOfWeek.setDate(now.getDate() + 7);

  const events = await prisma.event.findMany({
    where: {
      eventStatus: "AVAILABLE",
      ...(freeIntent ? { fee: { lte: 0 } } : {}),
      ...(thisWeekIntent
        ? {
            date: {
              gte: now,
              lte: endOfWeek,
            },
          }
        : {}),
      ...(keywords.length
        ? {
            OR: keywords.flatMap((keyword) => [
              { title: { contains: keyword, mode: "insensitive" } },
              { description: { contains: keyword, mode: "insensitive" } },
              { venue: { contains: keyword, mode: "insensitive" } },
            ]),
          }
        : {}),
    },
    orderBy: [{ date: "asc" }, { createdAt: "desc" }],
    take: 20,
  });

  const rankedEvents = rankEvents(events, networkingIntent).slice(0, 8);

  const context = rankedEvents
    .map((event, index) => {
      const feeLabel = event.fee === 0 ? "Free" : `$${event.fee}`;
      return `${index + 1}. ${event.title}\nDate: ${new Date(event.date).toDateString()}\nTime: ${event.time}\nVenue: ${event.venue}\nFee: ${feeLabel}\nType: ${event.type}\nRating: ${event.averageRating} (${event.reviewCount} reviews)`;
    })
    .join("\n\n");

  let reply = buildFallbackReply(message, rankedEvents);

  try {
    const groq = getGroqClient();
    const completion = await groq.chat.completions.create({
      model: GROQ_MODEL,
      temperature: 0.2,
      messages: [
        {
          role: "system",
          content:
            "You are Eventra AI assistant. Only use the provided events data. If data is empty, clearly say no matching events were found and give concise search suggestions.",
        },
        {
          role: "user",
          content: `User request: ${message}\n\nMatching events from DB:\n${context || "No matching events found."}\n\nRespond naturally in concise bullet points.`,
        },
      ],
    });

    reply = completion.choices[0]?.message?.content?.trim() || reply;
  } catch (error) {
    // Fallback message is already prepared.
    console.error("Groq completion failed:", error);
  }

  return {
    reply,
    matchedEvents: rankedEvents.map((event) => ({
      id: event.id,
      title: event.title,
      date: event.date.toISOString(),
      time: event.time,
      venue: event.venue,
      fee: event.fee,
      type: event.type,
      averageRating: event.averageRating,
      reviewCount: event.reviewCount,
      isFeatured: event.isFeatured,
      eventStatus: event.eventStatus,
    })),
  };
};

export const ChatService = {
  askAssistant,
};
