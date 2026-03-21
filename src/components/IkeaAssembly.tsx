"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import ScrewTightener from "./ScrewTightener";

interface FurnitureItem {
  id: string;
  type: string;
  color: string;
  accentColor?: string;
  width: number;
  height: number;
}

interface AssemblySlot {
  stepNumber: number;
  targetType: string;
}

interface ChallengeData {
  id: string;
  product: {
    name: string;
    series: string;
    icon: string;
  };
  parts: FurnitureItem[];
  slots: AssemblySlot[];
}

// ─── SVG Part Renderers ──────────────────────────────────────────────
// All parts render as abstract silhouettes — no wood grain, no screw
// details, no recognizable features. Bots can't distinguish by shape
// alone; humans rely on labels and assembly context.

function ShapeRect({ color, accentColor }: { color: string; accentColor?: string }) {
  const stroke = accentColor || adjustColor(color, -30);
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <rect x="8" y="12" width="84" height="76" rx="3" fill={color} stroke={stroke} strokeWidth="2" />
      <line x1="50" y1="22" x2="50" y2="78" stroke={stroke} strokeWidth="0.8" opacity="0.2" />
      <line x1="18" y1="50" x2="82" y2="50" stroke={stroke} strokeWidth="0.8" opacity="0.2" />
    </svg>
  );
}

function ShapeWideRect({ color, accentColor }: { color: string; accentColor?: string }) {
  const stroke = accentColor || adjustColor(color, -30);
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <rect x="5" y="28" width="90" height="44" rx="3" fill={color} stroke={stroke} strokeWidth="2" />
      <circle cx="50" cy="50" r="6" fill="none" stroke={stroke} strokeWidth="1" opacity="0.25" />
    </svg>
  );
}

function ShapeCircle({ color, accentColor }: { color: string; accentColor?: string }) {
  const stroke = accentColor || adjustColor(color, -30);
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle cx="50" cy="50" r="34" fill={color} stroke={stroke} strokeWidth="2" />
      <circle cx="50" cy="50" r="8" fill="none" stroke={stroke} strokeWidth="1.2" opacity="0.3" />
    </svg>
  );
}

function ShapeDonut({ color, accentColor }: { color: string; accentColor?: string }) {
  const stroke = accentColor || adjustColor(color, -30);
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle cx="50" cy="50" r="34" fill="none" stroke={stroke} strokeWidth="10" />
      <circle cx="50" cy="50" r="34" fill="none" stroke={color} strokeWidth="6" />
    </svg>
  );
}

function ShapeCapsule({ color, accentColor }: { color: string; accentColor?: string }) {
  const stroke = accentColor || adjustColor(color, -30);
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <rect x="12" y="35" width="76" height="30" rx="15" fill={color} stroke={stroke} strokeWidth="2" />
      <line x1="30" y1="50" x2="70" y2="50" stroke={stroke} strokeWidth="0.8" opacity="0.2" />
    </svg>
  );
}

function ShapeCross({ color, accentColor }: { color: string; accentColor?: string }) {
  const stroke = accentColor || adjustColor(color, -30);
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <rect x="38" y="12" width="24" height="76" rx="3" fill={color} stroke={stroke} strokeWidth="2" />
      <rect x="12" y="38" width="76" height="24" rx="3" fill={color} stroke={stroke} strokeWidth="2" />
    </svg>
  );
}

function ShapeLBracket({ color, accentColor }: { color: string; accentColor?: string }) {
  const stroke = accentColor || adjustColor(color, -30);
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <path d="M18,12 L18,88 L82,88 L82,68 L38,68 L38,12 Z"
        fill={color} stroke={stroke} strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

function ShapeTriangle({ color, accentColor }: { color: string; accentColor?: string }) {
  const stroke = accentColor || adjustColor(color, -30);
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <polygon points="50,10 90,85 10,85" fill={color} stroke={stroke} strokeWidth="2" strokeLinejoin="round" />
      <circle cx="50" cy="55" r="5" fill="none" stroke={stroke} strokeWidth="1" opacity="0.25" />
    </svg>
  );
}

