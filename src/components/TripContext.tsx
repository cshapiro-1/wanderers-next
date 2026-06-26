import React, { createContext, useContext } from "react";
import { useTripState } from "./useTripState";

type TripCtxType = ReturnType<typeof useTripState>;

const TripContext = createContext<TripCtxType | null>(null);

export function useTripCtx(): TripCtxType {
  const ctx = useContext(TripContext);
  if (!ctx) throw new Error("useTripCtx must be inside TripProvider");
  return ctx;
}

export const TripProvider = TripContext.Provider;
