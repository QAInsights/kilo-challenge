export interface FurnitureItem {
  id: string;
  type: string;
  label: string;
  color: string;
  accentColor?: string;
  width: number;
  height: number;
}

export interface AssemblySlot {
  stepNumber: number;
  description: string;
  targetType: string;
  label: string;
}

export interface Product {
  name: string;
  series: string;
  icon: string;
  correctParts: FurnitureItem[];
  decoyParts: FurnitureItem[];
  steps: { description: string; targetType: string }[];
}

export interface Challenge {
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

const PRODUCTS: Product[] = [
  {
    name: "KLÄTTBÖRD",
    series: "BÖRDSHÄLV",
    icon: "📚",
    correctParts: [
      { id: "side-l", type: "panel-tall", label: "Left Side Panel", color: "#C4956A", width: 50, height: 90 },
      { id: "shelves", type: "panel-wide", label: "Shelf Board (×3)", color: "#B8875A", width: 90, height: 35 },
      { id: "backboard", type: "panel-thin", label: "Back Board", color: "#D4A574", width: 85, height: 85 },
    ],
    decoyParts: [
      { id: "glass-shelf", type: "glass-panel", label: "Glass Shelf Insert", color: "#B8D4E3", accentColor: "#92BDD4", width: 80, height: 30 },
    ],
    steps: [
      { description: "Insert wooden dowels to connect side panels", targetType: "panel-tall" },
      { description: "Secure shelf boards with Phillips screws", targetType: "panel-wide" },
      { description: "Nail the back board for structural support", targetType: "panel-thin" },
    ],
  },
  {
    name: "STÖRTKÖK",
    series: "MATDRÖM",
    icon: "🍳",
    correctParts: [
      { id: "counter", type: "panel-wide", label: "Countertop", color: "#F0E6D3", accentColor: "#E0D4BE", width: 95, height: 30 },
      { id: "cabinet-door", type: "panel-square", label: "Cabinet Door", color: "#E8E0D8", width: 60, height: 70 },
      { id: "handles", type: "bracket", label: "Drawer Handles (×4)", color: "#B0B0B0", accentColor: "#909090", width: 55, height: 25 },
    ],
    decoyParts: [
      { id: "rubber-feet", type: "rubber-foot", label: "Anti-Slip Rubber Feet", color: "#555555", accentColor: "#333333", width: 50, height: 20 },
    ],
    steps: [
      { description: "Align countertop with base unit", targetType: "panel-wide" },
      { description: "Attach cabinet door with hinges", targetType: "panel-square" },
      { description: "Screw in the drawer handles", targetType: "bracket" },
    ],
  },
  {
    name: "BJÖRNKÖTT",
    series: "VILDSMÄLT",
    icon: "⚙️",
    correctParts: [
      { id: "chamber", type: "panel-square", label: "Grinding Chamber", color: "#7A7A7A", accentColor: "#5A5A5A", width: 70, height: 65 },
      { id: "blade-unit", type: "bracket", label: "Blade Assembly", color: "#C8C8C8", accentColor: "#A0A0A0", width: 60, height: 55 },
      { id: "motor-housing", type: "panel-tall", label: "Motor Housing", color: "#4A4A4A", accentColor: "#333333", width: 55, height: 80 },
    ],
    decoyParts: [
      { id: "safety-goggles", type: "glass-panel", label: "Safety Goggles", color: "#FFD700", accentColor: "#DAA520", width: 70, height: 30 },
    ],
    steps: [
      { description: "Insert grinding chamber into base", targetType: "panel-square" },
      { description: "Place blade assembly into chamber", targetType: "bracket" },
      { description: "Attach motor housing and secure", targetType: "panel-tall" },
    ],
  },
  {
    name: "SÖMNSTJÄRNA",
    series: "NATTMÖRKER",
    icon: "⭐",
    correctParts: [
      { id: "wire-ring", type: "panel-wide", label: "Wire Ring Frame", color: "#B8860B", accentColor: "#8B6508", width: 85, height: 25 },
      { id: "web-string", type: "dowel", label: "Weaving String Bundle", color: "#F5F5DC", accentColor: "#E0DCC0", width: 50, height: 15 },
      { id: "feathers", type: "panel-thin", label: "Decorative Feathers", color: "#9370DB", accentColor: "#7B5FBF", width: 35, height: 80 },
    ],
    decoyParts: [
      { id: "led-lights", type: "screw", label: "Fairy LED Lights", color: "#FFD700", accentColor: "#FFA500", width: 45, height: 45 },
    ],
    steps: [
      { description: "Bend wire ring into circle shape", targetType: "panel-wide" },
      { description: "Weave string across the ring", targetType: "dowel" },
      { description: "Tie feathers to hanging strings", targetType: "panel-thin" },
    ],
  },
  {
    name: "FJÄRTKUDDE",
    series: "KOMFORTZON",
    icon: "🛋️",
    correctParts: [
      { id: "foam-core", type: "panel-square", label: "Memory Foam Core", color: "#E8E0F0", accentColor: "#D0C4E0", width: 80, height: 50 },
      { id: "outer-cover", type: "panel-wide", label: "Fabric Outer Cover", color: "#6B8E9B", accentColor: "#567A87", width: 90, height: 55 },
      { id: "zipper", type: "bracket", label: "Zipper Assembly", color: "#A0A0A0", accentColor: "#808080", width: 70, height: 15 },
    ],
    decoyParts: [
      { id: "air-pump", type: "rubber-foot", label: "Inflation Air Pump", color: "#FF6B6B", accentColor: "#E05555", width: 40, height: 55 },
    ],
    steps: [
      { description: "Insert memory foam into cover", targetType: "panel-square" },
      { description: "Wrap the outer fabric cover", targetType: "panel-wide" },
      { description: "Secure the zipper assembly", targetType: "bracket" },
    ],
  },
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function generateChallenge(): Challenge {
  const product = PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)];
  const shuffledCorrect = shuffle([...product.correctParts]);
  const decoy = product.decoyParts[0];

  const leftoverScrews: FurnitureItem[] = [
    { id: "ls-1", type: "screw", label: "M4 Screw", color: "#A0A0A0", accentColor: "#808080", width: 18, height: 18 },
    { id: "ls-2", type: "screw", label: "M4 Screw", color: "#A8A8A8", accentColor: "#888888", width: 18, height: 18 },
    { id: "ls-3", type: "screw", label: "Allen Key", color: "#B8B8B8", accentColor: "#999999", width: 35, height: 12 },
  ];

  const allParts = shuffle([
    ...shuffledCorrect,
    decoy,
    ...leftoverScrews,
  ]);

  const slots: AssemblySlot[] = product.steps.map((step, i) => ({
    stepNumber: i + 1,
    description: step.description,
    targetType: step.targetType,
    label: `Step ${i + 1}`,
  }));

  return {
    id: Math.random().toString(36).slice(2),
    product: {
      name: product.name,
      series: product.series,
      icon: product.icon,
    },
    parts: allParts,
    slots,
    answer: {
      order: product.correctParts.map((p) => p.id),
      decoy: decoy.id,
      leftoverScrews: leftoverScrews.map((s) => s.id),
    },
  };
}
