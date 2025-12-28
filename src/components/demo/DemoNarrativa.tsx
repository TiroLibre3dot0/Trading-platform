import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { demoChapters } from './demoChapters';
import DemoOverlay from './DemoOverlay';
import { useDemo } from '../../context/DemoContext';
import { useLocation } from 'react-router-dom';

interface DemoNarrativaProps {
  isOpen: boolean;
}

export default function DemoNarrativa({
  isOpen
}: DemoNarrativaProps) {
  const { 
    showDemo, 
    stopDemo, 
    restartDemo, 
    currentChapterIndex, 
    setCurrentChapterIndex,
    isCorrectRouteForChapter 
  } = useDemo();
  const location = useLocation();

  const currentChapter = demoChapters[currentChapterIndex];
  const isLastChapter = currentChapterIndex === demoChapters.length - 1;
  const isDesktop = window.innerWidth >= 768;
  
  // Determine state based on currentChapterIndex
  const state = currentChapterIndex === 0 ? 'intro' : 'running';
  const activeHighlight = currentChapter?.highlightKey || null;

  // Handle opening/closing - simplified for global rendering
  useEffect(() => {
    if (!isOpen && showDemo) {
      stopDemo();
    }
  }, [isOpen, showDemo, stopDemo]);

  // Handle route changes - ensure tutorial updates when navigation completes
  useEffect(() => {
    if (showDemo && isCorrectRouteForChapter(currentChapterIndex)) {
      // We're on the correct route for current chapter, ensure tutorial is visible
      // This effect runs when route changes
    }
  }, [location.pathname, showDemo, currentChapterIndex, isCorrectRouteForChapter]);

  // Handle modal close behavior
  const handleModalClose = () => {
    if (isDesktop && currentChapterIndex >= 1) {
      // On desktop, after chapter 1, just close modal but keep overlay
      return;
    }
    stopDemo();
  };

  const handleStartDemo = () => {
    setCurrentChapterIndex(1); // Move to first actual chapter
  };

  const handleNext = () => {
    if (isLastChapter) {
      stopDemo();
    } else {
      // Use context function that handles routing
      setCurrentChapterIndex(currentChapterIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentChapterIndex > 0) {
      setCurrentChapterIndex(currentChapterIndex - 1);
    }
  };

  const handleSkip = () => {
    stopDemo();
  };

  // Don't render if not active
  if (!showDemo || !isOpen) {
    return null;
  }

  // Show overlay for running state (desktop) or when modal is closed, but only if there's a valid highlight
  const showOverlay = currentChapterIndex > 0 && (!isDesktop || currentChapterIndex >= 1) && !!activeHighlight;

  return (
    <>
      {/* Overlay for desktop chapters 2+ or mobile */}
      <DemoOverlay
        highlightKey={activeHighlight}
        isVisible={showOverlay}
        chapterData={currentChapter}
        onNext={handleNext}
        onPrev={handlePrev}
        onSkip={handleSkip}
        showCoachPanel={isDesktop}
        isDesktop={isDesktop}
      />

      {/* Modal for intro and mobile/desktop chapter 1 */}
      {(currentChapterIndex === 0 || (currentChapterIndex === 1 && isDesktop) || (!isDesktop && currentChapterIndex > 0)) && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-100">
            {/* Minimal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <currentChapter.icon className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">{currentChapter.title}</h2>
                </div>
              </div>
              <button
                onClick={handleModalClose}
                className="p-1 hover:bg-gray-50 rounded-md transition-colors"
                aria-label="Chiudi"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            {/* Clean Progress */}
            <div className="px-6 py-3">
              <div className="w-full bg-gray-100 rounded-full h-1 mb-3">
                <div
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-1 rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${((currentChapterIndex + 1) / demoChapters.length) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>{currentChapterIndex + 1} di {demoChapters.length}</span>
                <span>{currentChapter.duration}</span>
              </div>
            </div>

            {/* Content */}
            <div className="px-6 pb-6">
              {currentChapterIndex === 0 ? (
                // Minimal intro screen
                <>
                <div className="text-center py-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Play className="w-8 h-8 text-white" />
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-3">Benvenuto nel Tutorial</h1>
                  <p className="text-gray-600 leading-relaxed mb-8">
                    Scopri come utilizzare la piattaforma di trading attraverso una guida interattiva.
                  </p>
                  <button
                    onClick={handleStartDemo}
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-6 rounded-xl font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200 transform hover:scale-[1.02]"
                  >
                    Inizia il Tutorial
                  </button>
                </div>
                </>
              ) : (
                // Clean chapter content
                <>
                <div className="py-2">
                  <p className="text-gray-700 leading-relaxed mb-6">
                    {currentChapter.description}
                  </p>

                  {currentChapter.objectives.length > 0 && (
                    <div className="space-y-2 mb-6">
                      {currentChapter.objectives.slice(0, 3).map((objective, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0" />
                          <span className="text-sm text-gray-600">{objective}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Remove duplicate button - now only in overlay */}
                  {currentChapterIndex > 0 && (
                    <div className="flex justify-end">
                      <button
                        onClick={handleNext}
                        className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200"
                      >
                        {isLastChapter ? 'Completa Tutorial' : 'Avanti'}
                      </button>
                    </div>
                  )}
                </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}