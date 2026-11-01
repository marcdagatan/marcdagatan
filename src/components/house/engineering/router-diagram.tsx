"use client";

import { useEffect, useState } from "react";
import { ROUTER_LAYERS } from "../content";
import { usePrefersReducedMotion, useSeen } from "../hooks";

const STEP_MS = 3200;

/**
 * The Skills Router as an interactive drawing. A request packet travels
 * down the five layers; readers can step through by hand. It plays once on
 * its own when scrolled into view, and stops the moment someone takes over.
 */
export function RouterDiagram() {
  const [ref, seen] = useSeen<HTMLDivElement>(0.4);
  const reduced = usePrefersReducedMotion();
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const layer = ROUTER_LAYERS[active];
  const last = ROUTER_LAYERS.length - 1;

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
        <p className="ml-router-title">Fig. 1: Skills Router, request path</p>
        <div className="ml-router-controls">
          <button type="button" onClick={() => go(active - 1)} disabled={active === 0} aria-label="Previous layer">
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
            {playing ? "Pause" : active >= last ? "Replay" : "Play"}
          </button>
          <button type="button" onClick={() => go(active + 1)} disabled={active === last} aria-label="Next layer">
            →
          </button>
        </div>
      </div>

      <div className="ml-router-body">
        <ol className="ml-router-stack" style={{ "--active": active } as React.CSSProperties}>
          <li aria-hidden="true" className="ml-router-request">request</li>
          {ROUTER_LAYERS.map((item, index) => (
            <li key={item.id}>
              <button
                type="button"
                className="ml-router-layer"
                data-state={index < active ? "done" : index === active ? "active" : undefined}
                aria-current={index === active ? "step" : undefined}
                onClick={() => go(index)}
              >
                <span className="ml-router-n">L{index + 1}</span>
                <span className="ml-router-name">{item.name}</span>
                <span aria-hidden="true" className="ml-router-led" />
              </button>
            </li>
          ))}
          <li aria-hidden="true" className="ml-router-packet" />
        </ol>

        <div className="ml-router-detail" aria-live="polite">
          <p key={`tag-${layer.id}`} className="ml-router-tag">
            Layer {active + 1} of {ROUTER_LAYERS.length}: {layer.tag}
          </p>
          <p key={`body-${layer.id}`} className="ml-router-text">
            {layer.body}
          </p>
          <span key={`bar-${layer.id}-${playing}`} aria-hidden="true" className="ml-router-timer" />
        </div>
      </div>
    </div>
  );
}
