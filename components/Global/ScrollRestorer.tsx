"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function ScrollRestorer() {
  const pathname = usePathname();

  useEffect(() => {
    
    const savedScroll = sessionStorage.getItem("fromScroll");

    if (savedScroll) {
      const scrollValue = parseInt(savedScroll, 10);
      
      window.scrollTo(0, scrollValue);
      
      setTimeout(() => {
        window.scrollTo({
          top: 0,
          behavior: "smooth"
        });
      }, 200);

      sessionStorage.removeItem("fromScroll");
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      const currentScroll = window.scrollY;
      sessionStorage.setItem("fromScroll", currentScroll.toString());
    };

    const links = document.querySelectorAll('a[href^="/"]');
    
    const handleLinkClick = () => {
      const currentScroll = window.scrollY;
      sessionStorage.setItem("fromScroll", currentScroll.toString());
    };

    links.forEach(link => {
      link.addEventListener('click', handleLinkClick);
    });

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      links.forEach(link => {
        link.removeEventListener('click', handleLinkClick);
      });
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [pathname]);

  return null;
}