import { useState, useEffect, useCallback } from 'react';

export type DemoState = 'idle' | 'intro' | 'running' | 'completed';

export interface UseDemoTourOptions {
  totalChapters: number;
  onClose?: () => void;
  onComplete?: () => void;
  onHighlight?: (key: string | null) => void;
}

export interface UseDemoTourReturn {
  state: DemoState;
  currentChapterIndex: number;
  completedChapters: Set<number>;
  isDesktop: boolean;
  activeHighlight: string | null;
  start: () => void;
  next: () => void;
  prev: () => void;
  skip: () => void;
  completeChapter: () => void;
  finish: () => void;
  setActiveHighlight: (key: string | null) => void;
}

export function useDemoTour({
  totalChapters,
  onClose,
  onComplete,
  onHighlight
}: UseDemoTourOptions): UseDemoTourReturn {
  const [state, setState] = useState<DemoState>('idle');
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [completedChapters, setCompletedChapters] = useState<Set<number>>(new Set());
  const [isDesktop, setIsDesktop] = useState(false);
  const [activeHighlight, setActiveHighlight] = useState<string | null>(null);

  // Check if desktop on mount and resize
  useEffect(() => {
    const checkIsDesktop = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    checkIsDesktop();
    window.addEventListener('resize', checkIsDesktop);
    return () => window.removeEventListener('resize', checkIsDesktop);
  }, []);

  // Keyboard handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (state === 'idle') return;

      switch (e.key) {
        case 'Escape':
          skip();
          break;
        case 'ArrowRight':
          if (state === 'running') next();
          break;
        case 'ArrowLeft':
          if (state === 'running') prev();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [state]);

  // Update highlight when chapter changes
  useEffect(() => {
    if (state === 'running' && currentChapterIndex >= 0) {
      // This will be set by the component when chapter changes
    }
  }, [currentChapterIndex, state]);

  const start = useCallback(() => {
    setState('running');
    setCurrentChapterIndex(0);
    setCompletedChapters(new Set());
    setActiveHighlight(null);
  }, []);

  const next = useCallback(() => {
    if (currentChapterIndex < totalChapters - 1) {
      setCurrentChapterIndex(prev => prev + 1);
    }
  }, [currentChapterIndex, totalChapters]);

  const prev = useCallback(() => {
    if (currentChapterIndex > 0) {
      setCurrentChapterIndex(prev => prev - 1);
    }
  }, [currentChapterIndex]);

  const completeChapter = useCallback(() => {
    setCompletedChapters(prev => new Set([...prev, currentChapterIndex]));

    if (currentChapterIndex < totalChapters - 1) {
      next();
    } else {
      finish();
    }
  }, [currentChapterIndex, totalChapters, next]);

  const skip = useCallback(() => {
    setState('idle');
    setCurrentChapterIndex(0);
    setCompletedChapters(new Set());
    setActiveHighlight(null);
    onClose?.();
  }, [onClose]);

  const finish = useCallback(() => {
    setState('completed');
    setActiveHighlight(null);
    onComplete?.();
    // Reset after a delay to allow completion callback
    setTimeout(() => {
      setState('idle');
      setCurrentChapterIndex(0);
      setCompletedChapters(new Set());
    }, 1000);
  }, [onComplete]);

  const updateActiveHighlight = useCallback((key: string | null) => {
    setActiveHighlight(key);
    onHighlight?.(key);
  }, [onHighlight]);

  return {
    state,
    currentChapterIndex,
    completedChapters,
    isDesktop,
    activeHighlight,
    start,
    next,
    prev,
    skip,
    completeChapter,
    finish,
    setActiveHighlight: updateActiveHighlight
  };
}