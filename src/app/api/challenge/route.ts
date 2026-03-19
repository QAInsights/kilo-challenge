import { NextRequest, NextResponse } from "next/server";
import { generateChallenge, type Challenge } from "@/lib/challenge";

const challenges = new Map<string, Challenge>();

export async function GET() {
  const challenge = generateChallenge();
  challenges.set(challenge.id, challenge);

  if (challenges.size > 100) {
    const keys = Array.from(challenges.keys());
    for (let i = 0; i < keys.length - 100; i++) {
      challenges.delete(keys[i]);
    }
  }

  return NextResponse.json({
    id: challenge.id,
    product: challenge.product,
    parts: challenge.parts,
    slots: challenge.slots,
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { challengeId, order } = body as {
    challengeId: string;
    order: string[];
  };

  const challenge = challenges.get(challengeId);

  if (!challenge) {
    return NextResponse.json(
      { success: false, message: "Challenge expired. The parts have been returned to the warehouse." },
      { status: 400 }
    );
  }

  const hasDecoy = order.includes(challenge.answer.decoy);
  const orderCorrect =
    order.length === 3 &&
    order[0] === challenge.answer.order[0] &&
    order[1] === challenge.answer.order[1] &&
    order[2] === challenge.answer.order[2];

  challenges.delete(challengeId);

  if (hasDecoy) {
    const messages = [
      "You used the decoy part. Real humans know which parts don't belong.",
      "That part was a trap. Your furniture now has a glass shelf where it shouldn't.",
      "The decoy was right there on the table. You picked it up anyway.",
      "Nice try, robot. Humans can spot a part that doesn't fit.",
      "The fake part thanks you for your service. The bookshelf does not.",
    ];
    return NextResponse.json({
      success: false,
      message: messages[Math.floor(Math.random() * messages.length)],
    });
  }

  if (!orderCorrect) {
    const messages = [
      "Wrong assembly order. Dowels before screws. Always.",
      "That's not how you build furniture. The Allen key weeps.",
      "The assembly sequence is sacred. You have desecrated it.",
      "Parts in the wrong order. The Scandinavian gods disapprove.",
      "Scrambled assembly detected. This isn't abstract furniture art.",
    ];
    return NextResponse.json({
      success: false,
      message: messages[Math.floor(Math.random() * messages.length)],
    });
  }

  const messages = [
    "Assembly complete. The leftover screws approve of your humanity.",
    "You are clearly human. No robot tolerates this many spare parts.",
    "Humanity confirmed. Your furniture stands. Your dignity remains questionable.",
    "Passed. The workbench gods smile upon you. Briefly.",
    "You did it. Only a real human knows extra screws are normal.",
  ];
  return NextResponse.json({
    success: true,
    message: messages[Math.floor(Math.random() * messages.length)],
  });
}
