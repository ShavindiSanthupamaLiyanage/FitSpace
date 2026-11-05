import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import type { ScrollTargetState } from '../types';

// Scrolls to the section named in the navigation state, e.g. <Link state={{ scrollTo: 'contact' }}>
export function useScrollToSection(): void {
  const location = useLocation();

  useEffect(() => {
    const sectionId = (location.state as ScrollTargetState | null)?.scrollTo;
    if (!sectionId) return;

    const section = document.getElementById(sectionId);
    if (!section) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    section.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    // Move keyboard focus too, so screen reader and keyboard users land in the section
    section.focus({ preventScroll: true });
  }, [location]);
}