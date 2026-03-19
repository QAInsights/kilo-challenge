import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 flex items-center justify-center p-4">
      <div className="w-full max-w-lg text-center space-y-8">
        {/* Logo */}
        <div className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-sm rounded-2xl px-6 py-4 border border-white/10">
          <div className="bg-ikea-yellow text-ikea-blue font-black text-2xl w-12 h-12 rounded-lg flex items-center justify-center">
            P
          </div>
          <div className="text-left">
            <h1 className="text-white font-bold text-2xl leading-tight">
              Proof of Humanity™
            </h1>
            <p className="text-neutral-400 text-sm">
              The most absurd CAPTCHA ever built
            </p>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-3">
          <p className="text-neutral-300 text-sm max-w-md mx-auto leading-relaxed">
            To prove you&apos;re human, you must assemble Flätpack furniture.
            <br />
            One step is irrelevant. Robots cannot detect irony.
            <br />
            <span className="text-neutral-500 italic">
              Can you?
            </span>
          </p>
        </div>

        {/* CTA */}
        <div className="flex flex-col items-center gap-3">
          <Link
            href="/login"
            className="bg-ikea-yellow text-ikea-blue px-8 py-4 rounded-xl font-black text-lg hover:bg-yellow-300 active:scale-[0.98] transition-all shadow-lg shadow-ikea-yellow/20"
          >
            Prove You&apos;re Human
          </Link>
          <p className="text-[10px] text-neutral-500">
            No signup required. We just need to know you&apos;re not a robot.
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-3 mt-8">
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="text-2xl mb-2">🪵</div>
            <div className="text-xs font-bold text-white">5 Products</div>
            <div className="text-[10px] text-neutral-500 mt-1">
              From bookshelves to fart cushions
            </div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="text-2xl mb-2">🔀</div>
            <div className="text-xs font-bold text-white">Randomized</div>
            <div className="text-[10px] text-neutral-500 mt-1">
              Server-side answers. Bots can&apos;t cheat.
            </div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="text-2xl mb-2">💀</div>
            <div className="text-xs font-bold text-white">Absurd</div>
            <div className="text-[10px] text-neutral-500 mt-1">
              &quot;Name each screw individually&quot;
            </div>
          </div>
        </div>

        {/* Fine Print */}
        <div className="text-[9px] text-neutral-600 leading-relaxed">
          Protected by Proof of Humanity™ — Flätpack Assembly Module
          <br />
          All leftover screws are intentional. Existential dread is a feature.
        </div>
      </div>
    </main>
  );
}
