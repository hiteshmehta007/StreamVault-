# Reels Page Redesign Guide

## Overview
This guide explains how to redesign the ReelsPage.tsx component based on the "reels short" folder implementation.

## Key Design Features from "reels short"

### 1. **Vertical Scrolling Feed**
- Full-screen vertical video player
- Snap scrolling (one reel at a time)
- Smooth scroll behavior
- Hidden scrollbars for clean UI

### 2. **Glassmorphism UI**
- Backdrop blur effects (`backdrop-blur-xl`)
- Semi-transparent backgrounds (`bg-black/40`, `bg-white/10`)
- Border with opacity (`border-white/10`, `border-white/20`)
- Gradient overlays for readability

### 3. **Interactive Elements**
- Double-tap to like (shows heart animation)
- Single tap to toggle info overlay
- Smooth animations with Framer Motion
- Floating action buttons with glassmorphism

### 4. **Visual Hierarchy**
- Top: "For You" badge + LIVE indicator
- Bottom Left: Creator info, caption, category badge, stream link
- Bottom Right: Like/Comment/Share buttons (vertical stack)
- Top Right: Mute/unmute button
- Bottom: Progress bar

## Implementation Steps

### Step 1: Update ReelsPage.tsx Structure

Replace the entire file with this structure:

```typescript
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, MessageCircle, Share2, CheckCircle, Eye, Play, 
  MoreVertical, Volume2, VolumeX, Send, ChevronLeft
} from 'lucide-react';
import { Button } from './ui/button';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { toast } from 'sonner';

// Interfaces
interface ReelsPageProps {
  onNavigate: (page: string) => void;
}

interface ReelVideo {
  id: string;
  videoUrl: string;
  thumbnailUrl: string;
  creator: {
    id: string;
    username: string;
    avatar: string;
    isVerified: boolean;
    isLive?: boolean;
    viewerCount?: number;
  };
  caption: string;
  hashtags: string[];
  category: string;
  streamId?: string;
  clipTimestamp?: string;
  stats: {
    views: number;
    likes: number;
    comments: number;
    shares: number;
  };
  isLiked: boolean;
  isFollowing: boolean;
  createdAt: string;
  duration: number;
}

// Demo data - use local videos
const DEMO_REELS: ReelVideo[] = [
  // Add 6 reels using ./DemoReels/Video-XXX.mp4
  // Copy structure from mockData.ts in "reels short" folder
];

// ReelCard Component (nested inside ReelsPage.tsx)
function ReelCard({ reel, isActive, onLike, onFollow, onComment, onShare }) {
  // Component logic from reels short/ReelCard.tsx
  // Key features:
  // - Video auto-play when active
  // - Double-tap like animation
  // - Glassmorphism UI
  // - formatCount helper function
}

// Main ReelsPage Component
export function ReelsPage({ onNavigate }: ReelsPageProps) {
  // Feed logic from reels short/ReelsFeed.tsx
  // - Vertical scroll with snap
  // - Current index tracking
  // - Event handlers
}
```

### Step 2: Key Components to Copy

#### A. ReelCard Component Features:
1. **Video Player**
   - `<video>` with auto-play on active
   - Loop enabled
   - Mute control
   - Poster image (thumbnail)

2. **Double-Tap Animation**
   ```tsx
   <AnimatePresence>
     {showLikeAnimation && (
       <motion.div
         initial={{ scale: 0, opacity: 0 }}
         animate={{ scale: 1, opacity: 1 }}
         exit={{ scale: 1.2, opacity: 0 }}
       >
         <Heart className="w-28 h-28 fill-white text-white" />
       </motion.div>
     )}
   </AnimatePresence>
   ```

3. **Glassmorphism Buttons**
   ```tsx
   className="w-14 h-14 rounded-full backdrop-blur-xl bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center transition-all shadow-lg"
   ```

