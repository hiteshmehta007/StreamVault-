import React, { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'sonner';

interface Video {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  views: string;
  uploadDate: string;
  channel: {
    name: string;
    avatar?: string;
    subscribers?: string;
  };
  quality: string[];
  description?: string;
  likes?: string;
  dislikes?: string;
}

interface PlaybackState {
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isPlaying: boolean;
  playbackRate: number;
  quality: string;
}

interface AccessControlConfig {
  allowMultiPlayer: boolean;
  allowMiniPlayer: boolean;
  reason?: string;
  restrictedContent?: boolean;
  creatorOnlyOverlay?: boolean;
}

interface PlayerPreferences {
  defaultMode: 'miniplayer' | 'multiplayer' | 'theater';
  miniPlayerSize: 'small' | 'medium' | 'large';
  miniPlayerPosition: { x: number; y: number };
  autoSwitchToMultiPlayer: boolean;
  rememberPosition: boolean;
}

interface FloatingPlayerManagerProps {
  video: Video | null;
  videoRef: React.RefObject<HTMLVideoElement>;
  playbackState: PlaybackState;
  accessControl: AccessControlConfig;
  queuePosition: { current: number; total: number };
  hasNext: boolean;
  hasPrevious: boolean;
  onPlaybackChange: (state: Partial<PlaybackState>) => void;
  onPrevious: () => void;
  onNext: () => void;
  onToggleTheater: () => void;
  onShowComments: () => void;
  onShowQueue: () => void;
  onClose: () => void;
  onNavigateToHome?: () => void;
}

export function useFloatingPlayerManager({
  video,
  videoRef,
  playbackState,
  accessControl,
  queuePosition,
  hasNext,
  hasPrevious,
  onPlaybackChange,
  onPrevious,
  onNext,
  onToggleTheater,
  onShowComments,
  onShowQueue,
  onClose,
  onNavigateToHome
}: FloatingPlayerManagerProps) {
  // Core state
  const [currentMode, setCurrentMode] = useState<'theater' | 'miniplayer' | 'multiplayer'>('theater');
  const [isVisible, setIsVisible] = useState(false);
  const [preferences, setPreferences] = useState<PlayerPreferences>(() => {
    const saved = localStorage.getItem('floating-player-preferences');
    return saved ? JSON.parse(saved) : {
      defaultMode: 'theater', // Changed from 'miniplayer' to prevent auto-activation
      miniPlayerSize: 'medium',
      miniPlayerPosition: { x: window.innerWidth - 500, y: 100 },
      autoSwitchToMultiPlayer: false, // Disabled auto-switching
      rememberPosition: true
    };
  });

  // Multi-Player state  
  const [isMultiPlayerActive, setIsMultiPlayerActive] = useState(false);
  const [multiPlayerSupported, setMultiPlayerSupported] = useState(false);
  
  // Manual-only activation - no scroll detection needed
  
  // DISABLED: Auto-activate MiniPlayer on scroll (manual activation only)
  useEffect(() => {
    // Scroll-based auto-activation is DISABLED to prevent MiniPlayer from opening automatically
    // Users must manually click the MiniPlayer button to activate it
    
    // const handleScroll = () => {
    //   const scrollY = window.scrollY;
    //   const shouldShow = scrollY > 300;
    //   
    //   if (shouldShow && !isVisible && accessControl.allowMiniPlayer && currentMode === 'theater') {
    //     setShouldShowMiniPlayer(true);
    //     setCurrentMode('miniplayer');
    //     setIsVisible(true);
    //     toast.success('MiniPlayer activated');
    //   }
    // };
    
    // window.addEventListener('scroll', handleScroll);
    // return () => window.removeEventListener('scroll', handleScroll);
  }, [isVisible, accessControl.allowMiniPlayer, currentMode]);

  // Tab visibility tracking
  const [tabVisible, setTabVisible] = useState(true);
  const multiPlayerTransitionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize Multi-Player support detection
  useEffect(() => {
    // Multi-Player is always supported as it's our custom implementation
    setMultiPlayerSupported(true);
  }, [videoRef]);

  // Force close any auto-opened MiniPlayer on initialization
  useEffect(() => {
    // Ensure MiniPlayer starts closed - force close any auto-opened instances
    if (isVisible && currentMode === 'miniplayer') {
      setCurrentMode('theater');
      setIsVisible(false);
      console.log('🔒 Force closed auto-opened MiniPlayer');
    }
    
    // Reset any problematic localStorage preferences that might cause auto-opening
    const currentPrefs = localStorage.getItem('floating-player-preferences');
    if (currentPrefs) {
      try {
        const parsed = JSON.parse(currentPrefs);
        if (parsed.defaultMode === 'miniplayer' || parsed.autoSwitchToMultiPlayer === true) {
          const correctedPrefs = {
            ...parsed,
            defaultMode: 'theater',
            autoSwitchToMultiPlayer: false
          };
          localStorage.setItem('floating-player-preferences', JSON.stringify(correctedPrefs));
          console.log('🔧 Corrected MiniPlayer preferences to prevent auto-opening');
        }
      } catch (e) {
        console.warn('Failed to parse floating player preferences:', e);
      }
    }
  }, []); // Only run once on mount

  // Save preferences to localStorage
  useEffect(() => {
    localStorage.setItem('floating-player-preferences', JSON.stringify(preferences));
  }, [preferences]);

  // Scroll detection for auto mini-player (DISABLED - manual activation only)
  useEffect(() => {
    // COMPLETELY DISABLED: No scroll-based behavior for MiniPlayer
    // Users must manually activate/deactivate MiniPlayer through button click only
    
    // All scroll-based logic removed to prevent any auto-closing behavior
    
    return () => {
      // No cleanup needed since no scroll listeners are attached
    };
  }, [currentMode]);

  // Tab visibility detection for smart MultiPlayer switching (disabled auto-switching)
  useEffect(() => {
    const handleVisibilityChange = () => {
      const isVisible = document.visibilityState === 'visible';
      setTabVisible(isVisible);
      
      // Removed auto-switching behavior to prevent MiniPlayer from opening automatically
      // Users must manually activate MiniPlayer or MultiPlayer mode
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (multiPlayerTransitionTimeoutRef.current) {
        clearTimeout(multiPlayerTransitionTimeoutRef.current);
      }
    };
  }, [preferences.autoSwitchToMultiPlayer, accessControl.allowMultiPlayer, currentMode, tabVisible, playbackState.isPlaying, isMultiPlayerActive]);

  // MultiPlayer event listeners (custom implementation)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Custom MultiPlayer logic is handled by dedicated functions
    // No handlers needed in this effect
    
    return () => {
      // Cleanup if needed
    };
  }, [videoRef]);

  // REMOVED: Auto-close effect that was causing MiniPlayer to close immediately
  // MiniPlayer now stays open until user manually closes it
  // No automatic closing based on shouldShowMiniPlayer state

  // Access control validation
  const validateAccess = (mode: 'multiplayer' | 'miniplayer'): boolean => {
    if (mode === 'multiplayer' && !accessControl.allowMultiPlayer) {
      toast.error(accessControl.reason || 'Multi-player mode is not available for this content');
      return false;
    }
    if (mode === 'miniplayer' && !accessControl.allowMiniPlayer) {
      toast.error('Mini-player is not available for this content');
      return false;
    }
    return true;
  };

  // Core functions
  const activateMiniPlayer = useCallback(() => {
    try {
      console.log('🔄 Attempting to activate MiniPlayer...', { accessControl, currentMode, isVisible, hasVideo: !!video });
      
      // Check if video exists
      if (!video) {
        console.log('❌ MiniPlayer activation failed - no video available');
        return;
      }
      
      // Validate access control
      if (!validateAccess('miniplayer')) {
        console.log('❌ MiniPlayer activation failed - access control');
        return;
      }
      
      console.log('✅ Activating MiniPlayer');
      
      // Update state
      setCurrentMode('miniplayer');
      setIsVisible(true);
      
      // Track analytics safely
      try {
        trackAnalytics('miniplayer_activated', { trigger: 'manual' });
      } catch (analyticsError) {
        console.warn('Analytics tracking failed:', analyticsError);
      }
      
      // Show success message
      toast.success('Mini-player activated! 🎥');
      
      // Navigate to homepage when MiniPlayer is activated
      if (onNavigateToHome && typeof onNavigateToHome === 'function') {
        setTimeout(() => {
          try {
            onNavigateToHome();
            toast.success('Navigated to homepage with MiniPlayer active');
          } catch (navError) {
            console.error('Navigation failed:', navError);
            toast.error('Failed to navigate to homepage');
          }
        }, 500); // Small delay to ensure MiniPlayer is visible before navigation
      }
    } catch (error) {
      console.error('MiniPlayer activation failed:', error);
      toast.error('Failed to activate MiniPlayer');
    }
  }, [video, validateAccess, accessControl, currentMode, isVisible, onNavigateToHome]);

  const exitMiniPlayer = useCallback(() => {
    console.log('🔄 Exiting MiniPlayer');
    setCurrentMode('theater');
    setIsVisible(false);
    trackAnalytics('miniplayer_deactivated');
    toast.success('MiniPlayer closed');
  }, []);

  const activateMultiPlayer = useCallback(async () => {
    if (!validateAccess('multiplayer') || !multiPlayerSupported) return;

    try {
      setIsMultiPlayerActive(true);
      setCurrentMode('multiplayer');
      toast.success('Multi-player mode activated');
      trackAnalytics('multiplayer_activated');
    } catch (error) {
      console.error('Failed to enter Multi-Player:', error);
      toast.error('Failed to activate Multi-Player mode');
      trackAnalytics('multiplayer_error', { error: (error as Error).message });
    }
  }, [accessControl, multiPlayerSupported]);

  const exitMultiPlayer = useCallback(async () => {
    if (!isMultiPlayerActive) return;

    try {
      setIsMultiPlayerActive(false);
      setCurrentMode('theater');
      toast.success('Multi-player mode deactivated');
      trackAnalytics('multiplayer_deactivated');
    } catch (error) {
      console.error('Failed to exit Multi-Player:', error);
    }
  }, [isMultiPlayerActive]);

  const toggleMiniPlayer = useCallback(() => {
    try {
      console.log('🎯 Toggle MiniPlayer clicked!', { currentMode, isVisible, accessControl });
      
      if (currentMode === 'miniplayer' && isVisible) {
        console.log('🔄 Exiting MiniPlayer (toggle)');
        exitMiniPlayer();
      } else {
        console.log('🔄 Activating MiniPlayer (toggle)');
        activateMiniPlayer();
      }
    } catch (error) {
      console.error('Toggle MiniPlayer failed:', error);
      toast.error('Failed to toggle MiniPlayer');
    }
  }, [currentMode, isVisible, activateMiniPlayer, exitMiniPlayer, accessControl]);

  const toggleMultiPlayer = useCallback(() => {
    if (isMultiPlayerActive) {
      exitMultiPlayer();
    } else {
      activateMultiPlayer();
    }
  }, [isMultiPlayerActive, activateMultiPlayer, exitMultiPlayer]);

  const switchToTheater = useCallback(() => {
    if (isMultiPlayerActive) {
      exitMultiPlayer();
    }
    setCurrentMode('theater');
    setIsVisible(false);
    onToggleTheater();
    trackAnalytics('theater_activated');
    toast.success('Switched to theater mode');
  }, [isMultiPlayerActive, exitMultiPlayer, onToggleTheater]);

  // Preference updates
  const updatePreferences = useCallback((updates: Partial<PlayerPreferences>) => {
    setPreferences(prev => ({ ...prev, ...updates }));
  }, []);

  const updateMiniPlayerPosition = useCallback((position: { x: number; y: number }) => {
    if (preferences.rememberPosition) {
      updatePreferences({ miniPlayerPosition: position });
    }
  }, [preferences.rememberPosition, updatePreferences]);

  const updateMiniPlayerSize = useCallback((size: 'small' | 'medium' | 'large') => {
    updatePreferences({ miniPlayerSize: size });
  }, [updatePreferences]);

  // Analytics tracking
  const trackAnalytics = useCallback((event: string, data?: any) => {
    // Implement your analytics tracking here
    console.log('Analytics:', event, data);
    
    // Example implementation:
    // analytics.track(event, {
    //   video_id: video.id,
    //   video_title: video.title,
    //   channel_name: video.channel.name,
    //   current_mode: currentMode,
    //   playback_time: playbackState.currentTime,
    //   ...data
    // });
  }, [video, currentMode, playbackState.currentTime]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isMultiPlayerActive) {
        exitMultiPlayer();
      }
      if (multiPlayerTransitionTimeoutRef.current) {
        clearTimeout(multiPlayerTransitionTimeoutRef.current);
      }
    };
  }, [isMultiPlayerActive, exitMultiPlayer]);

  // Validate that all functions are defined before returning
  const returnObject = {
    // State
    currentMode,
    isVisible,
    isMultiPlayerActive,
    multiPlayerSupported,
    preferences,
    accessControl,
    
    // Actions
    activateMiniPlayer,
    exitMiniPlayer,
    activateMultiPlayer,
    exitMultiPlayer,
    toggleMiniPlayer,
    toggleMultiPlayer,
    switchToTheater,
    
    // Preference management
    updatePreferences,
    updateMiniPlayerPosition,
    updateMiniPlayerSize,
    
    // Utility
    trackAnalytics,
    canUseMultiPlayer: multiPlayerSupported && accessControl.allowMultiPlayer,
    canUseMiniPlayer: accessControl.allowMiniPlayer
  };

  return returnObject;
}

// Utility functions removed - no longer needed

// Access control helper
export function createAccessControl(
  hasOverlays: boolean = false,
  isCreatorContent: boolean = false,
  hasSecureContent: boolean = false
): AccessControlConfig {
  // Disable MultiPlayer for creator-only overlays or secure content
  const allowMultiPlayer = !hasOverlays && !hasSecureContent;
  
  // Mini-player is generally more permissive but can be restricted for certain content
  const allowMiniPlayer = !hasSecureContent;
  
  let reason = '';
  if (hasOverlays) {
    reason = 'Interactive overlays require the full app experience';
  } else if (hasSecureContent) {
    reason = 'This content requires secure viewing in the main player';
  } else if (isCreatorContent) {
    reason = 'Creator content with interactive features';
  }
  
  return {
    allowMultiPlayer,
    allowMiniPlayer,
    reason,
    restrictedContent: hasSecureContent,
    creatorOnlyOverlay: hasOverlays && isCreatorContent
  };
}