import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const SHARED_USER_ID = "shared";

export async function GET() {
  const [activityStates, aiSuggestions, dayNotes, reservations] = await Promise.all([
    prisma.activityState.findMany({ where: { userId: SHARED_USER_ID } }),
    prisma.aiSuggestion.findMany({ where: { userId: SHARED_USER_ID }, orderBy: { createdAt: "asc" } }),
    prisma.dayNote.findMany({ where: { userId: SHARED_USER_ID } }),
    prisma.reservation.findMany({ where: { userId: SHARED_USER_ID }, orderBy: { createdAt: "asc" } }),
  ]);
  return NextResponse.json({ activityStates, aiSuggestions, dayNotes, reservations });
}
