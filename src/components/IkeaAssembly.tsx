"use client";

import { useState, useRef, useCallback, useEffect } from "react";

interface FurnitureItem {
  id: string;
  type: string;
  label: string;
  color: string;
  accentColor?: string;
  width: number;
  height: number;
}

interface AssemblySlot {
  stepNumber: number;
  description: string;
  targetType: string;
  label: string;
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
  answer: {
    order: string[];
    decoy: string;
    leftoverScrews: string[];
  };
}

// ─── SVG Part Renderers ──────────────────────────────────────────────

function WoodGrain({ color }: { color: string }) {
  const darker = adjustColor(color, -12);
  return (
    <g opacity="0.18" stroke={darker} strokeWidth="0.7" fill="none">
      <path d="M5,8 Q20,5 35,9 T65,7 T95,8" />
      <path d="M5,18 Q25,15 40,19 T70,16 T95,18" />
      <path d="M5,28 Q15,25 30,29 T60,26 T95,28" />
      <path d="M5,38 Q22,35 38,39 T68,36 T95,38" />
      <path d="M5,48 Q18,45 33,49 T63,46 T95,48" />
      <path d="M5,58 Q28,55 43,59 T73,56 T95,58" />
      <path d="M5,68 Q20,65 35,69 T65,66 T95,68" />
      <path d="M5,78 Q24,75 39,79 T69,76 T95,78" />
      <path d="M5,88 Q16,85 31,89 T61,86 T95,88" />
    </g>
  );
}

function PanelTall({ color, accentColor }: { color: string; accentColor?: string }) {
  const edge = accentColor || adjustColor(color, -25);
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <rect x="8" y="3" width="55" height="94" rx="2"
        fill={color} stroke={edge} strokeWidth="1.5" />
      <rect x="8" y="3" width="22" height="94" rx="2"
        fill={adjustColor(color, 8)} opacity="0.3" />
      <WoodGrain color={color} />
      <circle cx="18" cy="15" r="2.5" fill={edge} opacity="0.5" />
      <circle cx="18" cy="50" r="2.5" fill={edge} opacity="0.5" />
      <circle cx="18" cy="85" r="2.5" fill={edge} opacity="0.5" />
    </svg>
  );
}

function PanelWide({ color, accentColor }: { color: string; accentColor?: string }) {
  const edge = accentColor || adjustColor(color, -25);
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <rect x="3" y="22" width="94" height="42" rx="2"
        fill={color} stroke={edge} strokeWidth="1.5" />
      <rect x="3" y="22" width="94" height="14" rx="2"
        fill={adjustColor(color, 10)} opacity="0.3" />
      <WoodGrain color={color} />
      <circle cx="15" cy="43" r="2" fill={edge} opacity="0.4" />
      <circle cx="85" cy="43" r="2" fill={edge} opacity="0.4" />
    </svg>
  );
}

function PanelThin({ color, accentColor }: { color: string; accentColor?: string }) {
  const edge = accentColor || adjustColor(color, -25);
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <rect x="12" y="3" width="42" height="94" rx="1"
        fill={color} stroke={edge} strokeWidth="1" />
      <g opacity="0.1" stroke={edge} strokeWidth="0.5" fill="none">
        <path d="M15,10 L50,10" /><path d="M15,25 L50,25" />
        <path d="M15,40 L50,40" /><path d="M15,55 L50,55" />
        <path d="M15,70 L50,70" /><path d="M15,85 L50,85" />
      </g>
      <line x1="33" y1="8" x2="33" y2="92" stroke={edge} strokeWidth="0.3" opacity="0.15" />
    </svg>
  );
}

function PanelSquare({ color, accentColor }: { color: string; accentColor?: string }) {
  const edge = accentColor || adjustColor(color, -25);
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <rect x="10" y="8" width="60" height="80" rx="2"
        fill={color} stroke={edge} strokeWidth="1.5" />
      <rect x="10" y="8" width="25" height="80" rx="2"
        fill={adjustColor(color, 8)} opacity="0.25" />
      <WoodGrain color={color} />
      <circle cx="55" cy="48" r="3" fill="none" stroke={edge} strokeWidth="1" opacity="0.4" />
    </svg>
  );
}

