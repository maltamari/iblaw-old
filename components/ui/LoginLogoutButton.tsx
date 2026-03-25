"use client";

import React, { useEffect, useState } from "react";
import { Button } from "./button";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Loader2 } from "lucide-react";
import type { User } from "@supabase/supabase-js";

const LoginButton = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    // Get initial session
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
      } catch (error) {
        console.error("Error fetching session:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen to auth changes in real-time
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
      
      // Force router refresh when auth state changes
      router.refresh();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, router]);

 const handleSignOut = async () => {
  try {
    setIsLoggingOut(true);

    await fetch("/api/logout", {
      method: "POST",
    });

    setUser(null);
    router.push("/login");
    router.refresh();
  } catch (error) {
    console.error("Error signing out:", error);
  } finally {
    setIsLoggingOut(false);
  }
};

  // ✅ OPTION 2: Use redirect to logout page (even faster)
 const handleSignOutWithRedirect = () => {
  router.push("/logout");
};

  if (loading) {
    return (
      <Button disabled variant="outline">
        <Loader2 className="h-4 w-4 animate-spin" />
      </Button>
    );
  }

  if (user) {
    return (
      <Button
        onClick={handleSignOut}
        disabled={isLoggingOut}
        className="bg-main text-white hover:bg-main/50 cursor-pointer"
      >
        {isLoggingOut ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Logging out...
          </>
        ) : (
          "Log out"
        )}
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      onClick={() => {
        router.push("/login");
      }}
    >
      Login
    </Button>
  );
};

export default LoginButton;