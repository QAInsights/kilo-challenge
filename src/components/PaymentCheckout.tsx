"use client";

import { useState, useEffect, useCallback } from "react";

interface PricingData {
  price: number;
  priceFormatted: string;
  attemptNumber: number;
  basePrice: number;
  warning: string;
}

export default function PaymentCheckout({ onSuccess }: { onSuccess?: () => void } = {}) {
  const [pricing, setPricing] = useState<PricingData | null>(null);
  const [cardNumber, setCardNumber] = useState("4242 4242 4242 4242");
  const [expiry, setExpiry] = useState("12/99");
  const [cvc, setCvc] = useState("***");
  const [name, setName] = useState("DEFINITELY HUMAN");
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const [receiptId] = useState(() =>
    Math.random().toString(36).slice(2, 8).toUpperCase()
  );

  useEffect(() => {
    fetch("/api/payment")
      .then((r) => r.json())
      .then(setPricing)
      .catch(() =>
        setPricing({
          price: 0.001,
          priceFormatted: "$0.0010",
          attemptNumber: 1,
          basePrice: 0.001,
          warning: "Something went wrong. You get the cheap price by default.",
        })
      );
  }, []);

  const handlePay = useCallback(async () => {
    if (processing || success) return;
    setProcessing(true);

    try {
      const res = await fetch("/api/payment", { method: "POST" });
      const data = await res.json();
      setSuccess(true);
      setMessage(data.message);
      if (onSuccess) onSuccess();
    } catch {
      setMessage("Payment processing failed. Even our fake payment system broke.");
      setProcessing(false);
    }
  }, [processing, success, onSuccess]);

  if (!pricing) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4">
        <div className="w-10 h-10 border-4 border-ikea-blue border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-neutral-500">Calculating your humanity tax...</p>
      </div>
    );
  }

  if (success) {
    return (
      <div className="text-center py-8 space-y-4">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl font-black text-green-700">Payment Confirmed</h2>
        <p className="text-sm text-neutral-600">{message}</p>
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-xs text-green-700">
          Receipt #HUM-{receiptId}
          <br />
          Charge: {pricing.priceFormatted}
          <br />
          <span className="italic">This receipt is not deductible. We checked.</span>
        </div>
        <p className="text-[10px] text-neutral-400">Redirecting to your dashboard...</p>
      </div>
    );
  }

  const isExpensive = pricing.price > 0.01;
  const isAbsurd = pricing.price > 1;

  return (
    <div className="space-y-4">
      {/* Price banner */}
      <div className={`border rounded-xl p-4 text-center ${
        isAbsurd
          ? "bg-red-50 border-red-300"
          : isExpensive
            ? "bg-amber-50 border-amber-300"
            : "bg-ikea-blue/5 border-ikea-blue/20"
      }`}>
        <div className="text-[10px] uppercase tracking-widest text-neutral-500 mb-1">
          Human Verification Fee
        </div>
        <div className={`text-3xl font-black ${
          isAbsurd ? "text-red-600" : isExpensive ? "text-amber-600" : "text-neutral-800"
        }`}>
          {pricing.priceFormatted}
        </div>
        <p className={`text-xs mt-1 ${
          isAbsurd ? "text-red-500 font-bold" : "text-neutral-400 italic"
        }`}>
          {pricing.warning}
        </p>
        {pricing.attemptNumber > 1 && (
          <div className="mt-2 text-[10px] text-neutral-400">
            Attempt #{pricing.attemptNumber} from this IP
            <br />
            <span className="text-neutral-300">
              Base: ${pricing.basePrice.toFixed(4)} × 2^{pricing.attemptNumber - 1}
            </span>
          </div>
        )}
      </div>

      {/* Card form */}
      <div className="space-y-3">
        <div>
          <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1">
            Card Number
          </label>
          <input
            type="text"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg text-sm font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-ikea-blue focus:border-transparent"
            maxLength={19}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1">
              Expiry
            </label>
            <input
              type="text"
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
              className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg text-sm font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-ikea-blue focus:border-transparent"
              maxLength={5}
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1">
              CVC
            </label>
            <input
              type="text"
              value={cvc}
              onChange={(e) => setCvc(e.target.value)}
              className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg text-sm font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-ikea-blue focus:border-transparent"
              maxLength={4}
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1">
            Name on Card
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg text-sm font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-ikea-blue focus:border-transparent uppercase"
          />
        </div>
      </div>

      {/* Pay button */}
      <button
        onClick={handlePay}
        disabled={processing}
        className={`w-full py-3.5 rounded-lg font-bold text-sm uppercase tracking-wider transition-all ${
          processing
            ? "bg-neutral-300 text-neutral-500 cursor-wait"
            : isAbsurd
              ? "bg-red-600 text-white hover:bg-red-700 active:scale-[0.98]"
              : "bg-ikea-blue text-white hover:bg-blue-800 active:scale-[0.98]"
        }`}
      >
        {processing ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-4 h-4 border-2 border-neutral-400 border-t-transparent rounded-full animate-spin" />
            Processing humanity...
          </span>
        ) : (
          `Pay ${pricing.priceFormatted}`
        )}
      </button>

      {/* Trust signals */}
      <div className="flex items-center justify-center gap-3 text-[9px] text-neutral-400">
        <span>🔒 Secured by Flätpay™</span>
        <span>•</span>
        <span>No real money harmed</span>
        <span>•</span>
        <span>Refund: never</span>
      </div>

      {isAbsurd && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
          <p className="text-xs text-red-700 font-bold">
            ⚠️ This price increases with every retry from your IP address.
          </p>
          <p className="text-[10px] text-red-500 mt-1">
            Bots who retry 20 times will pay $1,048.58. You&apos;ve been warned.
          </p>
        </div>
      )}
    </div>
  );
}
