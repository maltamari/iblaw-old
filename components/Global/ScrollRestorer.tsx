"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

export default function ScrollRestorer() {
  const pathname = usePathname();
  const isFirstRender = useRef(true);

  // Custom smooth scroll function
  const smoothScrollToTop = (duration = 800) => {
    if (typeof window === 'undefined') return;
    
    const start = window.scrollY;
    const startTime = performance.now();

    const scroll = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const easeInOutCubic = progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      window.scrollTo(0, start * (1 - easeInOutCubic));

      if (progress < 1) {
        requestAnimationFrame(scroll);
      }
    };

    requestAnimationFrame(scroll);
  };

  // Handle scroll restoration on route change
  useEffect(() => {
    // Skip on first render (server-side)
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    // Disable browser's default scroll restoration
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }

    const savedScroll = sessionStorage.getItem("fromScroll");
    
    if (savedScroll) {
      const scrollValue = parseInt(savedScroll, 10);
      
      requestAnimationFrame(() => {
        window.scrollTo(0, scrollValue);
        
        setTimeout(() => {
          smoothScrollToTop(800);
        }, 300);
      });
      
      sessionStorage.removeItem("fromScroll");
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  // Handle link clicks to save scroll position
  useEffect(() => {
    const handleLinkClick = () => {
      sessionStorage.setItem("fromScroll", window.scrollY.toString());
    };

    const links = document.querySelectorAll('a[href^="/"]');
    
    links.forEach(link => {
      link.addEventListener('click', handleLinkClick);
    });

    return () => {
      links.forEach(link => {
        link.removeEventListener('click', handleLinkClick);
      });
    };
  }, [pathname]);

  return null;
}