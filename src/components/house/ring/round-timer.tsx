"use client";

import { useEffect, useRef, useState } from "react";

const ROUND_SECONDS = 180;
const REST_SECONDS = 60;
const ROUNDS = 12;

type Phase = "ready" | "fight" | "rest" | "done";

function clock(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

/**
 * A working boxing round clock: 3:00 rounds, 1:00 rest, twelve rounds.
 * The bell is visual only; it shakes on every phase change.
 */
export function RoundTimer() {
  const [phase, setPhase] = useState<Phase>("ready");
  const [round, setRound] = useState(1);
  const [left, setLeft] = useState(ROUND_SECONDS);
  const [running, setRunning] = useState(false);
  const [bell, setBell] = useState(0);
  const endsAt = useRef(0);

  useEffect(() => {
    if (!running) return;
    endsAt.current = Date.now() + left * 1000;
    const timer = window.setInterval(() => {
      const remaining = Math.max(0, Math.ceil((endsAt.current - Date.now()) / 1000));
      setLeft(remaining);
    }, 250);
    return () => window.clearInterval(timer);
    // Restart the interval only when running toggles or the phase changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, phase]);

  useEffect(() => {
    if (!running || left > 0) return;
    setBell((value) => value + 1);
    if (phase === "fight") {
      if (round >= ROUNDS) {
        setPhase("done");
        setRunning(false);
      } else {
        setPhase("rest");
        setLeft(REST_SECONDS);
      }
    } else if (phase === "rest") {
      setRound(round + 1);
      setPhase("fight");
      setLeft(ROUND_SECONDS);
    }
  }, [left, running, phase, round]);

  function toggle() {
    if (phase === "ready" || phase === "done") {
      setPhase("fight");
      setRound(1);
      setLeft(ROUND_SECONDS);
      setBell((value) => value + 1);
      setRunning(true);
      return;
    }
    setRunning((value) => !value);
  }

  function reset() {
    setRunning(false);
    setPhase("ready");
    setRound(1);
    setLeft(ROUND_SECONDS);
  }

  const total = phase === "rest" ? REST_SECONDS : ROUND_SECONDS;
  const fraction = phase === "ready" ? 0 : 1 - left / total;
  const label =
    phase === "ready" ? "Waiting for the bell" : phase === "rest" ? "Rest. Sit down. Breathe." : phase === "done" ? "Final bell" : `Round ${round}`;

  return (
    <div className="ml-timer ml-reveal" data-phase={phase} data-running={running ? "true" : undefined}>
      <div className="ml-timer-face">
        <svg key={bell} aria-hidden="true" className="ml-timer-bell" viewBox="0 0 64 64">
          <path d="M32 8a4 4 0 0 1 4 4v2.4c8 1.8 13 8.6 13 17.6v10l5 6H10l5-6V32c0-9 5-15.8 13-17.6V12a4 4 0 0 1 4-4Z" fill="currentColor" />
          <circle cx="32" cy="54" r="5" fill="currentColor" />
        </svg>
        <p className="ml-timer-label" aria-live="polite">{label}</p>
        <p className="ml-timer-time" role="timer" aria-label={`${clock(left)} remaining`}>
          {clock(left)}
        </p>
        <div aria-hidden="true" className="ml-timer-bar">
          <span style={{ transform: `scaleX(${fraction})` }} />
        </div>
        <ol aria-label="Rounds" className="ml-timer-rounds">
          {Array.from({ length: ROUNDS }, (_, index) => {
            const n = index + 1;
            const state = phase === "done" || n < round ? "done" : n === round && phase !== "ready" ? "now" : undefined;
            return (
              <li key={n} data-state={state}>
                <span className="ml-sr">Round {n}{state === "done" ? ", finished" : state === "now" ? ", current" : ""}</span>
              </li>
            );
          })}
        </ol>
      </div>
      <div className="ml-timer-controls">
        <button type="button" className="ml-timer-go" onClick={toggle}>
          {phase === "ready" || phase === "done" ? "Ring the bell" : running ? "Pause" : "Resume"}
        </button>
        <button type="button" className="ml-timer-reset" onClick={reset} disabled={phase === "ready"}>
          Reset
        </button>
      </div>
    </div>
  );
}
