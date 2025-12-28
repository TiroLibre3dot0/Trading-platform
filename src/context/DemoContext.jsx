import React, { createContext, useContext, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { demoChapters } from '../components/demo/demoChapters';

const DemoContext = createContext(null);

export function DemoProvider({ children }) {
  const [showDemo, setShowDemo] = useState(false);
  const [demoHighlight, setDemoHighlight] = useState(null);
  const [demoChapterData, setDemoChapterData] = useState(null);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  
  const navigate = useNavigate();
  const location = useLocation();

  // Function to get required route for a chapter
  const getRequiredRoute = (chapterIndex) => {
    const chapter = demoChapters[chapterIndex];
    return chapter?.route || '/trade'; // Default to trade if no route specified
  };

  // Function to check if current route is correct for chapter
  const isCorrectRouteForChapter = (chapterIndex) => {
    const requiredRoute = getRequiredRoute(chapterIndex);
    return location.pathname === requiredRoute;
  };

  const startDemo = () => {
    // Reset all state before starting
    setShowDemo(true);
    setDemoHighlight(null);
    setDemoChapterData(null);
    setCurrentChapterIndex(0);

    // Navigate to the route for the first chapter
    const requiredRoute = getRequiredRoute(0);
    if (location.pathname !== requiredRoute) {
      navigate(requiredRoute);
    }
  };

  const stopDemo = () => {
    setShowDemo(false);
    setDemoHighlight(null);
    setDemoChapterData(null);
    setCurrentChapterIndex(0);
  };

  const restartDemo = () => {
    // Force restart by stopping first, then starting
    stopDemo();
    setTimeout(() => startDemo(), 100);
  };

  // Function to go to next chapter with route checking
  const nextChapter = (newChapterIndex) => {
    // Update chapter index immediately
    setCurrentChapterIndex(newChapterIndex);

    // Then navigate to the route for this chapter if needed
    const requiredRoute = getRequiredRoute(newChapterIndex);
    if (requiredRoute && location.pathname !== requiredRoute) {
      navigate(requiredRoute);
    }
  };

  return (
    <DemoContext.Provider value={{
      showDemo,
      demoHighlight,
      demoChapterData,
      currentChapterIndex,
      setDemoHighlight,
      setDemoChapterData,
      setCurrentChapterIndex: nextChapter,
      startDemo,
      stopDemo,
      restartDemo,
      isCorrectRouteForChapter
    }}>
      {children}
    </DemoContext.Provider>
  );
}

export function useDemo() {
  const context = useContext(DemoContext);
  if (!context) {
    throw new Error('useDemo must be used within a DemoProvider');
  }
  return context;
}