function ShapeDiamond({ color, accentColor }: { color: string; accentColor?: string }) {
  const stroke = accentColor || adjustColor(color, -30);
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <polygon points="50,8 92,50 50,92 8,50" fill={color} stroke={stroke} strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

function ShapeHexagon({ color, accentColor }: { color: string; accentColor?: string }) {
  const stroke = accentColor || adjustColor(color, -30);
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <polygon points="50,8 90,28 90,72 50,92 10,72 10,28"
        fill={color} stroke={stroke} strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

function ShapeOval({ color, accentColor }: { color: string; accentColor?: string }) {
  const stroke = accentColor || adjustColor(color, -30);
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <ellipse cx="50" cy="50" rx="40" ry="26" fill={color} stroke={stroke} strokeWidth="2" />
      <line x1="25" y1="50" x2="75" y2="50" stroke={stroke} strokeWidth="0.8" opacity="0.2" />
    </svg>
  );
}

function ShapeStrip({ color, accentColor }: { color: string; accentColor?: string }) {
  const stroke = accentColor || adjustColor(color, -30);
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <rect x="5" y="40" width="90" height="20" rx="4" fill={color} stroke={stroke} strokeWidth="2" />
      <circle cx="25" cy="50" r="3" fill="none" stroke={stroke} strokeWidth="0.8" opacity="0.25" />
      <circle cx="75" cy="50" r="3" fill="none" stroke={stroke} strokeWidth="0.8" opacity="0.25" />
    </svg>
  );
}

function ShapeArc({ color, accentColor }: { color: string; accentColor?: string }) {
  const stroke = accentColor || adjustColor(color, -30);
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <path d="M15,75 Q15,20 50,20 Q85,20 85,75" fill="none" stroke={color} strokeWidth="10" strokeLinecap="round" />
      <path d="M15,75 Q15,20 50,20 Q85,20 85,75" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function ShapeSquarePeg({ color, accentColor }: { color: string; accentColor?: string }) {
  const stroke = accentColor || adjustColor(color, -30);
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <rect x="20" y="20" width="60" height="60" rx="2" fill={color} stroke={stroke} strokeWidth="2" />
      <rect x="35" y="35" width="30" height="30" rx="1" fill="none" stroke={stroke} strokeWidth="1" opacity="0.2" />
    </svg>
  );
}

function ShapeRoundPeg({ color, accentColor }: { color: string; accentColor?: string }) {
  const stroke = accentColor || adjustColor(color, -30);
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle cx="50" cy="50" r="30" fill={color} stroke={stroke} strokeWidth="2" />
      <circle cx="50" cy="50" r="14" fill="none" stroke={stroke} strokeWidth="0.8" opacity="0.2" />
    </svg>
  );
}

function ShapeClaw({ color, accentColor }: { color: string; accentColor?: string }) {
  const stroke = accentColor || adjustColor(color, -30);
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <path d="M20,80 L20,30 Q20,15 35,15 L65,15 Q80,15 80,30 L80,80"
        fill="none" stroke={color} strokeWidth="8" strokeLinecap="round" />
      <path d="M20,80 L20,30 Q20,15 35,15 L65,15 Q80,15 80,30 L80,80"
        fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function PartSVG({ item }: { item: FurnitureItem }) {
  const props = { color: item.color, accentColor: item.accentColor };
  switch (item.type) {
    case "rect": return <ShapeRect {...props} />;
    case "wide-rect": return <ShapeWideRect {...props} />;
    case "circle": return <ShapeCircle {...props} />;
    case "donut": return <ShapeDonut {...props} />;
    case "capsule": return <ShapeCapsule {...props} />;
    case "cross": return <ShapeCross {...props} />;
    case "l-bracket": return <ShapeLBracket {...props} />;
    case "triangle": return <ShapeTriangle {...props} />;
    case "diamond": return <ShapeDiamond {...props} />;
    case "hexagon": return <ShapeHexagon {...props} />;
    case "oval": return <ShapeOval {...props} />;
    case "strip": return <ShapeStrip {...props} />;
    case "arc": return <ShapeArc {...props} />;
    case "square-peg": return <ShapeSquarePeg {...props} />;
    case "round-peg": return <ShapeRoundPeg {...props} />;
    case "claw": return <ShapeClaw {...props} />;
    default: return <ShapeRect {...props} />;
  }
}

function adjustColor(hex: string, amount: number): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.min(255, Math.max(0, ((num >> 16) & 0xff) + amount));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0xff) + amount));
  const b = Math.min(255, Math.max(0, (num & 0xff) + amount));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

