"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import IkeaAssembly from "@/components/IkeaAssembly";

type Step = "credentials" | "captcha" | "success";

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("credentials");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [captchaPassed, setCaptchaPassed] = useState(false);

  const handleCredentialsSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      setError("");

      if (!email || !password) {
        setError("All fields are required. Even the ones that seem optional.");
        return;
      }
      if (!email.includes("@")) {
        setError("That doesn't look like an email. Are you a robot?");
        return;
      }

      setStep("captcha");
    },
    [email, password]
  );

  const handleCaptchaSuccess = useCallback(async () => {
    setCaptchaPassed(true);

    await new Promise((r) => setTimeout(r, 1500));

    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (res.ok) {
      setStep("success");
      setTimeout(() => router.push("/dashboard"), 2000);
    } else {
      setError("Something went wrong. The furniture gods are displeased.");
      setStep("credentials");
    }
  }, [email, router]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-sm rounded-2xl px-6 py-4 border border-white/10">
            <div className="bg-ikea-yellow text-ikea-blue font-black text-xl w-10 h-10 rounded-lg flex items-center justify-center">
              P
            </div>
            <div className="text-left">
              <h1 className="text-white font-bold text-lg leading-tight">
                Proof of Humanity™
              </h1>
              <p className="text-neutral-400 text-xs">
                Authenticate your existence
              </p>
            </div>
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Step Indicator */}
          <div className="bg-neutral-50 border-b border-neutral-200 px-6 py-3 flex items-center gap-2">
            <div
              className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center ${
                step === "credentials"
                  ? "bg-ikea-blue text-white"
                  : captchaPassed
                  ? "bg-green-500 text-white"
                  : "bg-neutral-200 text-neutral-500"
              }`}
            >
              {step !== "credentials" ? "✓" : "1"}
            </div>
            <div className="h-px flex-1 bg-neutral-200" />
            <div
              className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center ${
                step === "captcha"
                  ? "bg-ikea-blue text-white"
                  : step === "success"
                  ? "bg-green-500 text-white"
                  : "bg-neutral-200 text-neutral-500"
              }`}
            >
              {step === "success" ? "✓" : "2"}
            </div>
            <div className="h-px flex-1 bg-neutral-200" />
            <div
              className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center ${
                step === "success"
                  ? "bg-green-500 text-white"
                  : "bg-neutral-200 text-neutral-500"
              }`}
            >
              {step === "success" ? "✓" : "3"}
            </div>
          </div>

          {/* Step Labels */}
          <div className="bg-neutral-50 border-b border-neutral-200 px-6 pb-2 flex items-center">
            <span className="text-[10px] text-neutral-500 w-6 text-center">
              Creds
            </span>
            <div className="flex-1" />
            <span className="text-[10px] text-neutral-500 w-6 text-center">
              CAPTCHA
            </span>
            <div className="flex-1" />
            <span className="text-[10px] text-neutral-500 w-6 text-center">
              Access
            </span>
          </div>

          {/* Content */}
          <div className="p-6">
            {step === "credentials" && (
              <form onSubmit={handleCredentialsSubmit} className="space-y-4">
                <div>
                  <h2 className="text-xl font-bold text-neutral-800">
                    Welcome back, human
                  </h2>
                  <p className="text-sm text-neutral-500 mt-1">
                    Sign in to continue. We believe in you.
                  </p>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-600 uppercase tracking-wider mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@definitely-human.com"
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ikea-blue focus:border-transparent transition-all"
                      autoComplete="email"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-600 uppercase tracking-wider mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••"
                        className="w-full px-4 py-3 pr-12 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ikea-blue focus:border-transparent transition-all"
                        autoComplete="current-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 text-xs"
                      >
                        {showPassword ? "Hide" : "Show"}
                      </button>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-3 py-2 rounded-lg">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-ikea-blue text-white py-3 rounded-lg font-bold text-sm hover:bg-blue-800 active:scale-[0.98] transition-all"
                >
                  Continue to Human Verification
                </button>

                <div className="text-center">
                  <a
                    href="#"
                    className="text-xs text-ikea-blue hover:underline"
                  >
                    Forgot password? We forgot too.
                  </a>
                </div>

                <div className="border-t border-neutral-200 pt-4 mt-4">
                  <p className="text-[10px] text-neutral-400 text-center leading-relaxed">
                    By signing in, you confirm that you are not a robot, AI,
                    sentient bookshelf, or Swedish furniture conglomerate.
                  </p>
                </div>
              </form>
            )}

            {step === "captcha" && !captchaPassed && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-bold text-neutral-800">
                    Prove you&apos;re human
                  </h2>
                  <p className="text-sm text-neutral-500 mt-1">
                    Assemble the furniture from real parts. Leave the decoy and
                    spare screws on the table. No pressure.
                  </p>
                </div>

                <div className="bg-ikea-yellow/20 border border-ikea-yellow rounded-lg px-3 py-2 text-xs text-amber-800">
                  <span className="font-bold">⚠️ Required:</span> This step
                  cannot be skipped. Only humans know which parts go where.
                </div>

                <IkeaAssembly onSuccess={handleCaptchaSuccess} />
              </div>
            )}

            {step === "captcha" && captchaPassed && (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
                </div>
                <h2 className="text-xl font-bold text-neutral-800">
                  Human verified
                </h2>
                <p className="text-sm text-neutral-500">
                  Redirecting you to safety...
                </p>
              </div>
            )}

            {step === "success" && (
              <div className="text-center py-12 space-y-4">
                <div className="text-6xl">🎉</div>
                <h2 className="text-xl font-bold text-green-700">
                  Welcome, human
                </h2>
                <p className="text-sm text-neutral-500">
                  You have successfully proven your humanity through the power
                  of Scandinavian furniture assembly.
                </p>
                <div className="bg-green-50 rounded-lg p-3 text-xs text-green-700">
                  Session authenticated. Your leftover screws have been logged.
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-[10px] text-neutral-500 leading-relaxed">
          Protected by Proof of Humanity™ v2.1 — Flätpack Assembly Module
          <br />
          No robots were harmed in the making of this CAPTCHA.
        </div>
      </div>
    </main>
  );
}
