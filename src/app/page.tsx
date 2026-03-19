import IkeaAssembly from "@/components/IkeaAssembly";

export default function Home() {
  return (
    <main className="min-h-screen bg-ikea-light py-12 px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-black text-neutral-800 tracking-tight">
          Proof of Humanity™
        </h1>
        <p className="text-neutral-500 text-sm mt-1">
          The most absurd CAPTCHA system ever built
        </p>
        <div className="inline-flex items-center gap-2 mt-3 bg-ikea-yellow text-ikea-blue px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
          <span>⚡</span>
          Challenge 3 of 6: IKEA Assembly
        </div>
      </div>
      <IkeaAssembly />
    </main>
  );
}