4. **Progress Bar**
   ```tsx
   <motion.div
     className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
     initial={{ width: '0%' }}
     animate={{ width: isActive ? '100%' : '0%' }}
     transition={{ duration: reel.duration, ease: 'linear' }}
   />
   ```

#### B. Feed Container:
```tsx
<div
  ref={containerRef}
  className="w-full h-full overflow-y-scroll snap-y snap-mandatory scroll-smooth"
  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
>
  <style>
    {`div::-webkit-scrollbar { display: none; }`}
  </style>
  {reelsData.map((reel, index) => (
    <div key={reel.id} className="w-full h-full snap-start">
      <ReelCard reel={reel} isActive={index === currentReelIndex} />
    </div>
  ))}
</div>
```

### Step 3: Update Demo Data

Use local videos from `./DemoReels/` folder:
- Video-153.mp4
- Video-163.mp4
- Video-210.mp4
- Video-270.mp4
- Video-379.mp4
- Video-508.mp4

### Step 4: CSS Classes Reference

**Glassmorphism Pattern:**
- Background: `bg-black/40` or `bg-white/10`
- Backdrop: `backdrop-blur-xl`
- Border: `border border-white/10` or `border-white/20`
- Shadow: `shadow-lg`

**Gradient Overlays:**
- Top: `bg-gradient-to-b from-black/60 via-transparent to-transparent`
- Bottom: `bg-gradient-to-b from-transparent to-black/90`

**Button Gradients:**
- Purple-Pink: `bg-gradient-to-r from-purple-600 to-pink-600`
- Hover: `hover:from-purple-700 hover:to-pink-700`

### Step 5: Animation Variants

**Stagger Animation (Bottom Content):**
```tsx
initial={{ x: -20, opacity: 0 }}
animate={{ x: 0, opacity: 1 }}
transition={{ delay: 0.05 * index }}
```

**Spring Animation (Action Buttons):**
```tsx
initial={{ scale: 0, opacity: 0 }}
animate={{ scale: 1, opacity: 1 }}
transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
```

### Step 6: Helper Functions

```typescript
const formatCount = (count: number): string => {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  } else if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
};
```

## Visual Layout Structure

```
┌─────────────────────────────────┐
│ [<] Reels              [≡]      │  <- Header (glassmorphism)
│                                 │
│  [For You]  [🔴 LIVE]          │  <- Top badges
│                                 │
│                                 │
│         VIDEO CONTENT           │
│                                 │
│  [@Username ✓]         [❤️ 524K]│  <- Bottom: Creator + Actions
│  Caption text...       [💬 18.9K]│
│  [VALORANT] [2:34:15]  [📤 12.4K]│
│  [Watch Full Stream]   [👤]     │
│                                 │
│ ▓▓▓▓▓▓▓░░░░░░░░░░░░░░░░░░░     │  <- Progress bar
└─────────────────────────────────┘

[🔊] <- Mute button (top right, always visible)
```

## Files to Reference

1. **reels short/src/components/ReelCard.tsx** - Complete card implementation
2. **reels short/src/components/ReelsFeed.tsx** - Feed container logic
3. **reels short/src/data/mockData.ts** - Demo data structure
4. **reels short/src/types/index.ts** - TypeScript interfaces

## Testing Checklist

- [ ] Videos auto-play when scrolled into view
- [ ] Double-tap shows heart animation
- [ ] Single tap toggles info overlay
- [ ] Mute button works
- [ ] Like/Follow buttons update state
- [ ] Smooth scroll snapping
- [ ] Progress bar animates with video duration
- [ ] Glassmorphism effects render correctly
- [ ] LIVE badge shows for live creators
- [ ] Viewer count displays correctly

## Notes

- The design prioritizes mobile-first vertical scrolling
- All interactive elements use glassmorphism for consistency
- Animations are smooth and performant using Framer Motion
- The UI auto-hides on tap for immersive viewing
- Videos use poster images as loading placeholders
