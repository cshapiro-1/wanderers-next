"use client";
import React from "react";
import { useTripState } from "./useTripState";
import { TripAppInner } from "./TripAppInner";

export function TripApp({ userName }: { userName: string }) {
  const tripState = useTripState();

  if (tripState.loading) {
    return (
      <div className="app-loading">
        <div className="loading-mark">✦</div>
        <div className="loading-text">Loading your journey…</div>
      </div>
    );
  }

  // TripAppInner uses useStore (Zustand) for all state — DB sync is Phase 2
  return <TripAppInner />;
}

