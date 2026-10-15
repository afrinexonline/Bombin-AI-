"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useOnboarding } from "../context/OnboardingContext";
import StepStoreConfig from "../components/onboarding/StepStoreConfig";
import StepToneSelection from "../components/onboarding/StepToneSelection";
import StepPayoutConfig from "../components/onboarding/StepPayoutConfig";
import StepWhatsAppLink from "../components/onboarding/StepWhatsAppLink";
import { ArrowLeft, ArrowRight, Rocket } from "lucide-react";

/* ═══════════════════════════════════════════════════
   BOMBIN AI — Onboarding Wizard Controller
   4-step guided setup with progress tracking
   ═══════════════════════════════════════════════════ */

const STEP_LABELS = ["Store", "Tone", "Payout", "Connect"];

export default function OnboardingPage() {
  const router = useRouter();
  const { data, nextStep, prevStep, updateFields, isStepValid, syncToSupabase, isBankDropdownOpen, isHydrating } =
    useOnboarding();
  const { currentStep } = data;

  const [syncError, setSyncError] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleNext = async () => {
    setSyncError(null);
    setIsSyncing(true);
    try {
      if (currentStep === 4) {
        await syncToSupabase(4);
        updateFields({ completed: true });
        router.push("/dashboard");
      } else {
        await nextStep();
      }
    } catch (err: any) {
      console.error("Step navigation failed:", err);
      const isFetchError = err.message?.includes("Failed to fetch") || err.message?.includes("fetch");
      const userMessage = isFetchError
        ? "Database connection failed. Please check your network and Supabase configuration."
        : err.message || "An error occurred while saving your progress.";
      setSyncError(userMessage);
    } finally {
      setIsSyncing(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <StepStoreConfig />;
      case 2:
        return <StepToneSelection />;
      case 3:
        return <StepPayoutConfig />;
      case 4:
        return <StepWhatsAppLink />;
      default:
        return <StepStoreConfig />;
    }
  };

  return (
    <div className="glass-card w-full p-8 sm:p-10">
      {/* ── Header ─────────────────────────────────── */}
      <div className="text-center mb-8">
        <h1 className="hero-gradient-text text-2xl sm:text-3xl font-bold mb-2">
          BOMBIN AI
        </h1>
        <p
          className="text-sm"
          style={{ color: "var(--text-muted)" }}
        >
          Set up your AI sales engine
        </p>
      </div>

      {/* ── Progress Indicator ─────────────────────── */}
      <div className="flex items-center justify-center gap-0 mb-10 px-4">
        {STEP_LABELS.map((label, i) => {
          const stepNum = i + 1;
          const isActive = stepNum === currentStep;
          const isCompleted = stepNum < currentStep;

          return (
            <div key={label} className="flex items-center">
              {/* Dot */}
              <div className="flex flex-col items-center gap-2">
                <div
                  className={`wizard-dot ${isActive ? "active" : ""} ${isCompleted ? "completed" : ""}`}
                />
                <span
                  className="text-[10px] font-medium tracking-wider uppercase"
                  style={{
                    color: isActive
                      ? "#00C9FF"
                      : isCompleted
                        ? "var(--text-secondary)"
                        : "var(--text-dimmed)",
                  }}
                >
                  {label}
                </span>
              </div>

              {/* Track between dots */}
              {i < STEP_LABELS.length - 1 && (
                <div className="wizard-progress-track w-12 sm:w-16 mx-2 mb-5">
                  <div
                    className="wizard-progress-fill"
                    style={{
                      width: isCompleted ? "100%" : "0%",
                    }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Step Content ───────────────────────────── */}
      <div className="wizard-step w-full" key={isHydrating ? "hydrating" : currentStep}>
        {isHydrating ? (
          <div className="bg-blue-950/20 backdrop-blur-xl border border-blue-500/10 rounded-2xl animate-pulse p-8 w-full flex flex-col min-h-[400px]">
            <div className="h-6 w-1/3 bg-blue-500/10 mb-8 rounded"></div>
            <div className="h-12 w-full bg-blue-500/5 mb-6 rounded-xl border border-blue-500/5"></div>
            <div className="h-12 w-full bg-blue-500/5 mb-6 rounded-xl border border-blue-500/5"></div>
            
            <div className="flex justify-end mt-auto pt-6">
              <div className="h-11 w-32 bg-blue-500/10 rounded-xl"></div>
            </div>
          </div>
        ) : (
          renderStep()
        )}
      </div>

      {/* ── Sync Error Toast ────────────────────────── */}
      {syncError && (
        <div className="mt-6 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-200 text-xs text-center backdrop-blur-md shadow-[0_4px_12px_rgba(244,63,94,0.15)] animate-fade-in">
          {syncError}
        </div>
      )}

      {/* ── Navigation ─────────────────────────────── */}
      <div className={`relative z-10 flex items-center justify-between mt-10 pt-6 transition-opacity duration-300 ${isBankDropdownOpen ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'}`} style={{ borderTop: "1px solid var(--border-card)" }}>
        {/* Back Button */}
        {currentStep > 1 ? (
          <button
            onClick={prevStep}
            disabled={isSyncing}
            className="glass-pill px-5 py-2.5 text-sm font-medium flex items-center gap-2 transition-all hover:scale-105 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ color: "var(--text-secondary)" }}
          >
            <ArrowLeft size={16} />
            Back
          </button>
        ) : (
          <div />
        )}

        {/* Next / Launch Button */}
        <button
          onClick={handleNext}
          disabled={isHydrating || !isStepValid(currentStep) || isSyncing}
          className="btn-gradient px-6 py-3 text-sm font-semibold flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none cursor-pointer"
        >
          {isSyncing ? (
            <span>Saving...</span>
          ) : currentStep === 4 ? (
            <>
              Launch Dashboard <Rocket size={16} />
            </>
          ) : (
            <>
              Continue <ArrowRight size={16} />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
