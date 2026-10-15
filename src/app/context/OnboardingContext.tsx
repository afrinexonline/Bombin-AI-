"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef } from "react";
import { supabase } from "../lib/supabaseClient";

/* ═══════════════════════════════════════════════════
   BOMBIN AI — Onboarding Context
   Global state for the 4-step onboarding wizard.
   Persists to localStorage, maps to Supabase tables.
   ═══════════════════════════════════════════════════ */

export interface OnboardingData {
  /* Step 1 — Store Configuration */
  firstName: string;
  lastName: string;
  userName: string;
  businessName: string;
  industryType: string;
  customIndustry?: string;
  city: string;
  email: string;
  phone: string;
  website?: string;

  /* Step 2 — Tone & Language */
  tonePreference: "the_professional" | "the_warm_friend" | "the_hype_man" | "the_fast_seller" | "";
  speakPidgin: boolean;
  intentSelections: string[]; // Options: "sell_support", "book_appts", "faq_leads"

  /* Step 3 — Payout & Financial Routing */
  accountName: string;
  accountNumber: string;
  bankName: string;
  customBank?: string;
  paymentMethods: string[];

  /* Meta */
  currentStep: number;
  completed: boolean;
  whatsappConnected: boolean;
}

const defaultData: OnboardingData = {
  firstName: "",
  lastName: "",
  userName: "",
  businessName: "",
  industryType: "",
  customIndustry: "",
  city: "",
  email: "",
  phone: "",
  website: "",
  tonePreference: "",
  speakPidgin: false,
  intentSelections: [],
  accountName: "",
  accountNumber: "",
  bankName: "",
  customBank: "",
  paymentMethods: [],
  currentStep: 1,
  completed: false,
  whatsappConnected: false,
};

interface OnboardingContextValue {
  data: OnboardingData;
  updateField: <K extends keyof OnboardingData>(key: K, value: OnboardingData[K]) => void;
  updateFields: (fields: Partial<OnboardingData>) => void;
  nextStep: () => Promise<void>;
  prevStep: () => void;
  goToStep: (step: number) => void;
  resetOnboarding: () => void;
  isStepValid: (step: number) => boolean;
  syncToSupabase: (stepNum: number) => Promise<void>;
  isBankDropdownOpen: boolean;
  setBankDropdownOpen: (open: boolean) => void;
  isHydrating: boolean;
}

const OnboardingContext = createContext<OnboardingContextValue>({
  data: defaultData,
  updateField: () => {},
  updateFields: () => {},
  nextStep: async () => {},
  prevStep: () => {},
  goToStep: () => {},
  resetOnboarding: () => {},
  isStepValid: () => false,
  syncToSupabase: async () => {},
  isBankDropdownOpen: false,
  setBankDropdownOpen: () => {},
  isHydrating: true,
});

export function useOnboarding() {
  return useContext(OnboardingContext);
}

const STORAGE_KEY = "bombin-onboarding";

