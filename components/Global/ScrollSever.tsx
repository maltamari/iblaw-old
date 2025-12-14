"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ScrollSaver() {
  const pathname = usePathname();

  useEffect(() => {
    const handler = () => {
      sessionStorage.setItem("fromScroll", window.scrollY.toString());
      sessionStorage.setItem("fromPath", pathname);
    };

    window.addEventListener("beforeunload", handler);

    return () => {
      handler(); 
      window.removeEventListener("beforeunload", handler);
    };
  }, [pathname]);

  return null;
}
