"use client";
import { useState, useEffect, createContext, useContext } from "react";
import Cookies from "js-cookie";
import { supabase } from "@/services/supabaseClient";
import { User, Session } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  accessToken: string | null;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== "undefined") {
      const userCookie = Cookies.get("user");
      return userCookie ? JSON.parse(userCookie) : null;
    }
    return null;
  });
  useEffect(() => {
    if (user) console.log("[Auth] User:", user);
  }, [user]);
  const [accessToken, setAccessToken] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return Cookies.get("accessToken") || null;
    }
    return null;
  });

  const [loading, setLoading] = useState<boolean>(() => {
    const hasUserInCookie = !!(
      typeof window !== "undefined" && Cookies.get("user")
    );
    return !hasUserInCookie;
  });

  useEffect(() => {
    const initAuth = async () => {
      const token = Cookies.get("accessToken");
      const refresh = Cookies.get("refreshToken");

      if (token && refresh) {
        const { data, error } = await supabase.auth.setSession({
          access_token: token,
          refresh_token: refresh,
        });

        if (error) {
          console.error("[Auth] setSession error:", error.message);
          setUser(null);
          setAccessToken(null);
          Cookies.remove("user");
          Cookies.remove("accessToken");
          Cookies.remove("refreshToken");
        }

        if (data?.session?.user) {
          setUser(data.session.user);
          setAccessToken(data.session.access_token || null);
        }
      } else {
        setUser(null);
        setAccessToken(null);
      }

      setLoading(false);
    };

    initAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("[Auth] Event:", event);
      handleAuthChange(event, session);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleAuthChange(event: string, session: Session | null) {
    if (session?.user) {
      setUser(session.user);
      setAccessToken(session.access_token || null);

      Cookies.set("user", JSON.stringify(session.user), {
        secure: true,
        sameSite: "strict",
        expires: 1,
      });
      Cookies.set("accessToken", session.access_token!, {
        secure: true,
        sameSite: "strict",
        expires: 1,
      });
      if (session.refresh_token) {
        Cookies.set("refreshToken", session.refresh_token, {
          secure: true,
          sameSite: "strict",
          expires: 1,
        });
      }
    } else {
      setUser(null);
      setAccessToken(null);
      Cookies.remove("user");
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
    }
    setLoading(false);
  }

  const logout = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    // onAuthStateChange : handleAuthChange("SIGNED_OUT", null)
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, loading, accessToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
}
