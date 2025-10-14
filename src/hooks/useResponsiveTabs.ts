import { useState, useEffect } from 'react';

interface UseResponsiveTabsOptions {
  breakpoint?: number;
  minTabWidth?: number;
}

export function useResponsiveTabs({ 
  breakpoint = 768, 
  minTabWidth = 80 
}: UseResponsiveTabsOptions = {}) {
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [tabContainerRef, setTabContainerRef] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < breakpoint);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, [breakpoint]);

  const getTabClasses = () => {
    const baseClasses = "inline-flex w-full";
    const responsiveClasses = isSmallScreen 
      ? "min-w-max overflow-x-auto scrollbar-hide" 
      : "min-w-fit";
    
    return `${baseClasses} ${responsiveClasses}`;
  };

  const getTabTriggerClasses = () => {
    const baseClasses = "transition-all duration-200";
    const responsiveClasses = isSmallScreen
      ? `flex-shrink-0 min-w-[${minTabWidth}px]`
      : "flex-1 min-w-0";
    
    return `${baseClasses} ${responsiveClasses}`;
  };

  const getContainerClasses = () => {
    return isSmallScreen 
      ? "w-full overflow-x-auto responsive-tabs-container" 
      : "w-full";
  };

  return {
    isSmallScreen,
    tabContainerRef,
    setTabContainerRef,
    getTabClasses,
    getTabTriggerClasses,
    getContainerClasses
  };
}

// CSS classes for scrollbar hiding
export const scrollbarHideClasses = `
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;