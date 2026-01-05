// scroll-restorer.tsx
"use client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function ScrollRestorer() {
  const pathname = usePathname();

  // Custom smooth scroll function that works in Safari
  const smoothScrollToTop = (duration = 800) => {
    const start = window.scrollY;
    const startTime = performance.now();

    const scroll = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
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

  useEffect(() => {
    // Disable browser's default scroll restoration
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }

    const savedScroll = sessionStorage.getItem("fromScroll");
    
    if (savedScroll) {
      const scrollValue = parseInt(savedScroll, 10);
      
      // Restore to saved position first
      requestAnimationFrame(() => {
        window.scrollTo(0, scrollValue);
        
        // Then smoothly scroll to top after a delay
        setTimeout(() => {
          smoothScrollToTop(800); // 800ms duration - adjust as needed
        }, 300);
      });
      
      sessionStorage.removeItem("fromScroll");
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

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