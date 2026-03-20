import { NextRequest, NextResponse } from "next/server";

const BASE_PRICE = 0.001;

interface PaymentRecord {
  attempts: number;
  lastAttempt: number;
}

const paymentLog = new Map<string, PaymentRecord>();

function getClientKey(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const ip = forwarded?.split(",")[0]?.trim() || realIp || "unknown";
  return ip;
}

function getPrice(attempts: number): number {
  return BASE_PRICE * Math.pow(2, attempts);
}

function formatPrice(price: number): string {
  if (price < 0.01) return `$${price.toFixed(4)}`;
  if (price < 1) return `$${price.toFixed(3)}`;
  if (price < 1000) return `$${price.toFixed(2)}`;
  return `$${price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function getWarningMessage(attempts: number, price: number): string {
  if (attempts === 0) return "Welcome, presumed human. This is basically free.";
  if (attempts === 1) return "You're back? Interesting. Price went up a tiny bit.";
  if (attempts === 2) return "Still trying? We admire your persistence. And your wallet.";
  if (attempts === 3) return "At this point, you could have just bought a real bookshelf.";
  if (attempts <= 5) return "Bot behavior detected. We're not mad, we're impressed.";
  if (attempts <= 8) return "Your determination is either admirable or algorithmic.";
  if (price > 100) return "You've funded our server costs for the year. Thank you.";
  if (price > 10000) return "You are now a majority shareholder in Proof of Humanity™.";
  return "At this price, we'll personally verify your humanity by hand.";
}

// Clean up old entries (keep last 10000)
function cleanup() {
  if (paymentLog.size > 10000) {
    const now = Date.now();
    for (const [key, record] of paymentLog) {
      if (now - record.lastAttempt > 3600000) { // 1 hour expiry
        paymentLog.delete(key);
      }
    }
  }
}

export async function GET(request: NextRequest) {
  const key = getClientKey(request);
  const record = paymentLog.get(key);
  const attempts = record?.attempts ?? 0;
  const price = getPrice(attempts);

  return NextResponse.json({
    price,
    priceFormatted: formatPrice(price),
    attemptNumber: attempts + 1,
    basePrice: BASE_PRICE,
    warning: getWarningMessage(attempts, price),
  });
}

export async function POST(request: NextRequest) {
  cleanup();

  const key = getClientKey(request);
  const record = paymentLog.get(key);
  const attempts = record?.attempts ?? 0;
  const price = getPrice(attempts);

  paymentLog.set(key, {
    attempts: attempts + 1,
    lastAttempt: Date.now(),
  });

  // Simulate processing delay
  await new Promise((r) => setTimeout(r, 800 + Math.random() * 400));

  return NextResponse.json({
    success: true,
    charged: formatPrice(price),
    message: attempts === 0
      ? "Payment received. Your humanity has been monetarily confirmed."
      : `Payment received. That was attempt #${attempts + 1}. Total extracted: ${formatPrice(price)}.`,
  });
}