function Screw({ color, accentColor }: { color: string; accentColor?: string }) {
  const dark = accentColor || adjustColor(color, -30);
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle cx="50" cy="38" r="22" fill={color} stroke={dark} strokeWidth="2" />
      <ellipse cx="50" cy="38" rx="22" ry="6" fill={adjustColor(color, 15)} opacity="0.4" />
      <line x1="38" y1="38" x2="62" y2="38" stroke={dark} strokeWidth="2.5" />
      <line x1="50" y1="26" x2="50" y2="50" stroke={dark} strokeWidth="2.5" />
      <path d="M42,55 L42,88 Q42,92 46,92 L54,92 Q58,92 58,88 L58,55"
        fill={dark} />
      <path d="M42,60 L58,57 M42,68 L58,65 M42,76 L58,73 M42,84 L58,81"
        stroke={adjustColor(color, 20)} strokeWidth="1" opacity="0.3" />
    </svg>
  );
}

function Dowel({ color, accentColor }: { color: string; accentColor?: string }) {
  const edge = accentColor || adjustColor(color, -20);
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <rect x="15" y="38" width="70" height="24" rx="12"
        fill={color} stroke={edge} strokeWidth="1.5" />
      <rect x="15" y="38" width="70" height="10" rx="5"
        fill={adjustColor(color, 15)} opacity="0.3" />
      <ellipse cx="15" cy="50" rx="4" ry="12" fill={adjustColor(color, 10)} stroke={edge} strokeWidth="1" />
      <ellipse cx="85" cy="50" rx="4" ry="12" fill={edge} stroke={adjustColor(edge, -10)} strokeWidth="1" />
    </svg>
  );
}

function Bracket({ color, accentColor }: { color: string; accentColor?: string }) {
  const dark = accentColor || adjustColor(color, -25);
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <path d="M20,15 L20,80 L80,80 L80,65 L35,65 L35,15 Z"
        fill={color} stroke={dark} strokeWidth="2" strokeLinejoin="round" />
      <circle cx="27" cy="28" r="4" fill="none" stroke={dark} strokeWidth="1.5" />
      <circle cx="27" cy="52" r="4" fill="none" stroke={dark} strokeWidth="1.5" />
      <circle cx="67" cy="73" r="4" fill="none" stroke={dark} strokeWidth="1.5" />
      <path d="M20,15 L80,15" stroke={adjustColor(color, 20)} strokeWidth="1" opacity="0.3" />
    </svg>
  );
}

function GlassPanel({ color, accentColor }: { color: string; accentColor?: string }) {
  const edge = accentColor || adjustColor(color, -20);
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <rect x="8" y="28" width="84" height="44" rx="2"
        fill={color} fillOpacity="0.4" stroke={edge} strokeWidth="1.5" />
      <rect x="8" y="28" width="30" height="44" rx="2"
        fill="white" fillOpacity="0.15" />
      <path d="M15,32 L40,68" stroke="white" strokeWidth="1.5" opacity="0.4" />
      <path d="M22,32 L47,68" stroke="white" strokeWidth="0.8" opacity="0.25" />
      <rect x="8" y="28" width="84" height="44" rx="2"
        fill="none" stroke={edge} strokeWidth="0.5" strokeDasharray="4,3" opacity="0.5" />
    </svg>
  );
}

function RubberFoot({ color, accentColor }: { color: string; accentColor?: string }) {
  const dark = accentColor || adjustColor(color, -20);
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <ellipse cx="50" cy="65" rx="35" ry="18" fill={dark} />
      <ellipse cx="50" cy="60" rx="32" ry="15" fill={color} stroke={dark} strokeWidth="1.5" />
      <ellipse cx="50" cy="56" rx="20" ry="8" fill={adjustColor(color, 15)} opacity="0.4" />
      <ellipse cx="50" cy="52" rx="14" ry="5" fill={adjustColor(color, 25)} opacity="0.2" />
      <text x="50" y="68" textAnchor="middle" fontSize="8" fill={adjustColor(color, 30)} fontWeight="bold" opacity="0.4">GRIP</text>
    </svg>
  );
}

