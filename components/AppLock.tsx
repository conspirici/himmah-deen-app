"use client";
import { useState, useEffect } from "react";

export function AppLock({ children }: { children: React.ReactNode }) {
  const [locked, setLocked] = useState(true);
  const [setupMode, setSetupMode] = useState(false);
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [step, setStep] = useState<"check" | "prompt" | "setup_1" | "setup_2" | "unlock">("check");
  const [error, setError] = useState("");

  useEffect(() => {
    const savedPin = localStorage.getItem("himmah_pin");
    if (savedPin) {
      setStep("unlock");
    } else {
      setStep("prompt");
    }
  }, []);

  const handleSetup = () => {
    if (step === "setup_1") {
      if (pin.length === 4) {
        setStep("setup_2");
        setError("");
      } else {
        setError("PIN must be 4 digits");
      }
    } else if (step === "setup_2") {
      if (confirmPin === pin) {
        localStorage.setItem("himmah_pin", pin);
        setLocked(false);
      } else {
        setError("PINs do not match. Try again.");
        setConfirmPin("");
        setPin("");
        setStep("setup_1");
      }
    }
  };

  const handleUnlock = () => {
    const savedPin = localStorage.getItem("himmah_pin");
    if (pin === savedPin) {
      setLocked(false);
    } else {
      setError("Incorrect PIN");
      setPin("");
    }
  };

  if (!locked) return <>{children}</>;
  if (step === "check") return <div className="min-h-screen bg-ink" />;

  return (
    <div className="min-h-screen bg-ink text-parchment flex flex-col items-center justify-center px-6 font-sans">
      <div className="max-w-xs w-full text-center space-y-6">
        
        {step === "prompt" && (
          <>
            <div className="mb-4">
              <span className="text-4xl">🔒</span>
            </div>
            <h2 className="font-arabic text-3xl mb-2">App Lock</h2>
            <p className="text-sm opacity-80 mb-8">Would you like to protect Himmah with a 4-digit passcode?</p>
            <div className="space-y-3">
              <button onClick={() => { setStep("setup_1"); setSetupMode(true); }} className="w-full bg-parchment text-ink-deep font-semibold py-3 rounded-xl">
                Set passcode
              </button>
              <button onClick={() => setLocked(false)} className="w-full text-sm opacity-60 py-2">
                Not now
              </button>
            </div>
          </>
        )}

        {step === "setup_1" && (
          <>
            <h2 className="font-arabic text-2xl mb-6">Create a 4-digit passcode</h2>
            <input 
              type="password" 
              inputMode="numeric"
              maxLength={4} 
              autoFocus
              className="bg-transparent border-b-2 border-parchment text-center text-3xl w-32 outline-none tracking-[1em]"
              value={pin}
              onChange={e => { setPin(e.target.value); setError(""); }}
            />
            {error && <p className="text-rust text-xs mt-2">{error}</p>}
            <button onClick={handleSetup} disabled={pin.length !== 4} className="mt-8 bg-parchment text-ink-deep px-6 py-2 rounded-full font-semibold disabled:opacity-50">
              Continue
            </button>
          </>
        )}

        {step === "setup_2" && (
          <>
            <h2 className="font-arabic text-2xl mb-6">Confirm your passcode</h2>
            <input 
              type="password" 
              inputMode="numeric"
              maxLength={4} 
              autoFocus
              className="bg-transparent border-b-2 border-parchment text-center text-3xl w-32 outline-none tracking-[1em]"
              value={confirmPin}
              onChange={e => { setConfirmPin(e.target.value); setError(""); }}
            />
            {error && <p className="text-rust text-xs mt-2">{error}</p>}
            <button onClick={handleSetup} disabled={confirmPin.length !== 4} className="mt-8 bg-parchment text-ink-deep px-6 py-2 rounded-full font-semibold disabled:opacity-50">
              Save
            </button>
          </>
        )}

        {step === "unlock" && (
          <>
            <div className="mb-4">
              <span className="text-4xl">🔒</span>
            </div>
            <h2 className="font-arabic text-2xl mb-6">Enter your Himmah passcode</h2>
            <input 
              type="password" 
              inputMode="numeric"
              maxLength={4} 
              autoFocus
              className="bg-transparent border-b-2 border-parchment text-center text-3xl w-32 outline-none tracking-[1em]"
              value={pin}
              onChange={e => {
                setPin(e.target.value);
                setError("");
                if (e.target.value.length === 4) {
                  setTimeout(() => {
                    const savedPin = localStorage.getItem("himmah_pin");
                    if (e.target.value === savedPin) setLocked(false);
                    else { setError("Incorrect PIN"); setPin(""); }
                  }, 100);
                }
              }}
            />
            {error && <p className="text-rust text-xs mt-2">{error}</p>}
          </>
        )}
      </div>
    </div>
  );
}
