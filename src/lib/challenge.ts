export interface Step {
  id: string;
  text: string;
  icon: string;
}

export interface Product {
  name: string;
  series: string;
  icon: string;
  realSteps: Step[];
  irrelevantSteps: Step[];
}

export interface Challenge {
  id: string;
  product: {
    name: string;
    series: string;
    icon: string;
  };
  panels: {
    id: string;
    stepLabel: string;
    text: string;
    icon: string;
  }[];
  answer: {
    order: string[]; // correct 3 panel IDs in order
    irrelevant: string; // the panel ID to exclude
  };
}

const PRODUCTS: Product[] = [
  {
    name: "KLÄTTBÖRD",
    series: "BÖRDSHÄLV",
    icon: "🪵",
    realSteps: [
      { id: "dowel", text: "Hammer wooden dowels into pre-drilled holes. If dowels don't fit, push harder. Wood was meant to suffer.", icon: "🔨" },
      { id: "side", text: "Attach side panels using the included Allen key (hex 4mm). Tighten until you hear a satisfying crunch.", icon: "🔧" },
      { id: "shelf", text: "Secure each shelf board with 6 screws. Do not overtighten. Overtightening voids the emotional warranty.", icon: "🪛" },
      { id: "back", text: "Nail the thin backing board. Hit your thumb at least once. This is tradition.", icon: "📌" },
      { id: "stand", text: "Stand the bookshelf upright. Marvel at your temporary competence.", icon: "📦" },
    ],
    irrelevantSteps: [
      { id: "life", text: "Question why you didn't just buy a finished shelf. Contemplate the void.", icon: "😐" },
      { id: "mom", text: "Call your mother. Tell her you love her. She worries about you.", icon: "📞" },
      { id: "cry", text: "Cry softly into the Allen key. Let the hex shape imprint on your cheek. This is healing.", icon: "😢" },
      { id: "name", text: "Name each screw individually. Write them on the warranty card. Gerald, Brenda, Little Timmy.", icon: "📝" },
      { id: "mortgage", text: "Sign the mortgage paperwork for this $47 bookshelf. Interest rate: 340%.", icon: "✍️" },
    ],
  },
  {
    name: "STÖRTKÖK",
    series: "MATDRÖM",
    icon: "🍳",
    realSteps: [
      { id: "counter", text: "Align countertop with base cabinet. The gap is intentional. We call it 'character'.", icon: "📏" },
      { id: "hinge", text: "Attach cabinet door hinges. Left door opens, right door sticks. This is balance.", icon: "🔩" },
      { id: "sink", text: "Drop in the sink basin. Apply sealant generously. Too much is never enough.", icon: "🚰" },
      { id: "handles", text: "Screw in drawer handles. All 14 of them. Yes, a 2-drawer cabinet needs 14 handles.", icon: "🚪" },
      { id: "level", text: "Use a level to check alignment. Ignore the result. Lean it slightly left for 'rustic charm'.", icon: "📐" },
    ],
    irrelevantSteps: [
      { id: "taste", text: "Taste the wood glue. Rate it on a scale of 'regret' to 'profound regret'.", icon: "👅" },
      { id: "rage", text: "Scream into the empty cabinet for 30 seconds. This is the 'acoustic calibration' step.", icon: "😤" },
      { id: "exist", text: "Accept that you will never own a real kitchen. This particle board is your destiny.", icon: "🏡" },
      { id: "snack", text: "Eat a single meatball in solemn tribute to the Swedish gods of flat-pack furniture.", icon: "🧆" },
      { id: "cat", text: "Feed the cat. You don't have a cat. Adopt one. Name it 'Allen'.", icon: "🐱" },
    ],
  },
  {
    name: "BJÖRNKÖTT",
    series: "VILDSMÄLT",
    icon: "🐻",
    realSteps: [
      { id: "chamber", text: "Insert grinding chamber into base unit. Twist firmly. Grunting is acceptable.", icon: "⚙️" },
      { id: "blade", text: "Place the blade assembly into the chamber. Do not touch the blade. We warned you.", icon: "🗡️" },
      { id: "lid", text: "Lock the lid with the safety clip. If it doesn't lock, you assembled the lid upside down. Again.", icon: "🔒" },
      { id: "motor", text: "Connect motor housing. Plug into outlet. Pray to Scandinavian thunder gods.", icon: "⚡" },
      { id: "test", text: "Run a test grind with a single meatball. If it explodes, consult the warranty void sticker.", icon: "🧪" },
    ],
    irrelevantSteps: [
      { id: "sacrifice", text: "Perform a blood sacrifice to the furniture gods. Paper cut counts.", icon: "🩸" },
      { id: "viking", text: "Sing the IKEA national anthem. Lyrics are in the QR code you can't scan.", icon: "🎵" },
      { id: "therapy", text: "Schedule a therapy appointment. Describe the bear. They'll understand.", icon: "🛋️" },
      { id: "bath", text: "Take a 45-minute bathroom break. You've earned it. Everyone has.", icon: "🚿" },
      { id: "void", text: "Stare into the void. The void stares back. It also has an Allen key.", icon: "👁️" },
    ],
  },
  {
    name: "SÖMNSTJÄRNA",
    series: "NATTMÖRKER",
    icon: "⭐",
    realSteps: [
      { id: "ring", text: "Bend the wire ring into a circle. If it doesn't bend, you're holding the wrong part.", icon: "⭕" },
      { id: "web", text: "Weave the string across the ring in a spiral pattern. Perfection is not required. Mediocrity is.", icon: "🕸️" },
      { id: "feather", text: "Tie feathers to the hanging strings. Each feather represents a dream you'll never have.", icon: "🪶" },
      { id: "bead", text: "Thread beads onto the strings. The instructions say 23. Count them twice. Still wrong.", icon: "📿" },
      { id: "hang", text: "Hang above bed. Adjust height until it bonks you in the face at 3 AM. Perfect.", icon: "🌙" },
    ],
    irrelevantSteps: [
      { id: "dream", text: "Dream about assembling this. Wake up confused. Realize you're still assembling it.", icon: "💭" },
      { id: "regret", text: "Write a letter of regret to your past self who chose 'craft project' over 'nap'.", icon: "✉️" },
      { id: "potion", text: "Brew a calming tea. Drink it. Realize the string was not tea. Panic.", icon: "🍵" },
      { id: "dance", text: "Perform a ritual dance to summon the instruction manual's missing page 4.", icon: "💃" },
      { id: "accept", text: "Accept that this will hang in your room forever, slightly crooked, judging you.", icon: "🙏" },
    ],
  },
  {
    name: "FJÄRTKUDDE",
    series: "KOMFORTZON",
    icon: "💨",
    realSteps: [
      { id: "foam", text: "Compress the memory foam. It remembers your failures. Insert into cover anyway.", icon: "🧽" },
      { id: "zip", text: "Zip the outer cover. If the zipper jams, it's testing your patience. Pass the test.", icon: "🤐" },
      { id: "fluff", text: "Fluff the pillow aggressively. Channel your rage. This is acceptable stress relief.", icon: "💨" },
      { id: "valve", text: "Open the air valve. Let it expand for 48 hours. Yes, 48. Go touch grass.", icon: "🎈" },
      { id: "test2", text: "Sit on the cushion. Bounce twice. If it makes a noise, that's a feature, not a bug.", icon: "🪑" },
    ],
    irrelevantSteps: [
      { id: "blame", text: "Blame the cushion for your back problems. The cushion accepts no responsibility.", icon: "👉" },
      { id: "confess", text: "Confess your sins to the pillow. It has seen worse. Trust us.", icon: "🛐" },
      { id: "hug", text: "Hug the pillow for no less than 60 seconds. Whisper 'I'm sorry'. Don't explain.", icon: "🤗" },
      { id: "google", text: "Google 'why am I like this'. Close all tabs. Open them again at 2 AM.", icon: "🔍" },
      { id: "warranty", text: "Complete the emotional damage waiver. Check 'yes' under 'I have feelings'.", icon: "📋" },
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
  const shuffledReal = shuffle(product.realSteps);
  const shuffledIrrelevant = shuffle(product.irrelevantSteps);

  // Pick 3 real steps + 1 irrelevant
  const chosenReal = shuffledReal.slice(0, 3);
  const chosenIrrelevant = shuffledIrrelevant[0];

  // Label them with fake step numbers
  const panels = shuffle([
    ...chosenReal.map((s, i) => ({
      id: s.id,
      stepLabel: `STEG ${i + 1}`,
      text: s.text,
      icon: s.icon,
    })),
    {
      id: chosenIrrelevant.id,
      stepLabel: `STEG ${Math.floor(Math.random() * 3) + 3}`,
      text: chosenIrrelevant.text,
      icon: chosenIrrelevant.icon,
    },
  ]);

  // Correct order: index of chosenReal in the original realSteps array
  const realIndices = chosenReal.map((s) => product.realSteps.indexOf(s));
  const sortedReal = chosenReal
    .map((s, i) => ({ step: s, originalIndex: realIndices[i] }))
    .sort((a, b) => a.originalIndex - b.originalIndex);

  return {
    id: Math.random().toString(36).slice(2),
    product: {
      name: product.name,
      series: product.series,
      icon: product.icon,
    },
    panels,
    answer: {
      order: sortedReal.map((s) => s.step.id),
      irrelevant: chosenIrrelevant.id,
    },
  };
}