function PartSVG({ item }: { item: FurnitureItem }) {
  const props = { color: item.color, accentColor: item.accentColor };
  switch (item.type) {
    case "panel-tall": return <PanelTall {...props} />;
    case "panel-wide": return <PanelWide {...props} />;
    case "panel-thin": return <PanelThin {...props} />;
    case "panel-square": return <PanelSquare {...props} />;
    case "screw": return <Screw {...props} />;
    case "dowel": return <Dowel {...props} />;
    case "bracket": return <Bracket {...props} />;
    case "glass-panel": return <GlassPanel {...props} />;
    case "rubber-foot": return <RubberFoot {...props} />;
    default: return <PanelSquare {...props} />;
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

// ─── Slot Target Icon ────────────────────────────────────────────────

function SlotTargetIcon({ type }: { type: string }) {
  const iconMap: Record<string, string> = {
    "panel-tall": "▬",
    "panel-wide": "▭",
    "panel-thin": "▮",
    "panel-square": "◻",
    screw: "⊕",
    dowel: "⊖",
    bracket: "⌐",
    "glass-panel": "◻",
    "rubber-foot": "◉",
  };
  return <span className="text-lg opacity-50">{iconMap[type] || "◻"}</span>;
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

      {/* Instruction */}
      <div className="bg-white border-x border-neutral-200 p-4">
        <p className="text-sm text-neutral-700 font-medium">
          Drag the correct parts into each assembly slot. Leave the decoy and spare parts on the table.
        </p>
        <p className="text-xs text-neutral-400 mt-1 italic">
          Real assembly always has leftover screws. Only a robot would try to use every part.
        </p>
      </div>

      {/* Assembly Zone */}
      <div className="bg-white border-x border-neutral-200 px-4 pb-2">
        <div className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-3 flex items-center gap-2">
          <span className="inline-block w-8 h-px bg-neutral-300" />
          Assembly Area
          <span className="inline-block flex-1 h-px bg-neutral-300" />
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
                        <p className="text-[9px] text-slate-300 text-center mt-1 truncate">
                          {placed.label}
                        </p>
                        {isWrong && (
                          <p className="text-[8px] text-red-400 text-center mt-0.5">
                            Wrong part!
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full min-h-[130px] sm:min-h-[150px] p-3">
                        <SlotTargetIcon type={slot.targetType} />
                        <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mt-2">
                          {slot.label}
                        </div>
                        <p className="text-slate-500 text-[9px] text-center mt-1 leading-tight max-w-[120px]">
                          {slot.description}
                        </p>
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
        <div className="px-4 pt-3 pb-1 flex items-center justify-between">
          <div className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest flex items-center gap-2">
            Parts Tray
            {dragOverWorkspace && (
              <span className="text-amber-600 normal-case font-normal">
                — Drop here to return
              </span>
            )}
          </div>
          <div className="text-[10px] text-neutral-400">
            {availableParts.length} part{availableParts.length !== 1 ? "s" : ""} remaining
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
              const isLeftover = challenge.answer.leftoverScrews.includes(part.id);
              const isDecoy = challenge.answer.decoy === part.id;

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
                  <p className={`text-[8px] text-center mt-1 leading-tight font-medium truncate
                    ${isUsed ? "text-neutral-400" : "text-neutral-700"}
                  `}>
                    {part.label}
                  </p>

                  {/* Badge for special parts */}
                  {isLeftover && !isUsed && (
                    <div className="absolute -top-1 -right-1 bg-amber-500 text-white text-[7px] font-bold px-1 py-0.5 rounded-full leading-none">
                      SPARE
                    </div>
                  )}
                  {isDecoy && !isUsed && (
                    <div className="absolute -top-1 -right-1 bg-red-500 text-white text-[7px] font-bold px-1 py-0.5 rounded-full leading-none">
                      ?
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Leftover Screws */}
      <div className="bg-white border-x border-neutral-200 px-4 pb-3">
        <div className="flex items-center gap-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
          <span className="font-bold">NOTE:</span>
          <span className="italic">
            Spare screws, Allen keys, and mystery parts in the tray are normal.
            Real humans know to ignore them.
          </span>
        </div>
      </div>

      {/* Submit / Result */}
      <div className="bg-neutral-50 border border-neutral-200 rounded-b-xl p-4">
        {result === null ? (
          <div className="flex items-center gap-3">
            <button
              onClick={handleSubmit}
              disabled={!allFilled || submitting}
              className={`
                flex-1 py-3 rounded-lg font-bold text-sm uppercase tracking-wider transition-all
                ${allFilled && !submitting
                  ? "bg-ikea-blue text-white hover:bg-blue-800 active:scale-[0.98] shadow-lg"
                  : "bg-neutral-200 text-neutral-400 cursor-not-allowed"
                }
              `}
            >
              {submitting
                ? "Inspecting assembly..."
                : allFilled
                  ? "Verify Assembly"
                  : `Place ${3 - filledCount} more part${3 - filledCount !== 1 ? "s" : ""}`}
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
      <div className="mt-3 text-center text-[9px] text-neutral-400 leading-relaxed">
        {challenge.product.name}™ is a product of the Proof of Humanity™ CAPTCHA system.
        <br />
        All leftover screws are intentional. Existential dread is a feature, not a bug.
      </div>

    </div>
  );
}
