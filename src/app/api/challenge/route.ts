import { NextRequest, NextResponse } from "next/server";
import { generateChallenge, type Challenge } from "@/lib/challenge";

const challenges = new Map<string, Challenge>();

export async function GET() {
  const challenge = generateChallenge();
  challenges.set(challenge.id, challenge);

  // Clean up old challenges (keep last 100)
  if (challenges.size > 100) {
    const keys = Array.from(challenges.keys());
    for (let i = 0; i < keys.length - 100; i++) {
      challenges.delete(keys[i]);
    }
  }

  // Send panels without the answer
  return NextResponse.json({
    id: challenge.id,
    product: challenge.product,
    panels: challenge.panels,
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
      { success: false, message: "Challenge expired. Get a new one." },
      { status: 400 }
    );
  }

  // Validate: check order is correct and no irrelevant panel included
  const hasIrrelevant = order.includes(challenge.answer.irrelevant);
  const orderCorrect =
    order.length === 3 &&
    order[0] === challenge.answer.order[0] &&
    order[1] === challenge.answer.order[1] &&
    order[2] === challenge.answer.order[2];

  // Clean up after validation
  challenges.delete(challengeId);

  if (hasIrrelevant) {
    const messages = [
      "You included the irrelevant step. Robots cannot filter irony.",
      "The fake step was right there. You walked right into it.",
      "Nice try, robot. Humans can detect sarcasm. Can you?",
      "That step was a trap and you fell for it. Beautifully.",
      "The irrelevant panel thanks you for your patronage.",
    ];
    return NextResponse.json({
      success: false,
      message: messages[Math.floor(Math.random() * messages.length)],
    });
  }

  if (!orderCorrect) {
    const messages = [
      "Wrong order. Even robots know dowels go before screws.",
      "That's not how you build a thing. Have you ever built a thing?",
      "The assembly order is sacred. You have desecrated it.",
      "Shuffled. Just like your confidence. Try again.",
      "Scandinavian gods disapprove of this ordering.",
    ];
    return NextResponse.json({
      success: false,
      message: messages[Math.floor(Math.random() * messages.length)],
    });
  }

  const messages = [
    "You are clearly human. No robot would tolerate this.",
    "Congratulations. Your bookshelf is assembled. Your dignity is not.",
    "Passed. The furniture gods smile upon you. Briefly.",
    "Human confirmed. Your suffering has been validated.",
    "You did it. The screws are still leftover. This is normal.",
  ];
  return NextResponse.json({
    success: true,
    message: messages[Math.floor(Math.random() * messages.length)],
  });
}
