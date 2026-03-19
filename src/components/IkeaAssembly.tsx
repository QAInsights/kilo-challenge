"use client";

import { useState, useRef, useCallback, useEffect } from "react";

interface Panel {
  id: string;
  stepLabel: string;
  text: string;
  icon: string;
}

interface ChallengeData {
  id: string;
  product: {
    name: string;
    series: string;
    icon: string;
  };
  panels: Panel[];
}

interface SlotState {
  panel: Panel | null;
}

function ScrewIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <circle cx="12" cy="6" r="2" />
      <line x1="12" y1="8" x2="12" y2="20" />
      <line x1="9" y1="10" x2="15" y2="10" />
      <line x1="9" y1="14" x2="15" y2="14" />
    </svg>
  );
}

function LeftoverScrews({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
      <span className="font-bold">LEFTOVER PARTS:</span>
      <div className="flex gap-1">
        {Array.from({ length: count }).map((_, i) => (
          <ScrewIcon key={i} className="w-4 h-4 text-amber-700" />
        ))}
      </div>
      <span className="italic text-amber-500">...don&apos;t worry about these</span>
    </div>
  );
}

function PanelIllustration({ icon }: { icon: string }) {
  return (
    <div className="relative w-full aspect-square bg-neutral-100 rounded-lg flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(45deg,#e8e8e8_25%,transparent_25%,transparent_75%,#e8e8e8_75%),linear-gradient(45deg,#e8e8e8_25%,transparent_25%,transparent_75%,#e8e8e8_75%)] bg-[length:20px_20px] bg-[position:0_0,10px_10px] opacity-40" />
      <span className="text-5xl relative z-10 select-none">{icon}</span>
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4">
      <div className="w-10 h-10 border-4 border-ikea-blue border-t-transparent rounded-full animate-spin" />
      <p className="text-sm text-neutral-500">
        Assembling challenge from spare parts...
      </p>
    </div>
  );
}

