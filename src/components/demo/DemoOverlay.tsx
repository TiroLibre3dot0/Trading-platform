import React, { useEffect, useState, useRef } from 'react';
import { Eye, AlertCircle } from 'lucide-react';

interface DemoOverlayProps {
  highlightKey: string | null;
  isVisible: boolean;
  chapterData?: {
    title: string;
    description: string;
    objectives: string[];
    ctaLabel?: string;
  };
  onNext?: () => void;
  onPrev?: () => void;
  onSkip?: () => void;
  showCoachPanel?: boolean;
  isDesktop?: boolean;
}

interface TargetRect {
  top: number;
  left: number;
  width: number;
  height: number;
  element: Element | null;
}

export default function DemoOverlay({
  highlightKey,
  isVisible,
  chapterData,
  onNext,
  onPrev,
  onSkip,
  showCoachPanel = true,
  isDesktop = false
}: DemoOverlayProps) {
  const [targetRect, setTargetRect] = useState<TargetRect | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<'top' | 'bottom' | 'left' | 'right'>('bottom');
  const [tooltipCoords, setTooltipCoords] = useState<{x: number, y: number} | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Find target element and calculate position
  useEffect(() => {
    if (!highlightKey || !isVisible) {
      setTargetRect(null);
      setTooltipCoords(null);
      return;
    }

    const findTarget = () => {
      const element = document.querySelector(`[data-tour="${highlightKey}"]`);
      if (!element) {
        console.warn(`Demo target not found: [data-tour="${highlightKey}"]`);
        setTargetRect(null);
        setTooltipCoords(null);
        return;
      }

      const rect = element.getBoundingClientRect();
      setTargetRect({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
        element
      });

      // Calculate tooltip position dynamically based on element location
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Position tooltip near the highlighted element
      let tooltipX = centerX;
      let tooltipY = centerY;

      // Determine best position for tooltip (avoid edges)
      if (centerX < viewportWidth / 2) {
        // Element is on left side - place tooltip to the right
        tooltipX = rect.right + 20;
        setTooltipPosition('right');
      } else {
        // Element is on right side - place tooltip to the left
        tooltipX = rect.left - 320; // 320px is approx tooltip width
        setTooltipPosition('left');
      }

      if (centerY < viewportHeight / 2) {
        // Element is on top half - prefer bottom placement
        tooltipY = rect.bottom + 20;
        setTooltipPosition('bottom');
      } else {
        // Element is on bottom half - prefer top placement
        tooltipY = rect.top - 200; // 200px is approx tooltip height
        setTooltipPosition('top');
      }

      // Ensure tooltip stays within viewport bounds
      tooltipX = Math.max(20, Math.min(viewportWidth - 340, tooltipX));
      tooltipY = Math.max(20, Math.min(viewportHeight - 220, tooltipY));

      setTooltipCoords({ x: tooltipX, y: tooltipY });
    };

    findTarget();

    // Update position on resize/scroll
    const handleUpdate = () => findTarget();
    window.addEventListener('resize', handleUpdate);
    window.addEventListener('scroll', handleUpdate, true);

    return () => {
      window.removeEventListener('resize', handleUpdate);
      window.removeEventListener('scroll', handleUpdate, true);
    };
  }, [highlightKey, isVisible]);

  if (!isVisible) return null;

  const hasValidTarget = targetRect && targetRect.width > 0 && targetRect.height > 0;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-40 pointer-events-none"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
    >
        {hasValidTarget && (
          <div
            className={`absolute border-4 rounded-lg transition-all duration-500 animate-pulse shadow-2xl ${
              highlightKey === 'navigator' 
                ? 'border-orange-500 bg-orange-500/20' 
                : 'border-blue-500 bg-blue-500/15'
            }`}
            style={{
              top: targetRect.top - 6,
              left: targetRect.left - 6,
              width: targetRect.width + 12,
              height: targetRect.height + 12,
              boxShadow: highlightKey === 'navigator'
                ? '0 0 0 4px rgba(249, 115, 22, 0.4), 0 0 30px rgba(249, 115, 22, 0.3)'
                : '0 0 0 4px rgba(59, 130, 246, 0.3), 0 0 20px rgba(59, 130, 246, 0.2)'
            }}
          />
        )}

      {/* Enhanced continue button with better visibility */}
      {hasValidTarget && (
        <div
          className="absolute pointer-events-auto z-40"
          style={{
            top: targetRect.top + targetRect.height + 24,
            left: targetRect.left + targetRect.width / 2,
            transform: 'translateX(-50%)'
          }}
        >
          <div className="relative">
            <button
              onClick={onNext}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 font-medium text-sm border-2 border-white"
            >
              {chapterData?.ctaLabel || 'Continua'}
            </button>
            {/* Arrow pointing up to the highlighted element */}
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
              <div className="w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-blue-600"></div>
            </div>
          </div>
        </div>
      )}

      {/* Fallback message if target not found */}
      {!hasValidTarget && highlightKey && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-2 rounded-lg flex items-center gap-2 pointer-events-auto">
          <AlertCircle className="w-4 h-4" />
          <span className="text-sm">Elemento non disponibile - continua il tutorial</span>
        </div>
      )}

      {/* Coach Panel positioned near highlighted element */}
      {showCoachPanel && isDesktop && chapterData && hasValidTarget && tooltipCoords && (
        <div
          className="absolute bg-white rounded-lg shadow-2xl border border-gray-200 p-4 max-w-sm pointer-events-auto z-[9999]"
          style={{
            left: tooltipCoords.x,
            top: tooltipCoords.y,
            transform: tooltipPosition === 'left' ? 'translateX(0)' : 'translateX(0)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.05)'
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900">{chapterData.title}</h3>
            <button
              onClick={onSkip}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Chiudi tutorial"
            >
              ✕
            </button>
          </div>

          <p className="text-sm text-gray-600 mb-3">{chapterData.description}</p>

          <div className="space-y-2 mb-4">
            {chapterData.objectives.map((objective, index) => (
              <div key={index} className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                <span className="text-sm text-gray-700">{objective}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onPrev}
              disabled={false} // Will be handled by parent
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Indietro
            </button>
            <button
              onClick={onNext}
              className="px-4 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
            >
              {chapterData.ctaLabel || 'Avanti'}
            </button>
          </div>
        </div>
      )}

      {/* Fallback coach panel when no target is highlighted */}
      {showCoachPanel && isDesktop && chapterData && !hasValidTarget && (
        <div className="absolute bottom-6 right-6 bg-white rounded-lg shadow-2xl border border-gray-200 p-4 max-w-sm pointer-events-auto z-[9999]"
          style={{
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.05)'
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900">{chapterData.title}</h3>
            <button
              onClick={onSkip}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Chiudi tutorial"
            >
              ✕
            </button>
          </div>

          <p className="text-sm text-gray-600 mb-3">{chapterData.description}</p>

          <div className="space-y-2 mb-4">
            {chapterData.objectives.map((objective, index) => (
              <div key={index} className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                <span className="text-sm text-gray-700">{objective}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onPrev}
              disabled={false}
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Indietro
            </button>
            <button
              onClick={onNext}
              className="px-4 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
            >
              {chapterData.ctaLabel || 'Avanti'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}