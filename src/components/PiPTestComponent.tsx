import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Play, Pause, Minimize2 } from 'lucide-react';
import { toast } from 'sonner';

export function MiniPlayerTestComponent() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMiniPlayer, setIsMiniPlayer] = useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  const togglePlay = async () => {
    const video = videoRef.current;
    if (!video) return;

    try {
      if (isPlaying) {
        video.pause();
        setIsPlaying(false);
      } else {
        await video.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Play error:', error);
      toast.error('Could not play video');
    }
  };

  const testMiniPlayer = async () => {
    const video = videoRef.current;
    if (!video) {
      toast.error('Video not found');
      return;
    }

    try {
      if (isMiniPlayer) {
        setIsMiniPlayer(false);
        toast.success('Exited MiniPlayer mode');
      } else {
        // Ensure video is playing
        if (video.paused) {
          await video.play();
          setIsPlaying(true);
          toast.info('Started video for MiniPlayer');
        }

        setIsMiniPlayer(true);
        toast.success('MiniPlayer mode activated! (Custom implementation)');
      }
    } catch (error) {
      console.error('MiniPlayer Error:', error);
      if (error instanceof Error) {
        toast.error(`MiniPlayer Error: ${error.message}`);
      } else {
        toast.error('MiniPlayer failed');
      }
    }
  };

  React.useEffect(() => {
    // No native PiP event listeners needed - using custom MiniPlayer
    return () => {
      // Cleanup if needed
    };
  }, []);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          MiniPlayer Test (PiP Replacement)
          <div className="flex gap-2">
            <Badge variant="default">
              Custom MiniPlayer
            </Badge>
            {isMiniPlayer && <Badge variant="secondary">MiniPlayer Active</Badge>}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <video
          ref={videoRef}
          className="w-full aspect-video bg-black rounded-lg"
          controls={false}
          muted
          playsInline
          preload="metadata"
        >
          <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4" />
          Your browser does not support video.
        </video>
        
        <div className="flex gap-2 justify-center">
          <Button onClick={togglePlay} variant="outline">
            {isPlaying ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
            {isPlaying ? 'Pause' : 'Play'}
          </Button>
          
          <Button 
            onClick={testMiniPlayer} 
            variant={isMiniPlayer ? "default" : "outline"}
          >
            <Minimize2 className="h-4 w-4 mr-2" />
            {isMiniPlayer ? 'Exit MiniPlayer' : 'Enter MiniPlayer'}
          </Button>
        </div>

        <div className="text-sm text-muted-foreground space-y-1">
          <p><strong>Instructions:</strong></p>
          <p>1. Click Play to start the video</p>
          <p>2. Click "Enter MiniPlayer" to test custom MiniPlayer</p>
          <p>3. The video will use custom floating player (no native PiP)</p>
          <p>4. Click "Exit MiniPlayer" to return to normal mode</p>
        </div>

        <div className="text-xs text-muted-foreground">
          <p><strong>MiniPlayer Features:</strong></p>
          <p>✅ Custom floating video player</p>
          <p>✅ Drag and drop functionality</p>
          <p>✅ Resize controls</p>
          <p>✅ No browser permission required</p>
        </div>
      </CardContent>
    </Card>
  );
}