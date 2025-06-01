"use client";

import { useState, useTransition } from "react";
import { supabase } from "@/services/supabaseClient";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import Logo from "@/assets/logo.jpg";
import { useTranslation } from "react-i18next";

export function RegisterForm() {
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();

  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    startTransition(async () => {
      setError(null);

      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: { full_name: formData.fullName, phone: formData.phone },
        },
      });

      if (error) {
        setError(error.message);
        return;
      }

      if (data) {
        setIsVerifying(true);
      }
    });
  }

  async function handleVerifyEmail(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const { error: verifyError } = await supabase.auth.verifyOtp({
      email: formData.email,
      token: verificationCode,
      type: "signup",
    });
    if (verifyError) {
      setError(verifyError.message);
      return;
    }

    const { error: updateError } = await supabase.auth.updateUser({
      data: { full_name: formData.fullName, phone: formData.phone },
    });
    if (updateError) {
      setError(updateError.message);
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const { error: profileError } = await supabase.from("profiles").insert([
        {
          id: user.id,
          full_name: formData.fullName,
          phone: formData.phone,
          email: user.email,
        },
      ]);
      if (profileError) {
        console.error("Error during profile save:", profileError.message);
        setError(profileError.message);
        return;
      }
    } else {
      setError("No user data after verification.");
      return;
    }

    setSuccess(true);
    setIsVerifying(false);
  }

  return (
    <div className="flex flex-col gap-6 bg-white">
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 bg-green-600/10 md:grid-cols-2">
          {isVerifying ? (
            <form onSubmit={handleVerifyEmail} className="p-6 md:p-8 space-y-4">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">{t("verify-email")}</h1>
                <p className="text-muted-foreground">
                  {t("verify-email-description")}
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="verification-code">
                  {t("verification-code")}
                </Label>
                <Input
                  id="verification-code"
                  placeholder={t("enter-code")}
                  required
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                />
              </div>
              {error && <p className="text-red-500">{error}</p>}
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? t("verifying") : t("verify")}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="p-6 md:p-8 space-y-4">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">{t("register-title")}</h1>
                <p className="text-muted-foreground">
                  {t("register-description")}
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="full-name">{t("full-name")}</Label>
                <Input
                  id="full-name"
                  placeholder="John Doe"
                  required
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">{t("email")}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="me@example.com"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">{t("phone-number")}</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1234567890"
                  required
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">{t("password")}</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirm-password">
                  {t("confirm-password")}
                </Label>
                <Input
                  id="confirm-password"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                />
              </div>
              {error === "Passwords do not match" && (
                <p className="text-red-500">{t("passwords-do-not-match")}</p>
              )}
              {error && error !== "Passwords do not match" && (
                <p className="text-red-500">{error}</p>
              )}
              {success && (
                <p className="text-green-500">{t("user-verified")}</p>
              )}
              <Button
                type="submit"
                className="w-full bg-green-600/20"
                disabled={isPending}
              >
                {isPending ? t("registering") : t("register")}
              </Button>
            </form>
          )}
          <div className="relative hidden bg-muted md:block">
            <img
              src={Logo}
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
