"use client";

import { useRef, useState, useCallback, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, RoundedBox } from "@react-three/drei";
import * as THREE from "three";

// ─── Types ───────────────────────────────────────────────────────────

interface Part3D {
  id: string;
  label: string;
  meshType: "tabletop" | "leg" | "shelf" | "backrest" | "crossbar" | "bracket" | "screw";
  color: string;
  position: [number, number, number]; // scattered position
  targetPosition: [number, number, number]; // assembled position
  size: [number, number, number];
  isDecoy: boolean;
  isPlaced: boolean;
}

interface Furniture3D {
  name: string;
  series: string;
  icon: string;
  parts: Part3D[];
  cameraPos: [number, number, number];
}

// ─── Furniture Definitions ───────────────────────────────────────────

const FURNITURE: Furniture3D[] = [
  {
    name: "SKRIVBORD",
    series: "ARBETSGLÄDJE",
    icon: "🖥️",
    cameraPos: [6, 5, 6],
    parts: [
      {
        id: "desk-top", label: "Desktop", meshType: "tabletop",
        color: "#C4956A", position: [-3, 0.15, 0], targetPosition: [0, 1.5, 0],
        size: [3, 0.12, 1.5], isDecoy: false, isPlaced: false,
      },
      {
        id: "desk-leg-fl", label: "Leg", meshType: "leg",
        color: "#888", position: [1, 0.4, -2], targetPosition: [-1.3, 0.7, -0.6],
        size: [0.1, 1.4, 0.1], isDecoy: false, isPlaced: false,
      },
      {
        id: "desk-leg-fr", label: "Leg", meshType: "leg",
        color: "#888", position: [2, 0.4, 2], targetPosition: [1.3, 0.7, -0.6],
        size: [0.1, 1.4, 0.1], isDecoy: false, isPlaced: false,
      },
      {
        id: "desk-leg-bl", label: "Leg", meshType: "leg",
        color: "#999", position: [0, 0.4, 3], targetPosition: [-1.3, 0.7, 0.6],
        size: [0.1, 1.4, 0.1], isDecoy: false, isPlaced: false,
      },
      {
        id: "desk-leg-br", label: "Leg", meshType: "leg",
        color: "#999", position: [-2, 0.4, -3], targetPosition: [1.3, 0.7, 0.6],
        size: [0.1, 1.4, 0.1], isDecoy: false, isPlaced: false,
      },
      {
        id: "desk-decoy", label: "Keyboard Tray", meshType: "crossbar",
        color: "#A08060", position: [3, 0.1, 1], targetPosition: [0, 0, 0],
        size: [1.2, 0.08, 0.5], isDecoy: true, isPlaced: false,
      },
    ],
  },
  {
    name: "BOKHYLLA",
    series: "SIDFLÄK",
    icon: "📖",
    cameraPos: [5, 4, 5],
    parts: [
      {
        id: "shelf-side-l", label: "Left Panel", meshType: "shelf",
        color: "#B8875A", position: [-3, 0.8, 1], targetPosition: [-1.2, 1, 0],
        size: [0.08, 2.5, 0.8], isDecoy: false, isPlaced: false,
      },
      {
        id: "shelf-side-r", label: "Right Panel", meshType: "shelf",
        color: "#B8875A", position: [3, 0.8, -1], targetPosition: [1.2, 1, 0],
        size: [0.08, 2.5, 0.8], isDecoy: false, isPlaced: false,
      },
      {
        id: "shelf-mid-1", label: "Shelf Board", meshType: "tabletop",
        color: "#C4956A", position: [0, 0.1, -3], targetPosition: [0, 0.5, 0],
        size: [2.3, 0.06, 0.75], isDecoy: false, isPlaced: false,
      },
      {
        id: "shelf-mid-2", label: "Shelf Board", meshType: "tabletop",
        color: "#C4956A", position: [-1, 0.1, 3], targetPosition: [0, 1.2, 0],
        size: [2.3, 0.06, 0.75], isDecoy: false, isPlaced: false,
      },
      {
        id: "shelf-mid-3", label: "Shelf Board", meshType: "tabletop",
        color: "#C4956A", position: [2, 0.1, 0], targetPosition: [0, 1.9, 0],
        size: [2.3, 0.06, 0.75], isDecoy: false, isPlaced: false,
      },
      {
        id: "shelf-decoy", label: "Glass Insert", meshType: "tabletop",
        color: "#B8D4E3", position: [0, 0.05, 4], targetPosition: [0, 0, 0],
        size: [2, 0.03, 0.7], isDecoy: true, isPlaced: false,
      },
    ],
  },
  {
    name: "STOL",
    series: "SITTKOMFORT",
    icon: "🪑",
    cameraPos: [4, 3.5, 4],
    parts: [
      {
        id: "chair-seat", label: "Seat", meshType: "tabletop",
        color: "#C4956A", position: [-2, 0.1, 0], targetPosition: [0, 1, 0],
        size: [1.2, 0.08, 1.2], isDecoy: false, isPlaced: false,
      },
      {
        id: "chair-back", label: "Backrest", meshType: "backrest",
        color: "#B8875A", position: [2, 0.6, -2], targetPosition: [0, 1.8, -0.55],
        size: [1.1, 1.2, 0.08], isDecoy: false, isPlaced: false,
      },
      {
        id: "chair-leg-fl", label: "Leg", meshType: "leg",
        color: "#888", position: [0, 0.3, 2], targetPosition: [-0.5, 0.45, 0.5],
        size: [0.07, 0.95, 0.07], isDecoy: false, isPlaced: false,
      },
      {
        id: "chair-leg-fr", label: "Leg", meshType: "leg",
        color: "#888", position: [1, 0.3, -1], targetPosition: [0.5, 0.45, 0.5],
        size: [0.07, 0.95, 0.07], isDecoy: false, isPlaced: false,
      },
      {
        id: "chair-leg-bl", label: "Leg", meshType: "leg",
        color: "#999", position: [-1, 0.3, -3], targetPosition: [-0.5, 0.45, -0.5],
        size: [0.07, 0.95, 0.07], isDecoy: false, isPlaced: false,
      },
      {
        id: "chair-decoy", label: "Armrest", meshType: "bracket",
        color: "#A08060", position: [3, 0.2, 3], targetPosition: [0, 0, 0],
        size: [0.1, 0.5, 0.8], isDecoy: true, isPlaced: false,
      },
    ],
  },
  {
    name: "BORD",
    series: "MATDAG",
    icon: "🍽️",
    cameraPos: [5, 4, 5],
    parts: [
      {
        id: "table-top", label: "Tabletop", meshType: "tabletop",
        color: "#D2B48C", position: [0, 0.15, -3], targetPosition: [0, 1.6, 0],
        size: [2.5, 0.1, 1.5], isDecoy: false, isPlaced: false,
      },
      {
        id: "table-leg-1", label: "Leg", meshType: "leg",
        color: "#888", position: [-2, 0.4, 2], targetPosition: [-1.1, 0.75, -0.6],
        size: [0.1, 1.5, 0.1], isDecoy: false, isPlaced: false,
      },
      {
        id: "table-leg-2", label: "Leg", meshType: "leg",
        color: "#888", position: [2, 0.4, 2], targetPosition: [1.1, 0.75, -0.6],
        size: [0.1, 1.5, 0.1], isDecoy: false, isPlaced: false,
      },
      {
        id: "table-leg-3", label: "Leg", meshType: "leg",
        color: "#999", position: [-3, 0.4, 0], targetPosition: [-1.1, 0.75, 0.6],
        size: [0.1, 1.5, 0.1], isDecoy: false, isPlaced: false,
      },
      {
        id: "table-leg-4", label: "Leg", meshType: "leg",
        color: "#999", position: [3, 0.4, 0], targetPosition: [1.1, 0.75, 0.6],
        size: [0.1, 1.5, 0.1], isDecoy: false, isPlaced: false,
      },
      {
        id: "table-decoy", label: "Cross Brace", meshType: "crossbar",
        color: "#7A7A7A", position: [0, 0.15, 3], targetPosition: [0, 0, 0],
        size: [2, 0.06, 0.06], isDecoy: true, isPlaced: false,
      },
    ],
  },
];

