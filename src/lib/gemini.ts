import { GoogleGenerativeAI } from "@google/generative-ai";
import { prisma } from "./prisma";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT = 30;
const WINDOW_MS = 60 * 60 * 1000;

function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const calls = (rateLimitMap.get(userId) || []).filter(t => now - t < WINDOW_MS);
  if (calls.length >= RATE_LIMIT) return false;
  calls.push(now);
  rateLimitMap.set(userId, calls);
  return true;
}

export async function callGemini(
  userId: string,
  feature: string,
  prompt: string,
  systemPrompt?: string
): Promise<string> {
  if (!checkRateLimit(userId)) throw new Error("Rate limit reached (30 calls/hour)");

  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-lite",
    systemInstruction: systemPrompt,
  });

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  await prisma.aiUsageLog.create({ data: { userId, feature } });

  return text;
}