// ─── Loading Spinner ─────────────────────────────────────────────────

function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4">
      <div className="w-10 h-10 border-4 border-ikea-blue border-t-transparent rounded-full animate-spin" />
      <p className="text-sm text-neutral-500">
        Unpacking parts from the box...
      </p>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────

export default function IkeaAssembly({ onSuccess }: { onSuccess?: () => void } = {}) {
  const [challenge, setChallenge] = useState<ChallengeData | null>(null);
  const [placedParts, setPlacedParts] = useState<Record<number, FurnitureItem>>({});
  const [usedIds, setUsedIds] = useState<Set<string>>(new Set());
  const [dragOverSlot, setDragOverSlot] = useState<number | null>(null);
  const [dragOverWorkspace, setDragOverWorkspace] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [wrongSlots, setWrongSlots] = useState<Set<number>>(new Set());
  const [tightenedScrews, setTightenedScrews] = useState<Set<number>>(new Set());
  const SCREW_COUNT = 3;
  const dragItemId = useRef<string | null>(null);
  const dragSourceSlot = useRef<number | null>(null);

  const fetchChallenge = useCallback(async () => {
    setChallenge(null);
    setResult(null);
    setPlacedParts({});
    setUsedIds(new Set());
    setDragOverSlot(null);
    setDragOverWorkspace(false);
    setWrongSlots(new Set());
    setTightenedScrews(new Set());

    const res = await fetch("/api/challenge");
    const data = await res.json();
    setChallenge(data);
  }, []);

  useEffect(() => {
    fetchChallenge();
  }, [fetchChallenge]);

  const handleDragStart = useCallback(
    (e: React.DragEvent, itemId: string, source: "workspace" | "slot", slotIdx?: number) => {
      if (result) { e.preventDefault(); return; }
      dragItemId.current = itemId;
      dragSourceSlot.current = source === "slot" ? (slotIdx ?? null) : null;
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", itemId);
      const el = e.currentTarget as HTMLElement;
      setTimeout(() => el.style.opacity = "0.4", 0);
    },
    [result]
  );

  const handleDragEnd = useCallback((e: React.DragEvent) => {
    const el = e.currentTarget as HTMLElement;
    el.style.opacity = "1";
    setDragOverSlot(null);
    setDragOverWorkspace(false);
  }, []);

  const handleSlotDrop = useCallback(
    (slotIndex: number) => {
      if (result || !challenge) return;
      const itemId = dragItemId.current;
      if (!itemId) return;

      const item = challenge.parts.find((p) => p.id === itemId);
      if (!item) return;

      if (dragSourceSlot.current !== null) {
        const fromSlot = dragSourceSlot.current;
        if (fromSlot === slotIndex) { setDragOverSlot(null); return; }

        setPlacedParts((prev) => {
          const next = { ...prev };
          const existingInTarget = next[slotIndex];
          next[slotIndex] = next[fromSlot];
          if (existingInTarget) next[fromSlot] = existingInTarget;
          else delete next[fromSlot];
          return next;
        });
      } else {
        setPlacedParts((prev) => {
          const next = { ...prev };
          if (next[slotIndex]) {
            const old = next[slotIndex];
            setUsedIds((u) => { const n = new Set(u); n.delete(old.id); return n; });
          }
          next[slotIndex] = item;
          return next;
        });
        setUsedIds((prev) => new Set(prev).add(itemId));
      }

      setDragOverSlot(null);
      setTightenedScrews(new Set());
      setWrongSlots((prev) => { const n = new Set(prev); n.delete(slotIndex); return n; });
    },
    [challenge, result]
  );

  const handleWorkspaceDrop = useCallback(() => {
    if (result || dragSourceSlot.current === null) return;
    const slotIdx = dragSourceSlot.current;
    setPlacedParts((prev) => {
      const next = { ...prev };
      if (next[slotIdx]) {
        const item = next[slotIdx];
        setUsedIds((u) => { const n = new Set(u); n.delete(item.id); return n; });
        delete next[slotIdx];
      }
      return next;
    });
    setTightenedScrews(new Set());
    setDragOverWorkspace(false);
  }, [result]);

  const handleSubmit = useCallback(async () => {
    if (!challenge || submitting) return;
    setSubmitting(true);
    setAttempts((a) => a + 1);
    setWrongSlots(new Set());

    const placed: string[] = [];
    const wrong: number[] = [];

    challenge.slots.forEach((slot, i) => {
      const part = placedParts[i];
      if (part) {
        placed.push(part.id);
        if (part.type !== slot.targetType) wrong.push(i);
      }
    });

    if (wrong.length > 0) {
      setWrongSlots(new Set(wrong));
      setSubmitting(false);
      const msgs = [
        "That part doesn't go there. Have you tried squinting at the instructions?",
        "Wrong part in that slot. The Swedish gods weep.",
        "Some parts are in the wrong positions. Even the Allen key is judging you.",
        "The assembly order matters. This isn't a salad bar.",
      ];
      setResult({ success: false, message: msgs[Math.floor(Math.random() * msgs.length)] });
      return;
    }

    try {
      const res = await fetch("/api/challenge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ challengeId: challenge.id, order: placed }),
      });
      const data = await res.json();

      if (!data.success) {
        setWrongSlots(new Set(challenge.slots.map((_, i) => i)));
      }

      setResult(data);
      if (data.success && onSuccess) onSuccess();
    } catch {
      setResult({ success: false, message: "Server error. The workbench collapsed." });
    } finally {
      setSubmitting(false);
    }
  }, [challenge, placedParts, submitting, onSuccess]);

  const filledCount = Object.keys(placedParts).length;
  const allFilled = filledCount === 3;
  const allScrewsTightened = tightenedScrews.size >= SCREW_COUNT;
  const readyToSubmit = allFilled && allScrewsTightened;

  if (!challenge) return <LoadingSpinner />;

  const availableParts = challenge.parts.filter((p) => !usedIds.has(p.id));

  return (
    <div className="w-full max-w-3xl mx-auto select-none">
      {/* Header */}
      <div className="bg-ikea-blue text-white p-4 rounded-t-xl">
        <div className="flex items-center gap-3">
          <div className="bg-ikea-yellow text-ikea-blue font-black text-2xl w-10 h-10 rounded-lg flex items-center justify-center">
            {challenge.product.icon}
          </div>
          <div>
            <h2 className="font-bold text-lg leading-tight">
              {challenge.product.name} Assembly
            </h2>
            <p className="text-blue-200 text-xs">
              Proof of Humanity™ — Assembly Challenge
            </p>
          </div>
          <div className="ml-auto text-xs text-blue-200 text-right hidden sm:block">
            <div>SERIES: {challenge.product.series}</div>
            <div className="text-yellow-300 font-bold">DIFFICULTY: HUMAN</div>
          </div>
        </div>
      </div>

      {/* IKEA-style instruction panel */}
      <div className="bg-white border-x border-neutral-200 p-4">
        <div className="grid grid-cols-3 gap-2 text-[9px] text-neutral-400 border-b border-neutral-100 pb-2 mb-2">
          <div className="flex items-center gap-1">
            <span className="w-4 h-4 rounded-full bg-neutral-200 text-neutral-600 flex items-center justify-center font-bold text-[8px]">A</span>
            <span>Prepare</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-4 h-4 rounded-full bg-neutral-200 text-neutral-600 flex items-center justify-center font-bold text-[8px]">B</span>
            <span>Assemble</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-4 h-4 rounded-full bg-neutral-200 text-neutral-600 flex items-center justify-center font-bold text-[8px]">C</span>
            <span>Secure</span>
          </div>
        </div>
        <p className="text-xs text-neutral-700">
          <span className="font-bold text-[10px]">1.</span> Identify the correct shapes. Look at the ghost outline for guidance.
        </p>
        <p className="text-xs text-neutral-700 mt-1">
          <span className="font-bold text-[10px]">2.</span> Insert each shape into its designated position. Push until you hear a subtle click.
        </p>
        <p className="text-xs text-neutral-700 mt-1">
          <span className="font-bold text-[10px]">3.</span> Tighten halfway. Do not overtighten. Some movement is acceptable.
        </p>
        <div className="mt-2 pt-2 border-t border-neutral-100 text-[9px] text-neutral-400 italic">
          ⚠ Do not force parts. If it doesn&apos;t fit, you&apos;re using the wrong piece.
        </div>
      </div>

      {/* Assembly Zone */}
      <div className="bg-white border-x border-neutral-200 px-4 pb-2">
        {/* Assembly header - IKEA style */}
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="text-[10px] text-neutral-500 font-bold">
            {challenge.product.name}
          </div>
          <div className="text-[8px] text-neutral-400">
            {challenge.product.series}
          </div>
          <div className="text-[12px] opacity-60">
            {challenge.product.icon}{challenge.product.icon}{challenge.product.icon}
          </div>
        </div>

        <div className="relative bg-gradient-to-b from-slate-800 to-slate-900 rounded-xl p-4 sm:p-6 overflow-hidden">
          {/* Blueprint grid */}
          <div className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage: `
                linear-gradient(rgba(100,180,255,0.5) 1px, transparent 1px),
                linear-gradient(90deg, rgba(100,180,255,0.5) 1px, transparent 1px)
              `,
              backgroundSize: "20px 20px",
            }}
          />

          {/* Slots */}
          <div className="relative z-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-0">
            {challenge.slots.map((slot, index) => {
              const placed = placedParts[index];
              const isWrong = wrongSlots.has(index);
              const isOver = dragOverSlot === index;

              return (
                <div key={index} className="flex items-center flex-1">
                  <div
                    onDragOver={(e) => { e.preventDefault(); if (!result) setDragOverSlot(index); }}
                    onDragLeave={() => setDragOverSlot(null)}
                    onDrop={() => handleSlotDrop(index)}
                    className={`
                      relative flex-1 min-h-[130px] sm:min-h-[150px] rounded-xl border-2 border-dashed
                      transition-all duration-200
                      ${isOver && !result
                        ? "border-yellow-400 bg-yellow-400/10 scale-[1.02] shadow-[0_0_20px_rgba(250,204,21,0.2)]"
                        : placed
                          ? isWrong
                            ? "border-red-400 bg-red-400/10"
                            : result?.success
                              ? "border-green-400 bg-green-400/10"
                              : "border-blue-400/50 bg-blue-400/5"
                          : "border-slate-600 bg-slate-700/30"
                      }
                      ${isWrong ? "animate-[shake_0.4s_ease-in-out]" : ""}
                    `}
                  >
                    {placed ? (
                      <div
                        draggable={!result}
                        onDragStart={(e) => handleDragStart(e, placed.id, "slot", index)}
                        onDragEnd={handleDragEnd}
                        className={`p-3 cursor-grab active:cursor-grabbing ${result ? "cursor-default" : ""}`}
                      >
                        <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto">
                          <PartSVG item={placed} />
                        </div>
                        {isWrong && (
                          <p className="text-[8px] text-red-400 text-center mt-0.5">
                            Wrong part!
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full min-h-[130px] sm:min-h-[150px] p-3">
                        <div className="relative">
                          <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-sm shadow-inner">
                            {slot.stepNumber}
                          </div>
                          <div className="absolute -right-1 -top-1 text-[8px] text-neutral-400">①</div>
                        </div>
                        <div className="w-12 h-12 sm:w-14 sm:h-14 opacity-15 mt-2">
                          <PartSVG item={{ id: "", type: slot.targetType, color: "#94a3b8", width: 50, height: 50 }} />
                        </div>
                        <span className="text-[8px] text-slate-400 mt-1 font-medium">
                          {[
                            "tap gently",
                            "push until click",
                            "tighten halfway"
                          ][slot.stepNumber - 1] || "ok"}
                        </span>
                      </div>
                    )}
                  </div>

                  {index < challenge.slots.length - 1 && (
                    <div className="hidden sm:flex items-center justify-center w-8 text-slate-500">
                      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Parts Tray */}
      <div
        onDragOver={(e) => { e.preventDefault(); if (!result) setDragOverWorkspace(true); }}
        onDragLeave={() => setDragOverWorkspace(false)}
        onDrop={handleWorkspaceDrop}
        className={`
          border-x border-neutral-200 transition-colors duration-200
          ${dragOverWorkspace ? "bg-amber-50" : "bg-amber-50/30"}
        `}
      >
        <div className="px-4 pt-3 pb-1">
          <div className="flex items-center justify-between text-[10px] text-neutral-600 font-bold">
            <span>Parts included</span>
            <span className="text-neutral-400 font-normal">{challenge.parts.length} pcs</span>
          </div>
          <div className="text-[8px] text-neutral-400 mt-0.5 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            <span>Check that all parts are present</span>
          </div>
        </div>

        {/* Workbench surface */}
        <div className="mx-4 mb-4 p-4 rounded-xl relative overflow-hidden"
          style={{
            background: `
              linear-gradient(135deg, #D2B48C 0%, #C4A47A 30%, #BFA070 60%, #D2B48C 100%)
            `,
            boxShadow: "inset 0 2px 8px rgba(0,0,0,0.15), 0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          {/* Wood grain texture */}
          <div className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage: `
                repeating-linear-gradient(
                  85deg,
                  transparent,
                  transparent 8px,
                  rgba(139,90,43,0.15) 8px,
                  rgba(139,90,43,0.15) 9px
                ),
                repeating-linear-gradient(
                  92deg,
                  transparent,
                  transparent 15px,
                  rgba(139,90,43,0.1) 15px,
                  rgba(139,90,43,0.1) 16px
                )
              `,
            }}
          />

          <div className="relative z-10 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
            {challenge.parts.map((part) => {
              const isUsed = usedIds.has(part.id);

              return (
                <div
                  key={part.id}
                  draggable={!isUsed && !result}
                  onDragStart={(e) => handleDragStart(e, part.id, "workspace")}
                  onDragEnd={handleDragEnd}
                  className={`
                    relative group rounded-lg p-2 transition-all duration-200
                    ${isUsed
                      ? "opacity-25 scale-90 cursor-default"
                      : result
                        ? "cursor-default"
                        : "cursor-grab active:cursor-grabbing hover:scale-105 hover:shadow-lg hover:-translate-y-1"
                    }
                    ${!isUsed && !result ? "bg-white/70 shadow-md" : "bg-white/40"}
                  `}
                >
                  <div className="w-full aspect-square max-w-[70px] mx-auto">
                    <PartSVG item={part} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Leftover Screws */}
      <div className="bg-white border-x border-neutral-200 px-4 pb-3">
        <div className="flex items-start gap-2 text-[9px] text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
          <span className="text-lg leading-none">⚠</span>
          <div>
            <div className="font-bold">IMPORTANT</div>
            <div>Some pieces will not be used. This is normal. Do not throw away unused parts - they are spares.</div>
          </div>
        </div>
      </div>

      {/* Tighten Screws */}
      {allFilled && (
        <div className="bg-white border-x border-neutral-200 px-4 py-3">
          <div className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-1 flex items-center gap-2">
            <span className="inline-block w-8 h-px bg-neutral-300" />
            Fasten
            <span className="inline-block flex-1 h-px bg-neutral-300" />
          </div>
          <p className="text-[9px] text-neutral-400 mb-3">
            Rotate clockwise to tighten each screw. Two full turns per screw.
          </p>
          <div className="flex items-center justify-center gap-6 py-2">
            {Array.from({ length: SCREW_COUNT }).map((_, i) => (
              <ScrewTightener
                key={i}
                index={i}
                total={SCREW_COUNT}
                onComplete={() => {
                  setTightenedScrews((prev) => {
                    const next = new Set(prev);
                    next.add(i);
                    return next;
                  });
                }}
              />
            ))}
          </div>
          {allScrewsTightened && (
            <p className="text-[9px] text-green-600 text-center mt-1 font-bold">
              All fasteners secured.
            </p>
          )}
        </div>
      )}

      {/* Submit / Result */}
      <div className="bg-neutral-50 border border-neutral-200 rounded-b-xl p-4">
        {result === null ? (
          <div className="flex items-center gap-3">
            <button
              onClick={handleSubmit}
              disabled={!readyToSubmit || submitting}
              className={`
                flex-1 py-3 rounded-lg font-bold text-sm uppercase tracking-wider transition-all
                ${readyToSubmit && !submitting
                  ? "bg-ikea-blue text-white hover:bg-blue-800 active:scale-[0.98] shadow-lg"
                  : "bg-neutral-200 text-neutral-400 cursor-not-allowed"
                }
              `}
            >
              {submitting
                ? "VERIFYING..."
                : !allFilled
                  ? `×${3 - filledCount} EMPTY`
                  : !allScrewsTightened
                    ? `TIGHTEN ${SCREW_COUNT - tightenedScrews.size} SCREW${SCREW_COUNT - tightenedScrews.size !== 1 ? "S" : ""}`
                    : "CHECK"
              }
            </button>
            <div className="text-xs text-neutral-400 text-center min-w-[50px]">
              <div className="font-bold text-sm">{filledCount}/3</div>
              <div>placed</div>
            </div>
          </div>
        ) : result.success ? (
          <div className="text-center space-y-3">
            <div className="text-5xl">{challenge.product.icon}</div>
            <div className="text-lg font-black text-green-700 uppercase tracking-wide">
              Assembly Complete
            </div>
            <p className="text-sm text-green-600">{result.message}</p>
            <div className="bg-green-100 rounded-lg p-3 text-xs text-green-700 flex items-center justify-center gap-4">
              <span><span className="font-bold">Attempts:</span> {attempts}</span>
              <span className="text-green-300">|</span>
              <span><span className="font-bold">Leftover screws:</span> always</span>
            </div>
            <button
              onClick={fetchChallenge}
              className="bg-ikea-yellow text-ikea-blue px-6 py-2 rounded-lg font-bold text-sm hover:bg-yellow-300 transition-colors"
            >
              New Challenge
            </button>
          </div>
        ) : (
          <div className="text-center space-y-3">
            <div className="text-5xl">🔧</div>
            <div className="text-lg font-black text-red-700 uppercase tracking-wide">
              Assembly Failed
            </div>
            <p className="text-sm text-red-600">{result.message}</p>
            <button
              onClick={fetchChallenge}
              className="bg-ikea-blue text-white px-6 py-2 rounded-lg font-bold text-sm hover:bg-blue-800 transition-colors"
            >
              Try New Challenge
            </button>
          </div>
        )}
      </div>

      {/* Fine Print */}
      <div className="mt-3 text-center text-[8px] text-neutral-400 leading-relaxed">
        {challenge.product.name} / {challenge.product.series}
        <br />
        © Inter IKEA Systems B.V. 2024
      </div>
    </div>
  );
}