// ─── 3D Mesh Components ─────────────────────────────────────────────

function PartMesh({
  part,
  selected,
  ghost,
  onClick,
}: {
  part: Part3D;
  selected: boolean;
  ghost: boolean;
  onClick: () => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const pos = part.isPlaced ? part.targetPosition : part.position;
  const scale = part.isPlaced ? 1 : 0.7;

  useFrame((_, delta) => {
    if (!meshRef.current) return;

    // Smooth lerp to target position
    meshRef.current.position.x = THREE.MathUtils.lerp(
      meshRef.current.position.x,
      pos[0],
      delta * 5
    );
    meshRef.current.position.y = THREE.MathUtils.lerp(
      meshRef.current.position.y,
      pos[1],
      delta * 5
    );
    meshRef.current.position.z = THREE.MathUtils.lerp(
      meshRef.current.position.z,
      pos[2],
      delta * 5
    );

    // Hover/selected bob
    if (!part.isPlaced && !ghost) {
      meshRef.current.position.y +=
        Math.sin(Date.now() * 0.003 + part.position[0]) * 0.02;
    }

    // Scale animation
    const targetScale = ghost ? 0.95 : selected ? 0.85 : scale;
    meshRef.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      delta * 8
    );
  });

  const color = ghost
    ? new THREE.Color(part.color).clone().multiplyScalar(0.3)
    : new THREE.Color(part.color);

  const opacity = ghost ? 0.2 : selected ? 0.9 : 1;

  return (
    <mesh
      ref={meshRef}
      position={pos}
      onClick={(e) => {
        e.stopPropagation();
        if (!ghost) onClick();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        if (!ghost && !part.isPlaced) {
          setHovered(true);
          document.body.style.cursor = "pointer";
        }
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = "default";
      }}
    >
      {part.meshType === "tabletop" || part.meshType === "shelf" ? (
        <RoundedBox args={part.size} radius={0.02} smoothness={3}>
          <meshStandardMaterial
            color={color}
            transparent={opacity < 1}
            opacity={opacity}
            roughness={0.6}
            metalness={part.meshType === "shelf" ? 0.1 : 0.05}
          />
        </RoundedBox>
      ) : part.meshType === "leg" || part.meshType === "crossbar" ? (
        <cylinderGeometry args={[part.size[0] / 2, part.size[0] / 2, part.size[1], 12]} />
      ) : part.meshType === "backrest" ? (
        <RoundedBox args={part.size} radius={0.03} smoothness={3}>
          <meshStandardMaterial
            color={color}
            transparent={opacity < 1}
            opacity={opacity}
            roughness={0.5}
          />
        </RoundedBox>
      ) : part.meshType === "bracket" ? (
        <boxGeometry args={part.size} />
      ) : (
        <boxGeometry args={part.size} />
      )}

      {/* Non-box materials */}
      {(part.meshType === "leg" || part.meshType === "crossbar") && (
        <meshStandardMaterial
          color={color}
          transparent={opacity < 1}
          opacity={opacity}
          roughness={0.4}
          metalness={0.6}
        />
      )}

      {/* Selection glow */}
      {selected && !ghost && (
        <mesh scale={[1.05, 1.05, 1.05]}>
          {part.meshType === "leg" || part.meshType === "crossbar" ? (
            <cylinderGeometry args={[part.size[0] / 2 + 0.02, part.size[0] / 2 + 0.02, part.size[1] + 0.04, 12]} />
          ) : (
            <boxGeometry args={[part.size[0] + 0.04, part.size[1] + 0.04, part.size[2] + 0.04]} />
          )}
          <meshStandardMaterial
            color="#fbbf24"
            transparent
            opacity={0.3}
            emissive="#fbbf24"
            emissiveIntensity={0.5}
          />
        </mesh>
      )}

      {/* Hover highlight */}
      {hovered && !selected && !ghost && (
        <mesh scale={[1.03, 1.03, 1.03]}>
          {part.meshType === "leg" || part.meshType === "crossbar" ? (
            <cylinderGeometry args={[part.size[0] / 2 + 0.01, part.size[0] / 2 + 0.01, part.size[1] + 0.02, 12]} />
          ) : (
            <boxGeometry args={[part.size[0] + 0.02, part.size[1] + 0.02, part.size[2] + 0.02]} />
          )}
          <meshStandardMaterial
            color="#60a5fa"
            transparent
            opacity={0.2}
            emissive="#60a5fa"
            emissiveIntensity={0.3}
          />
        </mesh>
      )}
    </mesh>
  );
}

