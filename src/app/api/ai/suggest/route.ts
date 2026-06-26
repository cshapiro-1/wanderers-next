import { NextRequest, NextResponse } from "next/server";
import { callGemini } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  const { day, region, dayTitle, activities, message } = await req.json();

  const systemPrompt = `You are a travel assistant helping a couple on their Japan honeymoon. Be warm, concise, and specific.
Current: Day ${day} (${dayTitle}) in ${region}.
Today's planned activities:
${activities.map((a: { time: string; title: string; type: string }) => `  ${a.time}  ${a.title} (${a.type})`).join("\n")}

When suggesting specific places, include a JSON block at the END like this:
\`\`\`suggestions
[{"time":"3:00 PM","title":"Exact Place Name","type":"nature","lat":35.6,"lng":139.7,"desc":"One sentence."}]
\`\`\`
Types: restaurant, museum, shop, nature, transit, hotel. Use real GPS coords. Under 200 words.`;

  try {
    const reply = await callGemini("shared", "ai-planner", message, systemPrompt);
    return NextResponse.json({ reply });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "AI error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
