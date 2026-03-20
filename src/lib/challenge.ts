export interface FurnitureItem {
  id: string;
  type: string;
  color: string;
  accentColor?: string;
  width: number;
  height: number;
}

export interface AssemblySlot {
  stepNumber: number;
  targetType: string;
}

export interface Product {
  name: string;
  series: string;
  icon: string;
  correctParts: FurnitureItem[];
  decoyParts: FurnitureItem[];
  targetTypes: string[];
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

const SCREWS: FurnitureItem[] = [
  { id: "sk-a", type: "donut", color: "#8A8A8A", accentColor: "#666666", width: 18, height: 18 },
  { id: "sk-b", type: "circle", color: "#929292", accentColor: "#707070", width: 18, height: 18 },
  { id: "sk-c", type: "capsule", color: "#A0A0A0", accentColor: "#808080", width: 35, height: 12 },
  { id: "sk-d", type: "round-peg", color: "#9A9A9A", accentColor: "#7A7A7A", width: 16, height: 16 },
];

const PRODUCTS: Product[] = [
  {
    name: "KLÄTTBÖRD",
    series: "BÖRDSHÄLV",
    icon: "📚",
    correctParts: [
      { id: "kb-1", type: "rect", color: "#C4956A", accentColor: "#A07850", width: 50, height: 90 },
      { id: "kb-2", type: "wide-rect", color: "#B8875A", accentColor: "#9A7048", width: 90, height: 35 },
      { id: "kb-3", type: "strip", color: "#D4A574", accentColor: "#B89060", width: 85, height: 15 },
    ],
    decoyParts: [
      { id: "kb-d", type: "wide-rect", color: "#6A7A8A", accentColor: "#556575", width: 80, height: 30 },
    ],
    targetTypes: ["rect", "wide-rect", "strip"],
  },
  {
    name: "STÖRTKÖK",
    series: "MATDRÖM",
    icon: "🍳",
    correctParts: [
      { id: "sk-1", type: "donut", color: "#8A8A8A", accentColor: "#6A6A6A", width: 45, height: 45 },
      { id: "sk-2", type: "circle", color: "#9A9A9A", accentColor: "#7A7A7A", width: 40, height: 40 },
      { id: "sk-3", type: "l-bracket", color: "#7A7A7A", accentColor: "#5A5A5A", width: 50, height: 50 },
    ],
    decoyParts: [
      { id: "sk-dy", type: "circle", color: "#4A4A4A", accentColor: "#333333", width: 35, height: 35 },
    ],
    targetTypes: ["donut", "circle", "l-bracket"],
  },
  {
    name: "BJÖRNKÖTT",
    series: "VILDSMÄLT",
    icon: "⚙️",
    correctParts: [
      { id: "bk-1", type: "l-bracket", color: "#7A7A7A", accentColor: "#5A5A5A", width: 60, height: 65 },
      { id: "bk-2", type: "cross", color: "#B8B8B8", accentColor: "#989898", width: 55, height: 55 },
      { id: "bk-3", type: "hexagon", color: "#4A4A4A", accentColor: "#333333", width: 40, height: 40 },
    ],
    decoyParts: [
      { id: "bk-d", type: "hexagon", color: "#6A6A6A", accentColor: "#505050", width: 35, height: 35 },
    ],
    targetTypes: ["l-bracket", "cross", "hexagon"],
  },
  {
    name: "SÖMNSTJÄRNA",
    series: "NATTMÖRKER",
    icon: "⭐",
    correctParts: [
      { id: "st-1", type: "capsule", color: "#B8860B", accentColor: "#9A7200", width: 85, height: 25 },
      { id: "st-2", type: "arc", color: "#9370DB", accentColor: "#7B5FBF", width: 50, height: 60 },
      { id: "st-3", type: "diamond", color: "#CD853F", accentColor: "#B07030", width: 35, height: 35 },
    ],
    decoyParts: [
      { id: "st-d", type: "capsule", color: "#8B7355", accentColor: "#706040", width: 40, height: 20 },
    ],
    targetTypes: ["capsule", "arc", "diamond"],
  },
  {
    name: "FJÄRTKUDDE",
    series: "KOMFORTZON",
    icon: "🛋️",
    correctParts: [
      { id: "fk-1", type: "oval", color: "#E8E0F0", accentColor: "#D0C4E0", width: 80, height: 50 },
      { id: "fk-2", type: "wide-rect", color: "#6B8E9B", accentColor: "#567A87", width: 90, height: 55 },
      { id: "fk-3", type: "strip", color: "#A0A0A0", accentColor: "#808080", width: 70, height: 15 },
    ],
    decoyParts: [
      { id: "fk-d", type: "oval", color: "#C8B8D8", accentColor: "#B0A0C0", width: 60, height: 35 },
    ],
    targetTypes: ["oval", "wide-rect", "strip"],
  },
  {
    name: "FLÄTKÖK",
    series: "VRISTBÄNK",
    icon: "🍽️",
    correctParts: [
      { id: "fl-1", type: "triangle", color: "#C8B090", accentColor: "#B09878", width: 55, height: 55 },
      { id: "fl-2", type: "rect", color: "#F0E6D3", accentColor: "#E0D4BE", width: 70, height: 85 },
      { id: "fl-3", type: "round-peg", color: "#B89B70", accentColor: "#A08860", width: 25, height: 25 },
    ],
    decoyParts: [
      { id: "fl-d", type: "triangle", color: "#8A8A8A", accentColor: "#6A6A6A", width: 45, height: 45 },
    ],
    targetTypes: ["triangle", "rect", "round-peg"],
  },
  {
    name: "VÄGGKROK",
    series: "HÄNGSLAG",
    icon: "🪝",
    correctParts: [
      { id: "vk-1", type: "claw", color: "#5A5A5A", accentColor: "#3A3A3A", width: 45, height: 70 },
      { id: "vk-2", type: "square-peg", color: "#B8B8B8", accentColor: "#989898", width: 35, height: 35 },
      { id: "vk-3", type: "strip", color: "#7A7A7A", accentColor: "#5A5A5A", width: 90, height: 14 },
    ],
    decoyParts: [
      { id: "vk-d", type: "claw", color: "#8A7A6A", accentColor: "#6A5A4A", width: 40, height: 60 },
    ],
    targetTypes: ["claw", "square-peg", "strip"],
  },
  {
    name: "BOKHYLLA",
    series: "SIDFLÄK",
    icon: "📖",
    correctParts: [
      { id: "bh-1", type: "diamond", color: "#C4956A", accentColor: "#A07850", width: 45, height: 45 },
      { id: "bh-2", type: "rect", color: "#B8875A", accentColor: "#9A7048", width: 40, height: 90 },
      { id: "bh-3", type: "cross", color: "#A08060", accentColor: "#887050", width: 70, height: 70 },
    ],
    decoyParts: [
      { id: "bh-d", type: "diamond", color: "#D4A574", accentColor: "#C09060", width: 30, height: 30 },
    ],
    targetTypes: ["diamond", "rect", "cross"],
  },
  {
    name: "SKRIVBORD",
    series: "ARBETSHÖJD",
    icon: "🖥️",
    correctParts: [
      { id: "sb-1", type: "wide-rect", color: "#D2B48C", accentColor: "#BCA478", width: 95, height: 35 },
      { id: "sb-2", type: "rect", color: "#C4A47C", accentColor: "#A89068", width: 30, height: 80 },
      { id: "sb-3", type: "arc", color: "#8A8A8A", accentColor: "#6A6A6A", width: 35, height: 35 },
    ],
    decoyParts: [
      { id: "sb-d", type: "wide-rect", color: "#B8A480", accentColor: "#A09070", width: 80, height: 25 },
    ],
    targetTypes: ["wide-rect", "rect", "arc"],
  },
  {
    name: "SPEGELRAM",
    series: "REFLEKTERA",
    icon: "🪞",
    correctParts: [
      { id: "sr-1", type: "strip", color: "#B8860B", accentColor: "#9A7200", width: 90, height: 16 },
      { id: "sr-2", type: "l-bracket", color: "#8A8A8A", accentColor: "#6A6A6A", width: 35, height: 35 },
      { id: "sr-3", type: "square-peg", color: "#A08060", accentColor: "#887050", width: 60, height: 60 },
    ],
    decoyParts: [
      { id: "sr-d", type: "strip", color: "#4A4A4A", accentColor: "#333333", width: 25, height: 10 },
    ],
    targetTypes: ["strip", "l-bracket", "square-peg"],
  },
  {
    name: "TRÄDGÅRD",
    series: "GRÖNSKAN",
    icon: "🌱",
    correctParts: [
      { id: "td-1", type: "hexagon", color: "#6B8E5A", accentColor: "#567A48", width: 65, height: 65 },
      { id: "td-2", type: "strip", color: "#8A7A6A", accentColor: "#6A5A4A", width: 60, height: 12 },
      { id: "td-3", type: "circle", color: "#5A5A5A", accentColor: "#3A3A3A", width: 28, height: 28 },
    ],
    decoyParts: [
      { id: "td-d", type: "circle", color: "#4A6A8A", accentColor: "#3A5A7A", width: 30, height: 30 },
    ],
    targetTypes: ["hexagon", "strip", "circle"],
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

  const screws = shuffle([...SCREWS]).slice(0, 2 + Math.floor(Math.random() * 2));

  const allParts = shuffle([
    ...shuffledCorrect,
    decoy,
    ...screws,
  ]);

  const slots: AssemblySlot[] = product.targetTypes.map((type, i) => ({
    stepNumber: i + 1,
    targetType: type,
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
      leftoverScrews: screws.map((s) => s.id),
    },
  };
}