function WorkbenchSurface() {
  return (
    <mesh position={[0, -0.01, 0]} receiveShadow>
      <boxGeometry args={[10, 0.02, 10]} />
      <meshStandardMaterial color="#D2B48C" roughness={0.8} />
    </mesh>
  );
}

function Screw3D({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh>
        <cylinderGeometry args={[0.04, 0.04, 0.02, 8]} />
        <meshStandardMaterial color="#aaa" metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.015, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.06, 6]} />
        <meshStandardMaterial color="#999" metalness={0.8} roughness={0.3} />
      </mesh>
    </group>
  );
}

// ─── Scene ───────────────────────────────────────────────────────────

function AssemblyScene({
  furniture,
  selectedId,
  onSelect,
}: {
  furniture: Furniture3D;
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const correctParts = furniture.parts.filter((p) => !p.isDecoy);
  const decoy = furniture.parts.find((p) => p.isDecoy);

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 8, 5]} intensity={1} castShadow />
      <directionalLight position={[-3, 4, -3]} intensity={0.3} />
      <pointLight position={[0, 5, 0]} intensity={0.5} />

      <WorkbenchSurface />

      {/* Ghost parts showing target positions */}
      {correctParts.map((part) => (
        <PartMesh
          key={`ghost-${part.id}`}
          part={{ ...part, isPlaced: true }}
          selected={false}
          ghost={true}
          onClick={() => {}}
        />
      ))}

      {/* Actual parts */}
      {correctParts.map((part) => (
        !part.isPlaced && (
          <PartMesh
            key={part.id}
            part={part}
            selected={selectedId === part.id}
            ghost={false}
            onClick={() => onSelect(part.id)}
          />
        )
      ))}

      {/* Placed parts (solid, at target) */}
      {correctParts.map((part) => (
        part.isPlaced && (
          <PartMesh
            key={`placed-${part.id}`}
            part={part}
            selected={false}
            ghost={false}
            onClick={() => {}}
          />
        )
      ))}

      {/* Decoy */}
      {decoy && !decoy.isPlaced && (
        <PartMesh
          key={decoy.id}
          part={decoy}
          selected={selectedId === decoy.id}
          ghost={false}
          onClick={() => onSelect(decoy.id)}
        />
      )}

      {/* Spare screws */}
      <Screw3D position={[3, 0.02, -3]} />
      <Screw3D position={[3.15, 0.02, -3]} />
      <Screw3D position={[2.9, 0.02, -2.85]} />

      <OrbitControls
        enablePan={false}
        minDistance={3}
        maxDistance={12}
        minPolarAngle={0.2}
        maxPolarAngle={Math.PI / 2 - 0.1}
        target={[0, 1, 0]}
      />
    </>
  );
}

