"use client";

import { useState } from "react";
import { supabase } from "@/services/supabaseClient";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import Logo from "@/assets/logo.jpg";
import { useTranslation } from "react-i18next";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { t } = useTranslation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    await new Promise((resolve) => setTimeout(resolve, 300));

    const { data, error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (loginError) {
      setError(loginError.message);
    } else {
      console.log("User logged in:", data);
      window.location.href = "/booking";
    }
    setIsLoading(false);
  }

  async function handleResetPasswordEmail(e: React.FormEvent) {
    e.preventDefault();
    if (!email) {
      setError(t("error-enter-email-for-reset"));
      return;
    }
    setIsLoading(true);
    setError("");
    const redirectUrl = `${window.location.origin}/login?type=recovery`;
    const { data, error: resetError } =
      await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      });
    console.log(data);
    if (resetError) {
      setError(resetError.message);
    } else {
      alert(t("reset-password-email-sent"));
    }
    setIsLoading(false);
  }

  return (
    <div className={cn("flex flex-col gap-6 bg-white", className)} {...props}>
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form onSubmit={handleLogin} className="p-6 bg-green-600/10 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">{t("welcome-to")}</h1>
                <p className="text-muted-foreground">{t("login-prompt")}</p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">{t("your-email")}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="me@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">{t("password")}</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {error && <p className="text-red-500">{error}</p>}
              <Button
                type="submit"
                className="bg-green-600/20 w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="w-10 h-10 animate-spin mx-auto" />
                ) : (
                  t("login")
                )}
              </Button>
              <div className="flex justify-between text-sm">
                <a
                  href="#"
                  className="underline underline-offset-4"
                  onClick={handleResetPasswordEmail}
                >
                  {t("forgot-password")}
                </a>
              </div>
            </div>
          </form>
          <div className="relative hidden bg-muted md:block">
            <img
              src={Logo}
              alt={t("photo-alt")}
              className="absolute inset-0 w-full h-full object-contain dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
