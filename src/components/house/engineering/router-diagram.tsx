"use client";

import { useEffect, useState } from "react";
import { ROUTER_LAYERS } from "../content";
import { usePrefersReducedMotion, useSeen } from "../hooks";

const STEP_MS = 3200;

/**
 * The Skills Router as a request trace. A request hops rules → router →
 * skill → guard → verify, and the trace log beside it records each hop.
 * Readers can step through by hand. It plays once on its own when scrolled
 * into view, and stops the moment someone takes over. Nothing loops.
 */
export function RouterDiagram() {
  const [ref, seen] = useSeen<HTMLDivElement>(0.4);
  const reduced = usePrefersReducedMotion();
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const layer = ROUTER_LAYERS[active];
  const last = ROUTER_LAYERS.length - 1;
  const done = active === last && !playing;

  useEffect(() => {
    if (seen && !started && !reduced) {
      setStarted(true);
      setPlaying(true);
    }
  }, [seen, started, reduced]);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setTimeout(() => {
      if (active >= last) setPlaying(false);
      else setActive(active + 1);
    }, STEP_MS);
    return () => window.clearTimeout(timer);
  }, [playing, active, last]);

  function go(index: number) {
    setPlaying(false);
    setActive(Math.max(0, Math.min(last, index)));
  }

  return (
    <div ref={ref} className="ml-router" data-playing={playing ? "true" : undefined}>
      <div className="ml-router-head">
        <p className="ml-router-title">
          <span aria-hidden="true" className="ml-router-dots" />
          trace: skills-router
        </p>
        <div className="ml-router-controls">
          <button type="button" onClick={() => go(active - 1)} disabled={active === 0} aria-label="Previous hop">
            ←
          </button>
          <button
            type="button"
            onClick={() => {
              if (playing) setPlaying(false);
              else {
                if (active >= last) setActive(0);
                setPlaying(true);
              }
            }}
            aria-pressed={playing}
          >
            {playing ? "Pause" : active >= last ? "Re-run" : "Run"}
          </button>
          <button type="button" onClick={() => go(active + 1)} disabled={active === last} aria-label="Next hop">
            →
          </button>
        </div>
      </div>

      <ol className="ml-router-flow" aria-label="Request flow">
        <li aria-hidden="true" className="ml-router-io">request</li>
        {ROUTER_LAYERS.map((item, index) => (
          <li key={item.id}>
            <button
              type="button"
              className="ml-router-node"
              data-state={index < active ? "done" : index === active ? "active" : undefined}
              aria-current={index === active ? "step" : undefined}
              onClick={() => go(index)}
            >
              <span className="ml-router-node-name">{item.node}</span>
              <span className="ml-router-node-layer">{item.name}</span>
            </button>
          </li>
        ))}
        <li aria-hidden="true" className="ml-router-io ml-router-out" data-ok={done ? "true" : undefined}>
          200 OK
        </li>
      </ol>

      <div className="ml-router-log">
        <p aria-hidden="true" className="ml-router-cmd">
          <span className="ml-eng-prompt">$</span> trace --hop {active + 1}/{ROUTER_LAYERS.length}
        </p>
        <ol aria-hidden="true" className="ml-router-lines">
          {ROUTER_LAYERS.map((item, index) => (
            <li key={item.id} data-state={index < active ? "done" : index === active ? "active" : "pending"}>
              <span className="ml-router-mark">{index < active ? "✓" : index === active ? "▸" : "·"}</span>
              <span className="ml-router-line-node">{item.node}</span>
              <span className="ml-router-line-tag">{item.tag}</span>
            </li>
          ))}
        </ol>
        <div className="ml-router-now" aria-live="polite">
          <p key={`tag-${layer.id}`} className="ml-router-tag">
            Hop {active + 1} of {ROUTER_LAYERS.length}, {layer.name}: {layer.tag}
          </p>
          <p key={`body-${layer.id}`} className="ml-router-text">
            {layer.body}
          </p>
        </div>
        <span key={`bar-${layer.id}-${playing}`} aria-hidden="true" className="ml-router-timer" />
      </div>
    </div>
  );
}
