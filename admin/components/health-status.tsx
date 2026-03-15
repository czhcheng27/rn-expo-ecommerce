"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

type HealthResponse = {
  message: string;
};

type StatusState =
  | { tone: "loading"; title: string; detail: string }
  | { tone: "success"; title: string; detail: string }
  | { tone: "error"; title: string; detail: string };

const initialState: StatusState = {
  tone: "loading",
  title: "Checking backend",
  detail: "Requesting /api/health through the shared API helper.",
};

export function HealthStatus() {
  const [state, setState] = useState<StatusState>(initialState);

  useEffect(() => {
    let cancelled = false;

    async function checkHealth() {
      try {
        const response = await apiFetch<HealthResponse>("/health", {
          cache: "no-store",
        });

        if (cancelled) {
          return;
        }

        setState({
          tone: "success",
          title: "Backend reachable",
          detail: `Response message: ${response.message}`,
        });
      } catch (error) {
        if (cancelled) {
          return;
        }

        setState({
          tone: "error",
          title: "Backend request failed",
          detail:
            error instanceof Error ? error.message : "Unknown request error",
        });
      }
    }

    checkHealth();

    return () => {
      cancelled = true;
    };
  }, []);

  const toneClassName =
    state.tone === "success"
      ? "border-emerald-200 bg-emerald-50 text-emerald-900"
      : state.tone === "error"
        ? "border-rose-200 bg-rose-50 text-rose-900"
        : "border-amber-200 bg-amber-50 text-amber-900";

  return (
    <section className={`rounded-3xl border p-6 ${toneClassName}`}>
      <p className="text-sm font-medium uppercase tracking-[0.2em]">
        API status
      </p>
      <h2 className="mt-3 text-2xl font-semibold">{state.title}</h2>
      <p className="mt-2 text-sm leading-6">{state.detail}</p>
      <p className="mt-4 font-mono text-xs">All admin requests should use /api/*.</p>
    </section>
  );
}