export default function IkeaAssembly() {
  const [challenge, setChallenge] = useState<ChallengeData | null>(null);
  const [slots, setSlots] = useState<SlotState[]>([
    { panel: null },
    { panel: null },
    { panel: null },
  ]);
  const [completedPanels, setCompletedPanels] = useState<Set<string>>(
    new Set()
  );
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [dragOverSlot, setDragOverSlot] = useState<number | null>(null);
  const [dragOverSource, setDragOverSource] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const dragData = useRef<string | null>(null);
  const dragSource = useRef<"source" | "slot" | null>(null);
  const dragSlotIndex = useRef<number | null>(null);

  const fetchChallenge = useCallback(async () => {
    setChallenge(null);
    setResult(null);
    setSlots([{ panel: null }, { panel: null }, { panel: null }]);
    setCompletedPanels(new Set());
    setDragOverSlot(null);
    setDragOverSource(false);

    const res = await fetch("/api/challenge");
    const data = await res.json();
    setChallenge(data);
  }, []);

  useEffect(() => {
    fetchChallenge();
  }, [fetchChallenge]);

  const handleDragStart = useCallback(
    (panelId: string, source: "source" | "slot", slotIndex?: number) => {
      dragData.current = panelId;
      dragSource.current = source;
      dragSlotIndex.current = slotIndex ?? null;
    },
    []
  );

  const handleSlotDrop = useCallback(
    (slotIndex: number) => {
      if (result) return;
      const panelId = dragData.current;
      const source = dragSource.current;
      if (!panelId || !challenge) return;

      const panel = challenge.panels.find((p) => p.id === panelId);
      if (!panel) return;

      if (source === "source") {
        setSlots((prev) => {
          const next = [...prev];
          const existingPanel = next[slotIndex].panel;
          if (existingPanel) {
            setCompletedPanels((cp) => {
              const newCp = new Set(cp);
              newCp.delete(existingPanel.id);
              return newCp;
            });
          }
          next[slotIndex] = { panel };
          return next;
        });
        setCompletedPanels((prev) => new Set(prev).add(panelId));
      } else if (source === "slot" && dragSlotIndex.current !== null) {
        const fromIndex = dragSlotIndex.current;
        setSlots((prev) => {
          const next = [...prev];
          const temp = next[fromIndex];
          next[fromIndex] = next[slotIndex];
          next[slotIndex] = temp;
          return next;
        });
      }

      setDragOverSlot(null);
    },
    [challenge, result]
  );

  const handleSourceDrop = useCallback(() => {
    if (result) return;
    const panelId = dragData.current;
    const source = dragSource.current;
    if (!panelId || source !== "slot" || dragSlotIndex.current === null) return;

    const slotIdx = dragSlotIndex.current;
    setSlots((prev) => {
      const next = [...prev];
      next[slotIdx] = { panel: null };
      return next;
    });
    setCompletedPanels((prev) => {
      const newCp = new Set(prev);
      newCp.delete(panelId);
      return newCp;
    });
    setDragOverSource(false);
  }, [result]);

  const handleDragOver = useCallback(
    (e: React.DragEvent, slotIndex: number) => {
      e.preventDefault();
      if (!result) setDragOverSlot(slotIndex);
    },
    [result]
  );

  const handleSourceDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (!result) setDragOverSource(true);
    },
    [result]
  );

  const handleSubmit = useCallback(async () => {
    if (!challenge || submitting) return;
    setSubmitting(true);
    setAttempts((a) => a + 1);

    const order = slots
      .filter((s) => s.panel !== null)
      .map((s) => s.panel!.id);

    try {
      const res = await fetch("/api/challenge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ challengeId: challenge.id, order }),
      });
      const data = await res.json();
      setResult(data);
    } catch {
      setResult({ success: false, message: "Server error. Even our servers gave up." });
    } finally {
      setSubmitting(false);
    }
  }, [challenge, slots, submitting]);

  const filledCount = slots.filter((s) => s.panel !== null).length;

  if (!challenge) {
    return <LoadingSpinner />;
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Header */}
      <div className="bg-ikea-blue text-white p-4 rounded-t-xl">
        <div className="flex items-center gap-3">
          <div className="bg-ikea-yellow text-ikea-blue font-black text-lg w-8 h-8 rounded flex items-center justify-center">
            {challenge.product.icon}
          </div>
          <div>
            <h2 className="font-bold text-lg leading-tight">
              {challenge.product.name} Assembly
            </h2>
            <p className="text-blue-200 text-xs">
              Proof of Humanity™ — Random Challenge
            </p>
          </div>
          <div className="ml-auto text-xs text-blue-200 text-right">
            <div>SERIES: {challenge.product.series}</div>
            <div className="text-yellow-300 font-bold">DIFFICULTY: HUMAN</div>
          </div>
        </div>
      </div>

      {/* Instruction */}
      <div className="bg-white border-x border-neutral-200 p-4">
        <p className="text-sm text-neutral-600 mb-1 font-medium">
          Drag the 3 correct assembly steps into the slots below. Discard the
          irrelevant panel.
        </p>
        <p className="text-xs text-neutral-400 italic">
          One panel does not belong. Robots cannot detect irony. Can you?
        </p>
      </div>

      {/* Leftover Screws */}
      <div className="bg-white border-x border-neutral-200 px-4 pb-3">
        <LeftoverScrews count={3 + Math.floor(Math.random() * 5)} />
      </div>

      {/* Slot Area */}
      <div className="bg-white border-x border-neutral-200 px-4 pb-4">
        <div className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">
          Assembly Order
        </div>
        <div className="grid grid-cols-3 gap-3">
          {slots.map((slot, index) => (
            <div
              key={index}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragLeave={() => setDragOverSlot(null)}
              onDrop={() => handleSlotDrop(index)}
              className={`
                relative min-h-[120px] rounded-lg border-2 border-dashed transition-all
                ${
                  dragOverSlot === index
                    ? "border-ikea-blue bg-blue-50 scale-[1.02]"
                    : slot.panel
                    ? "border-neutral-300 bg-white"
                    : "border-neutral-200 bg-neutral-50"
                }
                ${result?.success ? "border-green-400 bg-green-50" : ""}
                ${result && !result.success ? "border-red-300 bg-red-50" : ""}
              `}
            >
              {slot.panel ? (
                <div
                  draggable={!result}
                  onDragStart={() =>
                    handleDragStart(slot.panel!.id, "slot", index)
                  }
                  className={`p-3 cursor-grab active:cursor-grabbing ${result ? "cursor-default" : ""}`}
                >
                  <div className="flex items-center gap-1 mb-2">
                    <span className="text-xs font-bold text-neutral-400">
                      SLOT {index + 1}
                    </span>
                  </div>
                  <PanelIllustration icon={slot.panel.icon} />
                  <div className="mt-2">
                    <div className="text-[10px] font-bold text-ikea-blue tracking-wider">
                      {slot.panel.stepLabel}
                    </div>
                    <p className="text-[10px] text-neutral-600 mt-1 leading-relaxed">
                      {slot.panel.text}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full min-h-[120px] text-neutral-300">
                  <span className="text-2xl mb-1">+</span>
                  <span className="text-[10px] uppercase tracking-wider">
                    Drop here
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Source Panels */}
      <div
        onDragOver={handleSourceDragOver}
        onDragLeave={() => setDragOverSource(false)}
        onDrop={handleSourceDrop}
        className={`
          border-x border-neutral-200 p-4 transition-colors
          ${dragOverSource ? "bg-amber-50" : "bg-white"}
        `}
      >
        <div className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">
          Available Panels
          {dragOverSource && (
            <span className="ml-2 text-amber-600 normal-case">
              — Drop here to return
            </span>
          )}
        </div>
        <div className="grid grid-cols-2 gap-3">
          {challenge.panels.map((panel) => {
            const isPlaced = completedPanels.has(panel.id);
            return (
              <div
                key={panel.id}
                draggable={!isPlaced && !result}
                onDragStart={() => handleDragStart(panel.id, "source")}
                className={`
                  rounded-lg border-2 p-3 transition-all
                  ${
                    isPlaced
                      ? "border-neutral-200 bg-neutral-100 opacity-40"
                      : "border-neutral-300 bg-white hover:border-ikea-blue hover:shadow-md cursor-grab active:cursor-grabbing"
                  }
                  ${result ? "cursor-default" : ""}
                `}
              >
                <PanelIllustration icon={panel.icon} />
                <div className="mt-2">
                  <div className="text-[10px] font-bold text-ikea-blue tracking-wider">
                    {panel.stepLabel}
                  </div>
                  <p className="text-[10px] text-neutral-600 mt-1 leading-relaxed">
                    {panel.text}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Submit / Result */}
      <div className="bg-neutral-50 border border-neutral-200 rounded-b-xl p-4">
        {result === null ? (
          <div className="flex items-center gap-3">
            <button
              onClick={handleSubmit}
              disabled={filledCount !== 3 || submitting}
              className={`
                flex-1 py-3 rounded-lg font-bold text-sm uppercase tracking-wider transition-all
                ${
                  filledCount === 3 && !submitting
                    ? "bg-ikea-blue text-white hover:bg-blue-800 active:scale-[0.98]"
                    : "bg-neutral-200 text-neutral-400 cursor-not-allowed"
                }
              `}
            >
              {submitting
                ? "Verifying humanity..."
                : filledCount === 3
                ? "Assemble Bookshelf"
                : `Place ${3 - filledCount} more panel${3 - filledCount !== 1 ? "s" : ""}`}
            </button>
            <div className="text-xs text-neutral-400 text-center">
              <div className="font-bold">{filledCount}/3</div>
              <div>placed</div>
            </div>
          </div>
        ) : result.success ? (
          <div className="text-center space-y-3">
            <div className="text-4xl">{challenge.product.icon}</div>
            <div className="text-lg font-black text-green-700">
              BOOKSHELF ASSEMBLED
            </div>
            <p className="text-sm text-green-600">{result.message}</p>
            <div className="bg-green-100 rounded-lg p-3 text-xs text-green-700">
              <span className="font-bold">Attempts:</span> {attempts} |
              <span className="font-bold ml-2">Leftover screws:</span>{" "}
              always
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
            <div className="text-4xl">💀</div>
            <div className="text-lg font-black text-red-700">
              ASSEMBLY FAILED
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
        {challenge.product.name}™ is a product of the Proof of Humanity™
        CAPTCHA system.
        <br />
        All leftover screws are intentional. Existential dread is a feature, not
        a bug.
      </div>
    </div>
  );
}
