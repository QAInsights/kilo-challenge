import { useRef, useCallback, useState, useEffect } from "react";

interface ScrewTightenerProps {
  onComplete: () => void;
  index: number;
  total: number;
}

const FULL_ROTATIONS = 2;
const DEGREES_REQUIRED = FULL_ROTATIONS * 360;

export default function ScrewTightener({ onComplete, index, total }: ScrewTightenerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [tightening, setTightening] = useState(false);
  const [complete, setComplete] = useState(false);
  const [sparkle, setSparkle] = useState(false);
  const accumulatedRef = useRef(0);
  const prevAngleRef = useRef<number | null>(null);
  const tighteningRef = useRef(false);

  const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

  const getAngle = useCallback((clientX: number, clientY: number) => {
    const el = containerRef.current;
    if (!el) return 0;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    return Math.atan2(clientY - cy, clientX - cx) * (180 / Math.PI);
  }, []);

  const handleStart = useCallback((clientX: number, clientY: number) => {
    if (complete) return;
    tighteningRef.current = true;
    setTightening(true);
    prevAngleRef.current = getAngle(clientX, clientY);
  }, [complete, getAngle]);

  const handleMove = useCallback((clientX: number, clientY: number) => {
    if (!tighteningRef.current || complete) return;

    const currentAngle = getAngle(clientX, clientY);
    if (prevAngleRef.current === null) {
      prevAngleRef.current = currentAngle;
      return;
    }

    let delta = currentAngle - prevAngleRef.current;

    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;

    // Only count clockwise rotation (negative delta in screen coords)
    if (delta < -0.5) {
      accumulatedRef.current += Math.abs(delta);
    }

    prevAngleRef.current = currentAngle;

    const newProgress = clamp(accumulatedRef.current / DEGREES_REQUIRED, 0, 1);
    setProgress(newProgress);
    setRotation(accumulatedRef.current);

    if (newProgress >= 1 && !complete) {
      setComplete(true);
      tighteningRef.current = false;
      setTightening(false);
      setSparkle(true);
      setTimeout(() => setSparkle(false), 600);
      onComplete();
    }
  }, [complete, getAngle, onComplete]);

  const handleEnd = useCallback(() => {
    tighteningRef.current = false;
    setTightening(false);
    prevAngleRef.current = null;
  }, []);

  // Mouse events
  const onMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    handleStart(e.clientX, e.clientY);
  }, [handleStart]);

  useEffect(() => {
    if (!tightening) return;

    const onMouseMove = (e: MouseEvent) => handleMove(e.clientX, e.clientY);
    const onMouseUp = () => handleEnd();

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [tightening, handleMove, handleEnd]);

  // Touch events
  const onTouchStart = useCallback((e: React.TouchEvent) => {
    const t = e.touches[0];
    handleStart(t.clientX, t.clientY);
  }, [handleStart]);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    const t = e.touches[0];
    handleMove(t.clientX, t.clientY);
  }, [handleMove]);

  const progressColor = complete
    ? "#22c55e"
    : progress > 0.6
      ? "#eab308"
      : progress > 0
        ? "#94a3b8"
        : "#64748b";

  const screwFill = complete
    ? "#22c55e"
    : `hsl(215, 15%, ${65 - progress * 30}%)`;

  return (
    <div className="flex flex-col items-center gap-1">
      <div
        ref={containerRef}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={handleEnd}
        className={`
          relative cursor-pointer select-none
          ${tightening ? "cursor-grabbing" : complete ? "cursor-default" : "cursor-grab"}
        `}
      >
        {/* Progress ring */}
        <svg width="44" height="44" viewBox="0 0 44 44" className="absolute top-0 left-0">
          <circle
            cx="22" cy="22" r="20"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="2"
          />
          <circle
            cx="22" cy="22" r="20"
            fill="none"
            stroke={progressColor}
            strokeWidth="2.5"
            strokeDasharray={`${progress * 125.66} 125.66`}
            strokeLinecap="round"
            transform="rotate(-90 22 22)"
            className="transition-[stroke-dasharray] duration-100"
          />
        </svg>

        {/* Screw SVG */}
        <svg
          width="44" height="44" viewBox="0 0 100 100"
          style={{ transform: `rotate(${rotation % 360}deg)` }}
          className="transition-transform duration-75"
        >
          {/* Screw body */}
          <circle cx="50" cy="50" r="28" fill={screwFill} stroke="#475569" strokeWidth="2" />

          {/* Phillips head cross */}
          <line x1="36" y1="50" x2="64" y2="50"
            stroke={complete ? "#166534" : "#334155"}
            strokeWidth={complete ? "4" : "3.5"}
            strokeLinecap="round"
          />
          <line x1="50" y1="36" x2="50" y2="64"
            stroke={complete ? "#166534" : "#334155"}
            strokeWidth={complete ? "4" : "3.5"}
            strokeLinecap="round"
          />

          {/* Shine */}
          <ellipse cx="42" cy="42" rx="10" ry="6" fill="white" opacity="0.15" />
        </svg>

        {/* Sparkle on complete */}
        {sparkle && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-green-500 text-xs font-bold animate-ping">✓</div>
          </div>
        )}
      </div>

      {/* Label */}
      <span className={`text-[8px] font-bold ${
        complete ? "text-green-600" : tightening ? "text-ikea-blue" : "text-neutral-400"
      }`}>
        {complete
          ? "OK"
          : tightening
            ? `${Math.round(progress * 100)}%`
            : `↻ ${index + 1}/${total}`
        }
      </span>
    </div>
  );
}
