export function HudBackground() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* Grid dot pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "radial-gradient(oklch(0.75 0.18 195) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      {/* Rotating ring - bottom right */}
      <svg
        className="absolute -bottom-40 -right-40 opacity-20"
        width="600"
        height="600"
        aria-hidden="true"
        style={{ animation: "hud-ring-rotate 20s linear infinite" }}
      >
        <circle
          cx="300"
          cy="300"
          r="280"
          fill="none"
          stroke="oklch(0.65 0.25 220)"
          strokeWidth="1"
          strokeDasharray="60 20"
        />
        <circle
          cx="300"
          cy="300"
          r="240"
          fill="none"
          stroke="oklch(0.75 0.18 195)"
          strokeWidth="0.5"
          strokeDasharray="40 15"
        />
      </svg>
      {/* Rotating ring - top left */}
      <svg
        className="absolute -top-40 -left-40 opacity-15"
        width="500"
        height="500"
        aria-hidden="true"
        style={{ animation: "hud-ring-rotate-reverse 15s linear infinite" }}
      >
        <circle
          cx="250"
          cy="250"
          r="230"
          fill="none"
          stroke="oklch(0.65 0.25 220)"
          strokeWidth="1"
          strokeDasharray="80 30"
        />
        <circle
          cx="250"
          cy="250"
          r="190"
          fill="none"
          stroke="oklch(0.75 0.18 195)"
          strokeWidth="0.5"
          strokeDasharray="30 20"
        />
      </svg>
      {/* Scan line */}
      <div
        className="absolute left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, oklch(0.75 0.18 195 / 0.5) 50%, transparent 100%)",
          animation: "hud-scan 10s linear infinite",
        }}
      />
    </div>
  );
}
