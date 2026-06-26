import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/trip — fetch all trip state for this user (and shared partner state)
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = session.user.id;
  const allowedEmails = (process.env.ALLOWED_EMAILS || "").split(",").map(e => e.trim().toLowerCase());

  // Get partner user IDs (everyone in the allowlist)
  const partnerIds = allowedEmails.length > 0
    ? (await prisma.user.findMany({ where: { email: { in: allowedEmails } }, select: { id: true } })).map((u: { id: string }) => u.id)
    : [userId];

  const [days, activityStates, aiSuggestions, dayNotes, reservations] = await Promise.all([
    prisma.tripDay.findMany({
      orderBy: { dayNumber: "asc" },
      include: { activities: { orderBy: { sortOrder: "asc" } } },
    }),
    prisma.activityState.findMany({ where: { userId: { in: partnerIds } } }),
    prisma.aiSuggestion.findMany({ where: { userId: { in: partnerIds } }, orderBy: { createdAt: "asc" } }),
    prisma.dayNote.findMany({ where: { userId: { in: partnerIds } } }),
    prisma.reservation.findMany({ where: { userId: { in: partnerIds } }, orderBy: { createdAt: "asc" } }),
  ]);

  return NextResponse.json({ days, activityStates, aiSuggestions, dayNotes, reservations });
}
