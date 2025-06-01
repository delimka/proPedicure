"use client";

import { useState, useEffect } from "react";
import { LoginForm } from "@/components/LoginForm";
import { RegisterForm } from "@/components/RegisterForm";
import { UpdatePasswordForm } from "@/components/UpdatePasswordForm";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState("login");
  const [isRecovery, setIsRecovery] = useState(false);
  const { user } = useAuth();
  const { t } = useTranslation();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("type") === "recovery") {
      setIsRecovery(true);
    }
  }, []);

  if (isRecovery) {
    return (
      <div className="flex min-h-svh flex-col items-center bg-muted mt-4 p-6 md:p-10">
        <div className="w-full max-w-sm md:max-w-3xl">
          <div className="flex justify-center mb-4">
            <UpdatePasswordForm />
          </div>
        </div>
      </div>
    );
  }

  if (user) {
    return (
      <div className="flex min-h-svh flex-col items-center bg-muted mt-4 p-6 md:p-10">
        <div className="h-screen">
          <p>Welcome, {user.user_metadata?.fullName || user.email}!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-svh flex-col items-center bg-muted mt-4 p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <div className="flex justify-center mb-4 border-b">
          <button
            onClick={() => setActiveTab("login")}
            className={`relative px-4 py-2 mb-2 transition-colors ${
              activeTab === "login"
                ? "border-b-2 mb-2 border-primary font-bold"
                : "text-muted-foreground"
            }`}
          >
            {t("login")}
            {activeTab === "login" && (
              <motion.div
                layoutId="underline"
                className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"
              />
            )}
          </button>
          <button
            onClick={() => setActiveTab("register")}
            className={`relative px-4 py-2 mb-2 transition-colors ${
              activeTab === "register"
                ? "border-b-2 border-primary font-bold"
                : "text-muted-foreground"
            }`}
          >
            {t("register")}
            {activeTab === "register" && (
              <motion.div
                layoutId="underline"
                className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"
              />
            )}
          </button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === "login" && (
            <motion.div
              key="login"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.3 }}
            >
              <LoginForm />
            </motion.div>
          )}

          {activeTab === "register" && (
            <motion.div
              key="register"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <RegisterForm />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
