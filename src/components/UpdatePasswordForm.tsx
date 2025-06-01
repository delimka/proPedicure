"use client";

import { useState } from "react";
import { supabase } from "@/services/supabaseClient";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";

import Logo from "@/assets/logo.jpg";

export function UpdatePasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [error, setError] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();

  async function handleUpdatePassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      setError("Passwords do not match");
      return;
    }
    setIsLoading(true);
    setError("");

    const { data, error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (updateError) {
      setError(updateError.message);
    } else {
      console.log("Password was successfully updated:", data);
      window.location.href = "/booking";
    }
    setIsLoading(false);
  }

  return (
    <div className={cn("flex flex-col gap-6 bg-white", className)} {...props}>
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form
            onSubmit={handleUpdatePassword}
            className="p-6 bg-green-600/10 md:p-8"
          >
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">{t("reset-password")}</h1>
                <p className="text-muted-foreground">
                  {t("enter-new-password-twice")}
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="newPassword">{t("new-password")}</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder={t("new-password")}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirmNewPassword">
                  {t("confirm-new-password")}
                </Label>
                <Input
                  id="confirmNewPassword"
                  type="password"
                  placeholder={t("confirm-new-password")}
                  required
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
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
                  t("update-password")
                )}
              </Button>
            </div>
          </form>
          <div className="relative hidden bg-muted md:block">
            <img
              src={Logo}
              alt={t("logo-alt")}
              className="absolute inset-0 w-full h-full object-contain dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
