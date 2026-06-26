import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { callGemini } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { day, region, dayTitle, activities, message } = await req.json();

  const systemPrompt = `You are a travel assistant helping a couple on their Japan honeymoon. Be warm, concise, and specific.
Current: Day ${day} (${dayTitle}) in ${region}.
Today's planned activities:
${activities.map((a: { time: string; title: string; type: string }) => `  ${a.time}  ${a.title} (${a.type})`).join("\n")}

When you suggest specific activities or places to visit, include a JSON block at the END of your response exactly like this:
\`\`\`suggestions
[{"time":"3:00 PM","title":"Exact Place Name","type":"nature","lat":35.6,"lng":139.7,"desc":"One sentence about it."}]
\`\`\`
Types: restaurant, museum, shop, nature, transit, hotel.
Use real GPS coordinates. Only include the JSON block if recommending specific places.
Keep total response under 200 words.`;

  try {
    const reply = await callGemini(session.user.id, "ai-planner", message, systemPrompt);
    return NextResponse.json({ reply });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "AI error";
    const status = message.includes("Rate limit") ? 429 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
