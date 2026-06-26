import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// POST /api/trip — update activity state, AI suggestions, notes, reservations
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = session.user.id;
  const body = await req.json();
  const { action } = body;

  if (action === "toggle-done") {
    const { activityId } = body;
    const existing = await prisma.activityState.findUnique({ where: { userId_activityId: { userId, activityId } } });
    const state = await prisma.activityState.upsert({
      where: { userId_activityId: { userId, activityId } },
      update: { isDone: !existing?.isDone },
      create: { userId, activityId, isDone: true },
    });
    return NextResponse.json({ isDone: state.isDone });
  }

  if (action === "edit-activity") {
    const { activityId, customTitle, customTime, customDesc } = body;
    const state = await prisma.activityState.upsert({
      where: { userId_activityId: { userId, activityId } },
      update: { customTitle, customTime, customDesc },
      create: { userId, activityId, customTitle, customTime, customDesc },
    });
    return NextResponse.json(state);
  }

  if (action === "add-ai-suggestion") {
    const { day, title, time, type, lat, lng, description } = body;
    const suggestion = await prisma.aiSuggestion.create({
      data: { userId, day, title, time, type, lat, lng, description },
    });
    return NextResponse.json(suggestion);
  }

  if (action === "remove-ai-suggestion") {
    const { id } = body;
    await prisma.aiSuggestion.deleteMany({ where: { id, userId } });
    return NextResponse.json({ ok: true });
  }

  if (action === "save-note") {
    const { dayId, content } = body;
    const note = await prisma.dayNote.upsert({
      where: { userId_dayId: { userId, dayId } },
      update: { content },
      create: { userId, dayId, content },
    });
    return NextResponse.json(note);
  }

  if (action === "add-reservation") {
    const { name, date, time, confirmNo, notes, activityKey } = body;
    const res = await prisma.reservation.create({
      data: { userId, name, date, time, confirmNo, notes, activityKey },
    });
    return NextResponse.json(res);
  }

  if (action === "remove-reservation") {
    const { id } = body;
    await prisma.reservation.deleteMany({ where: { id, userId } });
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
