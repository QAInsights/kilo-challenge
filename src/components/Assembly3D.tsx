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

function randPos(radius: number, y: number): [number, number, number] {
  const angle = Math.random() * Math.PI * 2;
  const r = 2 + Math.random() * radius;
  return [Math.cos(angle) * r, y, Math.sin(angle) * r];
}

interface FurnitureTemplate {
  name: string;
  series: string;
  icon: string;
  cameraPos: [number, number, number];
  correctParts: Omit<Part3D, "position" | "isPlaced">[];
  decoyParts: Omit<Part3D, "position" | "isPlaced">[];
}

const TEMPLATES: FurnitureTemplate[] = [
  {
    name: "SKRIVBORD",
    series: "ARBETSGLÄDJE",
    icon: "🖥️",
    cameraPos: [6, 5, 6],
    correctParts: [
      { id: "dt", label: "Desktop", meshType: "tabletop", color: "#C4956A", targetPosition: [0, 1.5, 0], size: [3, 0.12, 1.5], isDecoy: false },
      { id: "dl1", label: "Leg", meshType: "leg", color: "#888", targetPosition: [-1.3, 0.7, -0.6], size: [0.1, 1.4, 0.1], isDecoy: false },
      { id: "dl2", label: "Leg", meshType: "leg", color: "#888", targetPosition: [1.3, 0.7, -0.6], size: [0.1, 1.4, 0.1], isDecoy: false },
      { id: "dl3", label: "Leg", meshType: "leg", color: "#999", targetPosition: [-1.3, 0.7, 0.6], size: [0.1, 1.4, 0.1], isDecoy: false },
      { id: "dl4", label: "Leg", meshType: "leg", color: "#999", targetPosition: [1.3, 0.7, 0.6], size: [0.1, 1.4, 0.1], isDecoy: false },
    ],
    decoyParts: [
      { id: "dd1", label: "Keyboard Tray", meshType: "crossbar", color: "#A08060", targetPosition: [0, 0, 0], size: [1.2, 0.08, 0.5], isDecoy: true },
      { id: "dd2", label: "Cable Grommet", meshType: "crossbar", color: "#7A7A7A", targetPosition: [0, 0, 0], size: [0.3, 0.06, 0.3], isDecoy: true },
    ],
  },
  {
    name: "BOKHYLLA",
    series: "SIDFLÄK",
    icon: "📖",
    cameraPos: [5, 4, 5],
    correctParts: [
      { id: "sl", label: "Left Panel", meshType: "shelf", color: "#B8875A", targetPosition: [-1.2, 1, 0], size: [0.08, 2.5, 0.8], isDecoy: false },
      { id: "sr", label: "Right Panel", meshType: "shelf", color: "#B8875A", targetPosition: [1.2, 1, 0], size: [0.08, 2.5, 0.8], isDecoy: false },
      { id: "sb1", label: "Shelf Board", meshType: "tabletop", color: "#C4956A", targetPosition: [0, 0.5, 0], size: [2.3, 0.06, 0.75], isDecoy: false },
      { id: "sb2", label: "Shelf Board", meshType: "tabletop", color: "#C4956A", targetPosition: [0, 1.2, 0], size: [2.3, 0.06, 0.75], isDecoy: false },
      { id: "sb3", label: "Shelf Board", meshType: "tabletop", color: "#C4956A", targetPosition: [0, 1.9, 0], size: [2.3, 0.06, 0.75], isDecoy: false },
    ],
    decoyParts: [
      { id: "sd1", label: "Glass Insert", meshType: "tabletop", color: "#B8D4E3", targetPosition: [0, 0, 0], size: [2, 0.03, 0.7], isDecoy: true },
      { id: "sd2", label: "Anti-Tip Strap", meshType: "crossbar", color: "#555", targetPosition: [0, 0, 0], size: [0.5, 0.04, 0.08], isDecoy: true },
    ],
  },
  {
    name: "STOL",
    series: "SITTKOMFORT",
    icon: "🪑",
    cameraPos: [4, 3.5, 4],
    correctParts: [
      { id: "cs", label: "Seat", meshType: "tabletop", color: "#C4956A", targetPosition: [0, 1, 0], size: [1.2, 0.08, 1.2], isDecoy: false },
      { id: "cb", label: "Backrest", meshType: "backrest", color: "#B8875A", targetPosition: [0, 1.8, -0.55], size: [1.1, 1.2, 0.08], isDecoy: false },
      { id: "cl1", label: "Leg", meshType: "leg", color: "#888", targetPosition: [-0.5, 0.45, 0.5], size: [0.07, 0.95, 0.07], isDecoy: false },
      { id: "cl2", label: "Leg", meshType: "leg", color: "#888", targetPosition: [0.5, 0.45, 0.5], size: [0.07, 0.95, 0.07], isDecoy: false },
      { id: "cl3", label: "Leg", meshType: "leg", color: "#999", targetPosition: [-0.5, 0.45, -0.5], size: [0.07, 0.95, 0.07], isDecoy: false },
      { id: "cl4", label: "Leg", meshType: "leg", color: "#999", targetPosition: [0.5, 0.45, -0.5], size: [0.07, 0.95, 0.07], isDecoy: false },
    ],
    decoyParts: [
      { id: "cd1", label: "Armrest", meshType: "bracket", color: "#A08060", targetPosition: [0, 0, 0], size: [0.1, 0.5, 0.8], isDecoy: true },
      { id: "cd2", label: "Cushion Pad", meshType: "tabletop", color: "#D4A574", targetPosition: [0, 0, 0], size: [1, 0.12, 1], isDecoy: true },
    ],
  },
  {
    name: "BORD",
    series: "MATDAG",
    icon: "🍽️",
    cameraPos: [5, 4, 5],
    correctParts: [
      { id: "tt", label: "Tabletop", meshType: "tabletop", color: "#D2B48C", targetPosition: [0, 1.6, 0], size: [2.5, 0.1, 1.5], isDecoy: false },
      { id: "tl1", label: "Leg", meshType: "leg", color: "#888", targetPosition: [-1.1, 0.75, -0.6], size: [0.1, 1.5, 0.1], isDecoy: false },
      { id: "tl2", label: "Leg", meshType: "leg", color: "#888", targetPosition: [1.1, 0.75, -0.6], size: [0.1, 1.5, 0.1], isDecoy: false },
      { id: "tl3", label: "Leg", meshType: "leg", color: "#999", targetPosition: [-1.1, 0.75, 0.6], size: [0.1, 1.5, 0.1], isDecoy: false },
      { id: "tl4", label: "Leg", meshType: "leg", color: "#999", targetPosition: [1.1, 0.75, 0.6], size: [0.1, 1.5, 0.1], isDecoy: false },
    ],
    decoyParts: [
      { id: "td1", label: "Cross Brace", meshType: "crossbar", color: "#7A7A7A", targetPosition: [0, 0, 0], size: [2, 0.06, 0.06], isDecoy: true },
      { id: "td2", label: "Leaves Insert", meshType: "tabletop", color: "#BFA070", targetPosition: [0, 0, 0], size: [0.8, 0.08, 1.4], isDecoy: true },
    ],
  },
  {
    name: "NATTBORD",
    series: "SÖMNLAND",
    icon: "🛏️",
    cameraPos: [4, 3, 4],
    correctParts: [
      { id: "nt", label: "Top", meshType: "tabletop", color: "#C4956A", targetPosition: [0, 1.2, 0], size: [1, 0.06, 0.8], isDecoy: false },
      { id: "nl1", label: "Leg", meshType: "leg", color: "#888", targetPosition: [-0.4, 0.55, -0.3], size: [0.06, 1.1, 0.06], isDecoy: false },
      { id: "nl2", label: "Leg", meshType: "leg", color: "#888", targetPosition: [0.4, 0.55, -0.3], size: [0.06, 1.1, 0.06], isDecoy: false },
      { id: "nl3", label: "Leg", meshType: "leg", color: "#999", targetPosition: [-0.4, 0.55, 0.3], size: [0.06, 1.1, 0.06], isDecoy: false },
      { id: "nl4", label: "Leg", meshType: "leg", color: "#999", targetPosition: [0.4, 0.55, 0.3], size: [0.06, 1.1, 0.06], isDecoy: false },
    ],
    decoyParts: [
      { id: "nd1", label: "Drawer Front", meshType: "tabletop", color: "#A07850", targetPosition: [0, 0, 0], size: [0.9, 0.3, 0.04], isDecoy: true },
      { id: "nd2", label: "Handle", meshType: "crossbar", color: "#aaa", targetPosition: [0, 0, 0], size: [0.2, 0.03, 0.04], isDecoy: true },
    ],
  },
  {
    name: "TVBÄNK",
    series: "SKÄRMFOT",
    icon: "📺",
    cameraPos: [6, 4, 5],
    correctParts: [
      { id: "tvb", label: "Top Panel", meshType: "tabletop", color: "#2A2A2A", targetPosition: [0, 1.1, 0], size: [3.5, 0.08, 0.9], isDecoy: false },
      { id: "tvs1", label: "Side Panel", meshType: "shelf", color: "#2A2A2A", targetPosition: [-1.65, 0.55, 0], size: [0.06, 1.1, 0.85], isDecoy: false },
      { id: "tvs2", label: "Side Panel", meshType: "shelf", color: "#2A2A2A", targetPosition: [1.65, 0.55, 0], size: [0.06, 1.1, 0.85], isDecoy: false },
      { id: "tvm", label: "Middle Shelf", meshType: "tabletop", color: "#333", targetPosition: [0, 0.5, 0], size: [3.18, 0.05, 0.82], isDecoy: false },
    ],
    decoyParts: [
      { id: "tvd1", label: "Back Panel", meshType: "shelf", color: "#1A1A1A", targetPosition: [0, 0, 0], size: [3.4, 1, 0.02], isDecoy: true },
      { id: "tvd2", label: "Cable Clip", meshType: "crossbar", color: "#555", targetPosition: [0, 0, 0], size: [0.1, 0.08, 0.05], isDecoy: true },
    ],
  },
  {
    name: "SPEGEL",
    series: "REFLEKTION",
    icon: "🪞",
    cameraPos: [4, 3, 5],
    correctParts: [
      { id: "spf1", label: "Frame Top", meshType: "crossbar", color: "#B8860B", targetPosition: [0, 2.2, 0], size: [1.5, 0.08, 0.08], isDecoy: false },
      { id: "spf2", label: "Frame Bottom", meshType: "crossbar", color: "#B8860B", targetPosition: [0, 0.8, 0], size: [1.5, 0.08, 0.08], isDecoy: false },
      { id: "spf3", label: "Frame Left", meshType: "crossbar", color: "#B8860B", targetPosition: [-0.71, 1.5, 0], size: [0.08, 1.48, 0.08], isDecoy: false },
      { id: "spf4", label: "Frame Right", meshType: "crossbar", color: "#B8860B", targetPosition: [0.71, 1.5, 0], size: [0.08, 1.48, 0.08], isDecoy: false },
      { id: "spb", label: "Backing Board", meshType: "shelf", color: "#8A7A6A", targetPosition: [0, 1.5, -0.05], size: [1.3, 1.3, 0.03], isDecoy: false },
    ],
    decoyParts: [
      { id: "spd1", label: "Wall Bracket", meshType: "bracket", color: "#777", targetPosition: [0, 0, 0], size: [0.15, 0.15, 0.1], isDecoy: true },
      { id: "spd2", label: "Level Bubble", meshType: "crossbar", color: "#aaa", targetPosition: [0, 0, 0], size: [0.2, 0.05, 0.05], isDecoy: true },
    ],
  },
];