// ─── Main Component ──────────────────────────────────────────────────

export default function Assembly3D({ onSuccess }: { onSuccess?: () => void } = {}) {
  const [furnitureIdx] = useState(() =>
    Math.floor(Math.random() * FURNITURE.length)
  );
  const [furniture, setFurniture] = useState<Furniture3D>(() => ({
    ...FURNITURE[furnitureIdx],
    parts: FURNITURE[furnitureIdx].parts.map((p) => ({ ...p })),
  }));
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const [attempts, setAttempts] = useState(0);

  const correctParts = furniture.parts.filter((p) => !p.isDecoy);
  const placedCount = correctParts.filter((p) => p.isPlaced).length;
  const allPlaced = placedCount === correctParts.length;

  const handleSelect = useCallback(
    (id: string) => {
      if (result) return;
      const part = furniture.parts.find((p) => p.id === id);
      if (!part) return;

      if (selectedId === id) {
        // Deselect
        setSelectedId(null);
        return;
      }

      if (selectedId) {
        // Trying to swap - deselect first
        setSelectedId(id);
        return;
      }

      // If part is already placed, pick it back up
      if (part.isPlaced) {
        setFurniture((prev) => ({
          ...prev,
          parts: prev.parts.map((p) =>
            p.id === id ? { ...p, isPlaced: false } : p
          ),
        }));
        setSelectedId(null);
        return;
      }

      // Select this part
      setSelectedId(id);

      // Auto-place if there's an open target
      const openSlot = correctParts.find(
        (p) => !p.isPlaced && p.id !== id
      );
      if (!openSlot) {
        // All others placed, this is the last one — place it
        setTimeout(() => {
          setFurniture((prev) => ({
            ...prev,
            parts: prev.parts.map((p) =>
              p.id === id ? { ...p, isPlaced: true } : p
            ),
          }));
          setSelectedId(null);
        }, 100);
      }
    },
    [furniture, selectedId, result, correctParts]
  );

  const handlePlaceSelected = useCallback(() => {
    if (!selectedId || result) return;
    setFurniture((prev) => ({
      ...prev,
      parts: prev.parts.map((p) =>
        p.id === selectedId ? { ...p, isPlaced: true } : p
      ),
    }));
    setSelectedId(null);
  }, [selectedId, result]);

  const handleSubmit = useCallback(async () => {
    if (result) return;
    setAttempts((a) => a + 1);

    const decoy = furniture.parts.find((p) => p.isDecoy);
    const usedDecoy = decoy?.isPlaced ?? false;

    if (usedDecoy) {
      setResult({
        success: false,
        message: "You placed the decoy part. Real furniture doesn't have armrests on a desk.",
      });
      return;
    }

    if (!allPlaced) {
      setResult({
        success: false,
        message: "Not all parts are placed. The ghost outlines are there for a reason.",
      });
      return;
    }

    setResult({
      success: true,
      message: "Furniture assembled. Your 3D spatial reasoning is certified human.",
    });
    if (onSuccess) onSuccess();
  }, [furniture, allPlaced, result, onSuccess]);

  const handleReset = useCallback(() => {
    setFurniture({
      ...FURNITURE[furnitureIdx],
      parts: FURNITURE[furnitureIdx].parts.map((p) => ({ ...p })),
    });
    setSelectedId(null);
    setResult(null);
  }, [furnitureIdx]);

  return (
    <div className="w-full max-w-3xl mx-auto select-none">
      {/* Header */}
      <div className="bg-ikea-blue text-white p-4 rounded-t-xl">
        <div className="flex items-center gap-3">
          <div className="bg-ikea-yellow text-ikea-blue font-black text-2xl w-10 h-10 rounded-lg flex items-center justify-center">
            {furniture.icon}
          </div>
          <div>
            <h2 className="font-bold text-lg leading-tight">
              {furniture.name} Assembly
            </h2>
            <p className="text-blue-200 text-xs">
              Proof of Humanity™ — 3D Assembly
            </p>
          </div>
          <div className="ml-auto text-xs text-blue-200 text-right hidden sm:block">
            <div>SERIES: {furniture.series}</div>
            <div className="text-yellow-300 font-bold">DIFFICULTY: HUMAN</div>
          </div>
        </div>
      </div>

      {/* Instruction */}
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
          <span className="font-bold text-[10px]">1.</span> Click a part to select it. The ghost outline shows where it belongs.
        </p>
        <p className="text-xs text-neutral-700 mt-1">
          <span className="font-bold text-[10px]">2.</span> Click &quot;Place Part&quot; to snap it into position. Drag to orbit the view.
        </p>
        <p className="text-xs text-neutral-700 mt-1">
          <span className="font-bold text-[10px]">3.</span> Not all parts belong. Some are decoys.
        </p>
        <div className="mt-2 pt-2 border-t border-neutral-100 text-[9px] text-neutral-400 italic">
          ⚠ Rotate the view to check alignment from all angles.
        </div>
      </div>

      {/* 3D Canvas */}
      <div className="bg-gradient-to-b from-slate-100 to-slate-200 border-x border-neutral-200">
        <div className="h-[400px] sm:h-[450px]">
          <Canvas
            camera={{
              position: furniture.cameraPos,
              fov: 45,
            }}
            shadows
          >
            <Suspense fallback={null}>
              <AssemblyScene
                furniture={furniture}
                selectedId={selectedId}
                onSelect={handleSelect}
              />
            </Suspense>
          </Canvas>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white border-x border-neutral-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="text-[10px] text-neutral-500">
            <span className="font-bold">Parts:</span> {placedCount}/{correctParts.length} placed
            {selectedId && (
              <span className="ml-2 text-ikea-blue font-bold">
                Selected: {furniture.parts.find((p) => p.id === selectedId)?.label || "?"}
              </span>
            )}
          </div>
          <div className="flex gap-2">
            {selectedId && !furniture.parts.find((p) => p.id === selectedId)?.isPlaced && (
              <button
                onClick={handlePlaceSelected}
                className="px-4 py-1.5 bg-ikea-yellow text-ikea-blue rounded-lg font-bold text-xs hover:bg-yellow-300 transition-colors"
              >
                Place Part
              </button>
            )}
            {selectedId && furniture.parts.find((p) => p.id === selectedId)?.isPlaced && (
              <button
                onClick={handlePlaceSelected}
                className="px-4 py-1.5 bg-neutral-200 text-neutral-600 rounded-lg font-bold text-xs hover:bg-neutral-300 transition-colors"
              >
                Remove
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Warning */}
      <div className="bg-white border-x border-neutral-200 px-4 pb-3">
        <div className="flex items-start gap-2 text-[9px] text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
          <span className="text-lg leading-none">⚠</span>
          <div>
            <div className="font-bold">IMPORTANT</div>
            <div>Some pieces will not be used. This is normal. Do not throw away unused parts - they are spares.</div>
          </div>
        </div>
      </div>

      {/* Submit / Result */}
      <div className="bg-neutral-50 border border-neutral-200 rounded-b-xl p-4">
        {result === null ? (
          <div className="flex items-center gap-3">
            <button
              onClick={handleSubmit}
              disabled={!allPlaced}
              className={`
                flex-1 py-3 rounded-lg font-bold text-sm uppercase tracking-wider transition-all
                ${allPlaced
                  ? "bg-ikea-blue text-white hover:bg-blue-800 active:scale-[0.98] shadow-lg"
                  : "bg-neutral-200 text-neutral-400 cursor-not-allowed"
                }
              `}
            >
              {!allPlaced
                ? `×${correctParts.length - placedCount} EMPTY`
                : "CHECK"
              }
            </button>
            <div className="text-xs text-neutral-400 text-center min-w-[50px]">
              <div className="font-bold text-sm">{placedCount}/{correctParts.length}</div>
              <div>placed</div>
            </div>
          </div>
        ) : result.success ? (
          <div className="text-center space-y-3">
            <div className="text-5xl">{furniture.icon}</div>
            <div className="text-lg font-black text-green-700 uppercase tracking-wide">
              Assembly Complete
            </div>
            <p className="text-sm text-green-600">{result.message}</p>
            <div className="bg-green-100 rounded-lg p-3 text-xs text-green-700 flex items-center justify-center gap-4">
              <span><span className="font-bold">Attempts:</span> {attempts}</span>
            </div>
            <button
              onClick={handleReset}
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
              onClick={handleReset}
              className="bg-ikea-blue text-white px-6 py-2 rounded-lg font-bold text-sm hover:bg-blue-800 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}
      </div>

      {/* Fine Print */}
      <div className="mt-3 text-center text-[8px] text-neutral-400 leading-relaxed">
        {furniture.name} / {furniture.series}
        <br />
        © Inter IKEA Systems B.V. 2024
      </div>
    </div>
  );
}
