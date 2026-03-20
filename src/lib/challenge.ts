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

const SCREWS: FurnitureItem[] = [
  { id: "sk-a", type: "donut", label: "Fastener Ring", color: "#8A8A8A", accentColor: "#666666", width: 18, height: 18 },
  { id: "sk-b", type: "circle", label: "M4 Fastener", color: "#929292", accentColor: "#707070", width: 18, height: 18 },
  { id: "sk-c", type: "capsule", label: "Hex Driver", color: "#A0A0A0", accentColor: "#808080", width: 35, height: 12 },
  { id: "sk-d", type: "round-peg", label: "Locking Pin", color: "#9A9A9A", accentColor: "#7A7A7A", width: 16, height: 16 },
];

const PRODUCTS: Product[] = [
  {
    name: "KLÄTTBÖRD",
    series: "BÖRDSHÄLV",
    icon: "📚",
    correctParts: [
      { id: "kb-1", type: "rect", label: "Side Panel", color: "#C4956A", accentColor: "#A07850", width: 50, height: 90 },
      { id: "kb-2", type: "wide-rect", label: "Shelf Board", color: "#B8875A", accentColor: "#9A7048", width: 90, height: 35 },
      { id: "kb-3", type: "strip", label: "Backing Strip", color: "#D4A574", accentColor: "#B89060", width: 85, height: 15 },
    ],
    decoyParts: [
      { id: "kb-d", type: "wide-rect", label: "Glass Insert", color: "#6A7A8A", accentColor: "#556575", width: 80, height: 30 },
    ],
    steps: [
      { description: "Connect side panels with dowels", targetType: "rect" },
      { description: "Secure shelf boards to frame", targetType: "wide-rect" },
      { description: "Attach backing strip for support", targetType: "strip" },
    ],
  },
  {
    name: "STÖRTKÖK",
    series: "MATDRÖM",
    icon: "🍳",
    correctParts: [
      { id: "sk-1", type: "donut", label: "Hinge Collar", color: "#8A8A8A", accentColor: "#6A6A6A", width: 45, height: 45 },
      { id: "sk-2", type: "circle", label: "Cam Lock", color: "#9A9A9A", accentColor: "#7A7A7A", width: 40, height: 40 },
      { id: "sk-3", type: "l-bracket", label: "Corner Brace", color: "#7A7A7A", accentColor: "#5A5A5A", width: 50, height: 50 },
    ],
    decoyParts: [
      { id: "sk-dy", type: "circle", label: "Rubber Bumper", color: "#4A4A4A", accentColor: "#333333", width: 35, height: 35 },
    ],
    steps: [
      { description: "Attach hinge collars to door frame", targetType: "donut" },
      { description: "Insert cam locks to secure panels", targetType: "circle" },
      { description: "Mount corner braces at joints", targetType: "l-bracket" },
    ],
  },
  {
    name: "BJÖRNKÖTT",
    series: "VILDSMÄLT",
    icon: "⚙️",
    correctParts: [
      { id: "bk-1", type: "l-bracket", label: "Mounting Plate", color: "#7A7A7A", accentColor: "#5A5A5A", width: 60, height: 65 },
      { id: "bk-2", type: "cross", label: "Blade Holder", color: "#B8B8B8", accentColor: "#989898", width: 55, height: 55 },
      { id: "bk-3", type: "hexagon", label: "Locking Nut", color: "#4A4A4A", accentColor: "#333333", width: 40, height: 40 },
    ],
    decoyParts: [
      { id: "bk-d", type: "hexagon", label: "Spacer Washer", color: "#6A6A6A", accentColor: "#505050", width: 35, height: 35 },
    ],
    steps: [
      { description: "Bolt mounting plate to base", targetType: "l-bracket" },
      { description: "Seat blade holder into chamber", targetType: "cross" },
      { description: "Tighten locking nut to secure", targetType: "hexagon" },
    ],
  },
  {
    name: "SÖMNSTJÄRNA",
    series: "NATTMÖRKER",
    icon: "⭐",
    correctParts: [
      { id: "st-1", type: "capsule", label: "Ring Segment", color: "#B8860B", accentColor: "#9A7200", width: 85, height: 25 },
      { id: "st-2", type: "arc", label: "Hanging Loop", color: "#9370DB", accentColor: "#7B5FBF", width: 50, height: 60 },
      { id: "st-3", type: "diamond", label: "Charm Piece", color: "#CD853F", accentColor: "#B07030", width: 35, height: 35 },
    ],
    decoyParts: [
      { id: "st-d", type: "capsule", label: "String Anchor", color: "#8B7355", accentColor: "#706040", width: 40, height: 20 },
    ],
    steps: [
      { description: "Bend ring segment into circle", targetType: "capsule" },
      { description: "Attach hanging loop at top", targetType: "arc" },
      { description: "Thread charm pieces onto strings", targetType: "diamond" },
    ],
  },
  {
    name: "FJÄRTKUDDE",
    series: "KOMFORTZON",
    icon: "🛋️",
    correctParts: [
      { id: "fk-1", type: "oval", label: "Foam Insert", color: "#E8E0F0", accentColor: "#D0C4E0", width: 80, height: 50 },
      { id: "fk-2", type: "wide-rect", label: "Fabric Panel", color: "#6B8E9B", accentColor: "#567A87", width: 90, height: 55 },
      { id: "fk-3", type: "strip", label: "Zipper Track", color: "#A0A0A0", accentColor: "#808080", width: 70, height: 15 },
    ],
    decoyParts: [
      { id: "fk-d", type: "oval", label: "Air Bladder", color: "#C8B8D8", accentColor: "#B0A0C0", width: 60, height: 35 },
    ],
    steps: [
      { description: "Insert foam core into cover", targetType: "oval" },
      { description: "Wrap fabric panel around cushion", targetType: "wide-rect" },
      { description: "Align and close zipper track", targetType: "strip" },
    ],
  },
  {
    name: "FLÄTKÖK",
    series: "VRISTBÄNK",
    icon: "🍽️",
    correctParts: [
      { id: "fl-1", type: "triangle", label: "Support Wedge", color: "#C8B090", accentColor: "#B09878", width: 55, height: 55 },
      { id: "fl-2", type: "rect", label: "Counter Slab", color: "#F0E6D3", accentColor: "#E0D4BE", width: 70, height: 85 },
      { id: "fl-3", type: "round-peg", label: "Dowel Pin", color: "#B89B70", accentColor: "#A08860", width: 25, height: 25 },
    ],
    decoyParts: [
      { id: "fl-d", type: "triangle", label: "Anti-Tip Bracket", color: "#8A8A8A", accentColor: "#6A6A6A", width: 45, height: 45 },
    ],
    steps: [
      { description: "Position support wedges under overhang", targetType: "triangle" },
      { description: "Set counter slab onto base unit", targetType: "rect" },
      { description: "Press dowel pins into alignment holes", targetType: "round-peg" },
    ],
  },
  {
    name: "VÄGGKROK",
    series: "HÄNGSLAG",
    icon: "🪝",
    correctParts: [
      { id: "vk-1", type: "claw", label: "Hook Assembly", color: "#5A5A5A", accentColor: "#3A3A3A", width: 45, height: 70 },
      { id: "vk-2", type: "square-peg", label: "Wall Anchor", color: "#B8B8B8", accentColor: "#989898", width: 35, height: 35 },
      { id: "vk-3", type: "strip", label: "Mounting Rail", color: "#7A7A7A", accentColor: "#5A5A5A", width: 90, height: 14 },
    ],
    decoyParts: [
      { id: "vk-d", type: "claw", label: "Coil Hanger", color: "#8A7A6A", accentColor: "#6A5A4A", width: 40, height: 60 },
    ],
    steps: [
      { description: "Screw hook assembly into rail", targetType: "claw" },
      { description: "Drive wall anchors into studs", targetType: "square-peg" },
      { description: "Level and mount the rail", targetType: "strip" },
    ],
  },
  {
    name: "BOKHYLLA",
    series: "SIDFLÄK",
    icon: "📖",
    correctParts: [
      { id: "bh-1", type: "diamond", label: "Decorative Insert", color: "#C4956A", accentColor: "#A07850", width: 45, height: 45 },
      { id: "bh-2", type: "rect", label: "Upright Stile", color: "#B8875A", accentColor: "#9A7048", width: 40, height: 90 },
      { id: "bh-3", type: "cross", label: "X-Brace", color: "#A08060", accentColor: "#887050", width: 70, height: 70 },
    ],
    decoyParts: [
      { id: "bh-d", type: "diamond", label: "Felt Pad", color: "#D4A574", accentColor: "#C09060", width: 30, height: 30 },
    ],
    steps: [
      { description: "Press decorative inserts into shelf fronts", targetType: "diamond" },
      { description: "Stand upright stiles and connect shelves", targetType: "rect" },
      { description: "Brace rear with X-brace assembly", targetType: "cross" },
    ],
  },
  {
    name: "SKRIVBORD",
    series: "ARBETSHÖJD",
    icon: "🖥️",
    correctParts: [
      { id: "sb-1", type: "wide-rect", label: "Desktop Surface", color: "#D2B48C", accentColor: "#BCA478", width: 95, height: 35 },
      { id: "sb-2", type: "rect", label: "Leg Panel", color: "#C4A47C", accentColor: "#A89068", width: 30, height: 80 },
      { id: "sb-3", type: "arc", label: "Cable Grommet", color: "#8A8A8A", accentColor: "#6A6A6A", width: 35, height: 35 },
    ],
    decoyParts: [
      { id: "sb-d", type: "wide-rect", label: "Keyboard Tray", color: "#B8A480", accentColor: "#A09070", width: 80, height: 25 },
    ],
    steps: [
      { description: "Place desktop surface on legs", targetType: "wide-rect" },
      { description: "Attach leg panels to underside", targetType: "rect" },
      { description: "Insert cable grommet into desk hole", targetType: "arc" },
    ],
  },
  {
    name: "SPEGELRAM",
    series: "REFLEKTERA",
    icon: "🪞",
    correctParts: [
      { id: "sr-1", type: "strip", label: "Frame Slat", color: "#B8860B", accentColor: "#9A7200", width: 90, height: 16 },
      { id: "sr-2", type: "l-bracket", label: "Corner Joint", color: "#8A8A8A", accentColor: "#6A6A6A", width: 35, height: 35 },
      { id: "sr-3", type: "square-peg", label: "Backing Board", color: "#A08060", accentColor: "#887050", width: 60, height: 60 },
    ],
    decoyParts: [
      { id: "sr-d", type: "strip", label: "Rubber Bumper", color: "#4A4A4A", accentColor: "#333333", width: 25, height: 10 },
    ],
    steps: [
      { description: "Join frame slats at edges", targetType: "strip" },
      { description: "Secure corners with L-joints", targetType: "l-bracket" },
      { description: "Mount backing board behind mirror", targetType: "square-peg" },
    ],
  },
  {
    name: "TRÄDGÅRD",
    series: "GRÖNSKAN",
    icon: "🌱",
    correctParts: [
      { id: "td-1", type: "hexagon", label: "Planter Base", color: "#6B8E5A", accentColor: "#567A48", width: 65, height: 65 },
      { id: "td-2", type: "strip", label: "Drainage Slat", color: "#8A7A6A", accentColor: "#6A5A4A", width: 60, height: 12 },
      { id: "td-3", type: "circle", label: "Plug Gasket", color: "#5A5A5A", accentColor: "#3A3A3A", width: 28, height: 28 },
    ],
    decoyParts: [
      { id: "td-d", type: "circle", label: "Water Level Float", color: "#4A6A8A", accentColor: "#3A5A7A", width: 30, height: 30 },
    ],
    steps: [
      { description: "Assemble hexagonal planter base", targetType: "hexagon" },
      { description: "Lay drainage slats across bottom", targetType: "strip" },
      { description: "Seal drain hole with plug gasket", targetType: "circle" },
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

  const screws = shuffle([...SCREWS]).slice(0, 2 + Math.floor(Math.random() * 2));

  const allParts = shuffle([
    ...shuffledCorrect,
    decoy,
    ...screws,
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
      leftoverScrews: screws.map((s) => s.id),
    },
  };
}