function buildFurniture(template: FurnitureTemplate): Furniture3D {
  const correctParts: Part3D[] = template.correctParts.map((p) => ({
    ...p,
    position: randPos(2, p.size[1] / 2 + 0.1),
    isPlaced: false,
  }));

  const decoyParts: Part3D[] = template.decoyParts.map((p) => ({
    ...p,
    position: randPos(2, p.size[1] / 2 + 0.1),
    isPlaced: false,
  }));

  return {
    name: template.name,
    series: template.series,
    icon: template.icon,
    cameraPos: template.cameraPos,
    parts: [...correctParts, ...decoyParts],
  };
}

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
    Math.floor(Math.random() * TEMPLATES.length)
  );
  const [furniture, setFurniture] = useState<Furniture3D>(() =>
    buildFurniture(TEMPLATES[furnitureIdx])
  );
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
    // Pick a new random template each time
    const newIdx = Math.floor(Math.random() * TEMPLATES.length);
    setFurniture(buildFurniture(TEMPLATES[newIdx]));
    setSelectedId(null);
    setResult(null);
  }, []);

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

      {/* IKEA Assembly Manual */}
      <div className="bg-white border-x border-neutral-200 p-4">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-2 mb-2">
          <div className="flex gap-3 text-[9px] text-neutral-400">
            <div className="flex items-center gap-1">
              <span className="w-5 h-5 rounded-full bg-neutral-100 border border-neutral-300 text-neutral-600 flex items-center justify-center font-bold text-[8px]">A</span>
              <span>Prepare</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-5 h-5 rounded-full bg-ikea-blue text-white flex items-center justify-center font-bold text-[8px]">B</span>
              <span className="font-bold">Assemble</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-5 h-5 rounded-full bg-neutral-100 border border-neutral-300 text-neutral-600 flex items-center justify-center font-bold text-[8px]">C</span>
              <span>Secure</span>
            </div>
          </div>
          <span className="text-[8px] text-neutral-300">×2 recommended</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-[10px] text-neutral-700 leading-relaxed">
              <span className="font-bold">1.</span> Identify each part on the workbench. Compare with ghost outline.
            </p>
            <p className="text-[10px] text-neutral-700 leading-relaxed mt-1">
              <span className="font-bold">2.</span> Click to select. The part will glow when active.
            </p>
          </div>
          <div>
            <p className="text-[10px] text-neutral-700 leading-relaxed">
              <span className="font-bold">3.</span> Click &quot;Place Part&quot; to insert. Push until you hear a click.
            </p>
            <p className="text-[10px] text-neutral-700 leading-relaxed mt-1">
              <span className="font-bold">4.</span> Not all parts are required. Some are spares or decoys.
            </p>
          </div>
        </div>

        <div className="mt-2 pt-2 border-t border-neutral-100 grid grid-cols-2 gap-2 text-[8px] text-neutral-400">
          <div className="flex items-start gap-1">
            <span>⚠</span>
            <span>Do not force parts into position. If it doesn&apos;t fit, rotate the view.</span>
          </div>
          <div className="flex items-start gap-1">
            <span>⚠</span>
            <span>Two persons recommended for large panels. Use included tool only.</span>
          </div>
        </div>

        <div className="mt-1 text-[7px] text-neutral-300 italic text-center">
          Part numbers: check carton. Allen key: included. Leftover parts: normal.
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
