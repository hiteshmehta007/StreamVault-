import { useState, useRef, useEffect } from "react";
import { ReelCard } from "./ReelCard";
import { Reel } from "../types";

interface ReelsFeedProps {
  reels: Reel[];
}

export function ReelsFeed({ reels }: ReelsFeedProps) {
  const [currentReelIndex, setCurrentReelIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [reelsData, setReelsData] = useState(reels);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollPosition = container.scrollTop;
      const reelHeight = container.clientHeight;
      const newIndex = Math.round(scrollPosition / reelHeight);
      
      if (newIndex !== currentReelIndex && newIndex >= 0 && newIndex < reels.length) {
        setCurrentReelIndex(newIndex);
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [currentReelIndex, reels.length]);

  const handleLike = (id: string) => {
    setReelsData((prev) =>
      prev.map((reel) =>
        reel.id === id
          ? {
              ...reel,
              isLiked: !reel.isLiked,
              stats: {
                ...reel.stats,
                likes: reel.isLiked ? reel.stats.likes - 1 : reel.stats.likes + 1,
              },
            }
          : reel
      )
    );
  };

  const handleFollow = (userId: string) => {
    setReelsData((prev) =>
      prev.map((reel) =>
        reel.creator.id === userId
          ? { ...reel, isFollowing: !reel.isFollowing }
          : reel
      )
    );
  };

  const handleComment = (id: string) => {
    console.log("Open comments for reel:", id);
    // In a real app, this would open a comments drawer/modal
  };

  const handleShare = (id: string) => {
    console.log("Share reel:", id);
    // In a real app, this would open a share sheet
  };

  return (
    <div
      ref={containerRef}
      className="w-full h-full overflow-y-scroll snap-y snap-mandatory scroll-smooth"
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      <style>
        {`
          div::-webkit-scrollbar {
            display: none;
          }
        `}
      </style>
      {reelsData.map((reel, index) => (
        <div key={reel.id} className="w-full h-full snap-start">
          <ReelCard
            reel={reel}
            isActive={index === currentReelIndex}
            onLike={handleLike}
            onFollow={handleFollow}
            onComment={handleComment}
            onShare={handleShare}
          />
        </div>
      ))}
    </div>
  );
}
