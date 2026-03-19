import Link from "next/link";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-neutral-900 flex items-center justify-center p-4">
      <div className="w-full max-w-lg text-center space-y-8">
        {/* Success Icon */}
        <div className="text-8xl">🪵</div>

        {/* Title */}
        <div>
          <h1 className="text-3xl font-black text-white">
            Welcome, human
          </h1>
          <p className="text-neutral-400 text-sm mt-2">
            You passed the IKEA Assembly CAPTCHA.
            <br />
            Your humanity has been verified beyond reasonable doubt.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="text-2xl font-black text-ikea-yellow">✓</div>
            <div className="text-xs text-neutral-400 mt-1">Human Verified</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="text-2xl font-black text-amber-400">5</div>
            <div className="text-xs text-neutral-400 mt-1">Leftover Screws</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="text-2xl font-black text-green-400">0</div>
            <div className="text-xs text-neutral-400 mt-1">Robots Detected</div>
          </div>
        </div>

        {/* Certificate */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-left">
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-ikea-yellow text-ikea-blue font-black text-sm w-6 h-6 rounded flex items-center justify-center">
              P
            </div>
            <span className="text-white font-bold text-sm">
              Certificate of Humanity
            </span>
          </div>
          <div className="space-y-2 text-xs text-neutral-400">
            <p>
              This certifies that the bearer has successfully assembled a
              KLÄTTBÖRD-series furniture unit, correctly identified and
              discarded the irrelevant assembly step, and demonstrated the
              emotional resilience required to be classified as human.
            </p>
            <p>
              Status: <span className="text-green-400 font-bold">VERIFIED</span>
            </p>
            <p className="italic">
              &quot;No robot would tolerate this.&quot; — Proof of Humanity™, 2026
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-center">
          <Link
            href="/login"
            className="bg-ikea-blue text-white px-6 py-3 rounded-lg font-bold text-sm hover:bg-blue-800 transition-colors"
          >
            Try Again (for fun)
          </Link>
          <Link
            href="/"
            className="bg-white/10 text-white px-6 py-3 rounded-lg font-bold text-sm hover:bg-white/20 transition-colors"
          >
            Back to Home
          </Link>
        </div>

        {/* Footer */}
        <div className="text-[10px] text-neutral-600 leading-relaxed">
          Your leftover screws have been logged for quality assurance.
          <br />
          Existential dread is a feature, not a bug.
        </div>
      </div>
    </main>
  );
}