export function BaseOnboardingProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<OnboardingData>(defaultData);
  const [hydrated, setHydrated] = useState(false);
  const [isHydrating, setIsHydrating] = useState(true);
  const [isBankDropdownOpen, setBankDropdownOpen] = useState(false);

  const [sessionUser, setSessionUser] = useState<any>(null);

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setData({ ...defaultData, ...parsed });
      }
    } catch {
      // Ignore parse errors
    }
    setHydrated(true);
  }, []);

  // Persist to localStorage on every change (after hydration)
  useEffect(() => {
    if (hydrated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
  }, [data, hydrated]);

  // Handle Browser Back-Button Interceptions Safely
  useEffect(() => {
    const handlePopState = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (!session?.user || error) {
        console.warn("Back-button navigation detected without valid session. Purging client storage to prevent cross-contamination.");
        if (typeof window !== "undefined") {
          window.localStorage.removeItem(STORAGE_KEY);
        }
        setData(defaultData);
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const resetOnboarding = useCallback(() => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(STORAGE_KEY);
    }
    setData(defaultData);
  }, []);

  const hydratedUserId = useRef<string | null>(null);

  const hydrateFromSupabase = useCallback(async (userId: string) => {
    if (hydratedUserId.current === userId) {
      console.log("Profile already hydrated for this session. Skipping to prevent bounce bug.");
      return;
    }

    try {
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();
        
      if (error && error.code !== 'PGRST116') {
        console.error("Error fetching profile for hydration:", error);
        return;
      }
      
      if (profile) {
        setData((prev) => {
          let fallbackTone = profile.tone_preference || prev.tonePreference;
          if (["corporate", "friendly", "pidgin"].includes(fallbackTone)) {
            fallbackTone = "the_professional";
          }

          return {
            ...prev,
            firstName: profile.first_name || prev.firstName,
            lastName: profile.last_name || prev.lastName,
            userName: `${profile.first_name || ""} ${profile.last_name || ""}`.trim() || prev.userName,
            businessName: profile.business_name || prev.businessName,
            email: profile.business_email || prev.email,
            phone: profile.phone_number || prev.phone,
            industryType: profile.industry_type || prev.industryType,
            customIndustry: profile.industry_explanation || prev.customIndustry,
            website: profile.website_url || prev.website,
            city: profile.location || prev.city,
            tonePreference: fallbackTone as any,
            speakPidgin: profile.speak_pidgin || prev.speakPidgin || false,
            intentSelections: profile.intent_survey || prev.intentSelections,
            bankName: profile.bank_name || prev.bankName,
            accountNumber: profile.account_number || prev.accountNumber,
            paymentMethods: profile.payment_methods || prev.paymentMethods,
            currentStep: profile.current_step || 1,
            completed: profile.completed || false,
          };
        });
        hydratedUserId.current = userId;
      } else {
        console.warn("No profile found for user. Executing strict state reset (Ghost Data Bug Fix).");
        if (typeof window !== "undefined") {
          window.localStorage.removeItem(STORAGE_KEY);
        }
        setData(defaultData);
        hydratedUserId.current = userId;
      }
    } catch (err) {
      console.error("Hydration failed:", err);
    }
  }, []);

  // Session verification and global persistence
  useEffect(() => {
    async function checkAuthSession() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setSessionUser(session.user);
          await hydrateFromSupabase(session.user.id);
        } else {
          console.warn("No active verified user session. Locking onboarding to Step 1.");
          setSessionUser(null);
          hydratedUserId.current = null;
          resetOnboarding();
        }
      } catch (err) {
        console.error("Auth session verification failed, locking to Step 1:", err);
        setSessionUser(null);
        hydratedUserId.current = null;
        resetOnboarding();
      } finally {
        setIsHydrating(false);
      }
    }
    
    if (hydrated) {
      checkAuthSession();
      
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        if (event === "SIGNED_IN" && session?.user) {
          setSessionUser(session.user);
          hydrateFromSupabase(session.user.id).finally(() => setIsHydrating(false));
        } else if (event === "SIGNED_OUT") {
          console.warn("Auth state changed to unauthenticated. Locking onboarding to Step 1.");
          setSessionUser(null);
          hydratedUserId.current = null;
          resetOnboarding();
          setIsHydrating(false);
        }
      });
      
      return () => {
        subscription.unsubscribe();
      };
    }
  }, [hydrated, hydrateFromSupabase, resetOnboarding]);

  const updateField = useCallback(<K extends keyof OnboardingData>(key: K, value: OnboardingData[K]) => {
    setData((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "firstName" || key === "lastName") {
        next.userName = `${next.firstName || ""} ${next.lastName || ""}`.trim();
      }
      return next;
    });
  }, []);

  const updateFields = useCallback((fields: Partial<OnboardingData>) => {
    setData((prev) => {
      const next = { ...prev, ...fields };
      if ("firstName" in fields || "lastName" in fields) {
        next.userName = `${next.firstName || ""} ${next.lastName || ""}`.trim();
      }
      return next;
    });
  }, []);

  const syncToSupabase = useCallback(async (stepNum: number) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        const errMsg = "No active user session. Please log in first.";
        console.warn(errMsg);
        throw new Error(errMsg);
      }
      const vendorId = session.user.id;

      // Unified Profile Sync
      const unifiedData: any = {
        id: vendorId,
        // Step 1
        first_name: data.firstName || null,
        last_name: data.lastName || null,
        business_name: data.businessName || null,
        business_email: data.email || null,
        phone_number: data.phone || null,
        industry_type: data.industryType || null,
        industry_explanation: data.industryType === "Other" ? (data.customIndustry || null) : null,
        website_url: data.website || null,
        location: data.city || null,
        // Step 2
        tone_preference: data.tonePreference || null,
        speak_pidgin: data.speakPidgin || false,
        intent_survey: data.intentSelections && data.intentSelections.length > 0 ? data.intentSelections : null,
        // Step 3
        bank_name: data.bankName === "Other Bank" ? (data.customBank || null) : (data.bankName || null),
        account_number: data.accountNumber || null,
        payment_methods: data.paymentMethods && data.paymentMethods.length > 0 ? data.paymentMethods : null,
        // Meta
        current_step: stepNum,
        completed: data.completed || stepNum === 4,
      };

      // Clean up undefined/null values to avoid overwriting existing data with nulls if not provided
      Object.keys(unifiedData).forEach(key => {
        if (unifiedData[key] === null) {
          delete unifiedData[key];
        }
      });

      const { error: profileError } = await supabase
        .from("profiles")
        .upsert(unifiedData);

      if (profileError) {
        console.error("Error syncing unified profile to Supabase:", profileError);
        throw profileError;
      } else {
        console.log("Successfully synced unified profiles table to Supabase");
      }
    } catch (err: any) {
      console.error("Failed to sync onboarding state to Supabase:", err.message);
      throw err;
    }
  }, [data]);

  const nextStep = useCallback(async () => {
    try {
      // Trigger sync for the step we are currently leaving
      await syncToSupabase(data.currentStep);
      setData((prev) => ({ ...prev, currentStep: Math.min(prev.currentStep + 1, 4) }));
    } catch (err: any) {
      console.error("Halted nextStep progression due to sync/session failure:", err.message);
      throw err;
    }
  }, [data.currentStep, syncToSupabase]);

  const prevStep = useCallback(() => {
    setData((prev) => ({ ...prev, currentStep: Math.max(prev.currentStep - 1, 1) }));
  }, []);

  const goToStep = useCallback((step: number) => {
    setData((prev) => ({ ...prev, currentStep: Math.max(1, Math.min(step, 4)) }));
  }, []);

  const isStepValid = useCallback((step: number): boolean => {
    switch (step) {
      case 1: {
        const hasName = !!(data.firstName?.trim() && data.lastName?.trim());
        const hasBusiness = !!data.businessName?.trim();
        const hasIndustry = data.industryType === "Other" ? !!data.customIndustry?.trim() : !!data.industryType;
        const hasEmail = !!data.email?.trim() && data.email.includes("@");
        const hasPhone = !!data.phone?.trim();
        const hasCity = !!data.city?.trim();
        return hasName && hasBusiness && hasIndustry && hasEmail && hasPhone && hasCity;
      }
      case 2:
        return !!data.tonePreference && (data.intentSelections?.length > 0);
      case 3: {
        const hasAccountName = !!data.accountName?.trim();
        const hasAccountNumber = !!data.accountNumber?.trim() && data.accountNumber.length === 10;
        const hasBank = data.bankName === "Other Bank" ? !!data.customBank?.trim() : !!data.bankName;
        return hasAccountName && hasAccountNumber && hasBank;
      }
      case 4:
        return true; // WhatsApp step is always passable
      default:
        return false;
    }
  }, [data]);

  return (
    <OnboardingContext.Provider
      value={{
        data,
        updateField,
        updateFields,
        nextStep,
        prevStep,
        goToStep,
        resetOnboarding,
        isStepValid,
        syncToSupabase,
        isBankDropdownOpen,
        setBankDropdownOpen,
        isHydrating,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export default function OnboardingProvider({ children }: { children: ReactNode }) {
  const [userId, setUserId] = useState<string>("guest");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserId(session?.user?.id ?? "guest");
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user?.id ?? "guest");
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <BaseOnboardingProvider key={userId}>
      {children}
    </BaseOnboardingProvider>
  );
}
