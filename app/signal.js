"use client";

import { useMemo, useState } from "react";

const GRID_SIZE = 9;

export default function SignalField() {
  const [pointer, setPointer] = useState({ x: 4, y: 4 });
  const [pulse, setPulse] = useState(false);
  const cells = useMemo(
    () =>
      Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, index) => ({
        x: index % GRID_SIZE,
        y: Math.floor(index / GRID_SIZE)
      })),
    []
  );

  function trackPointer(event) {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width) * (GRID_SIZE - 1);
    const y = ((event.clientY - bounds.top) / bounds.height) * (GRID_SIZE - 1);
    setPointer({ x, y });
  }

  function resetPointer() {
    setPointer({ x: 4, y: 4 });
  }

  return (
    <div className="signal-wrap">
      <div className="signal-caption" aria-hidden="true">
        <span>Signal field / 9×9</span>
        <span>{pulse ? "Pulse / on" : "Pulse / off"}</span>
      </div>
      <button
        className="signal-field"
        type="button"
        aria-label="Interactive signal field. Move the pointer to bend the field and press to toggle its pulse."
        aria-pressed={pulse}
        data-pulse={pulse}
        style={{
          "--pointer-x": `${(pointer.x / (GRID_SIZE - 1)) * 100}%`,
          "--pointer-y": `${(pointer.y / (GRID_SIZE - 1)) * 100}%`
        }}
        onClick={() => setPulse((current) => !current)}
        onPointerMove={trackPointer}
        onPointerLeave={resetPointer}
      >
        {cells.map((cell) => {
          const distance = Math.hypot(cell.x - pointer.x, cell.y - pointer.y);
          const energy = Math.max(0, 1 - distance / 4.2);
          return (
            <span
              className="signal-dot"
              key={`${cell.x}-${cell.y}`}
              aria-hidden="true"
              style={{ "--energy": energy.toFixed(3) }}
            />
          );
        })}
        <span className="signal-hint" aria-hidden="true">
          Move / press
        </span>
      </button>
    </div>
  );
}
