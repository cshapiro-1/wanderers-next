"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useStore } from "@/store/ui";
import { activities, dayMeta, haikus } from "@/data/activities";
import type { Activity } from "@/types";

// ── DB-synced trip state types ─────────────────────────────────────────────
export interface DBActivityState {
  id: string;
  userId: string;
  activityId: string;
  isDone: boolean;
  customTitle?: string | null;
  customTime?: string | null;
  customDesc?: string | null;
}

export interface DBAiSuggestion {
  id: string;
  userId: string;
  day: number;
  title: string;
  time: string;
  type: string;
  lat: number;
  lng: number;
  description: string;
}

export interface DBDayNote {
  id: string;
  userId: string;
  dayId: string;
  content: string;
}

export interface DBReservation {
  id: string;
  userId: string;
  name: string;
  date: string;
  time?: string | null;
  confirmNo?: string | null;
  notes?: string | null;
  activityKey?: string | null;
}

export interface DBTripDay {
  id: string;
  dayNumber: number;
  title: string;
  region: string;
  haiku?: string | null;
  activities: DBTripActivity[];
}

export interface DBTripActivity {
  id: string;
  dayId: string;
  sortOrder: number;
  title: string;
  time: string;
  type: string;
  description: string;
  lat: number;
  lng: number;
  optional: boolean;
  duration?: string | null;
}

export interface TripState {
  days: DBTripDay[];
  activityStates: DBActivityState[];
  aiSuggestions: DBAiSuggestion[];
  dayNotes: DBDayNote[];
  reservations: DBReservation[];
}

// ── Hook: load + sync trip state from DB ──────────────────────────────────
export function useTripState() {
  const [state, setState] = useState<TripState | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/trip");
      if (res.ok) setState(await res.json());
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const update = useCallback(async (action: string, payload: Record<string, unknown>) => {
    const res = await fetch("/api/trip/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, ...payload }),
    });
    if (res.ok) await refresh();
    return res.ok;
  }, [refresh]);

  // Helpers
  const toggleDone = (activityId: string) => update("toggle-done", { activityId });
  const addAiSuggestion = (day: number, act: Omit<DBAiSuggestion, "id" | "userId" | "day">) =>
    update("add-ai-suggestion", { day, ...act });
  const removeAiSuggestion = (id: string) => update("remove-ai-suggestion", { id });
  const saveNote = (dayId: string, content: string) => update("save-note", { dayId, content });
  const addReservation = (data: Omit<DBReservation, "id" | "userId">) =>
    update("add-reservation", data);
  const removeReservation = (id: string) => update("remove-reservation", { id });

  // Derived helpers
  const isDone = (activityId: string) =>
    state?.activityStates.find(s => s.activityId === activityId)?.isDone ?? false;
  const aiSuggestionsForDay = (day: number) =>
    state?.aiSuggestions.filter(s => s.day === day) ?? [];
  const noteForDay = (dayId: string) =>
    state?.dayNotes.find(n => n.dayId === dayId)?.content ?? "";

  return {
    state, loading, refresh,
    toggleDone, addAiSuggestion, removeAiSuggestion,
    saveNote, addReservation, removeReservation,
    isDone, aiSuggestionsForDay, noteForDay,
  };
}
