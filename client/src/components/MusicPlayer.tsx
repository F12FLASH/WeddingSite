import { useState } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  return (
    <div className="fixed bottom-8 right-8 z-40 animate-scale-in">
      <div className="bg-card/90 backdrop-blur-md rounded-2xl p-4 border border-card-border shadow-2xl">
        <div className="flex items-center gap-3">
          {/* Vinyl Record */}
          <div className="relative">
            <div
              className={`w-12 h-12 rounded-full bg-gradient-to-br from-primary via-primary/80 to-primary/60 border-4 border-card flex items-center justify-center ${
                isPlaying ? "animate-spin-slow" : ""
              }`}
            >
              <div className="w-2 h-2 bg-card rounded-full" />
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setIsPlaying(!isPlaying)}
              className="rounded-full"
              data-testid="button-toggle-music"
            >
              {isPlaying ? <Pause size={18} /> : <Play size={18} />}
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setIsMuted(!isMuted)}
              className="rounded-full"
              data-testid="button-toggle-mute"
            >
              {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </Button>
          </div>

          {/* Now Playing */}
          <div className="hidden md:block">
            <p className="text-xs text-muted-foreground">Đang Phát</p>
            <p className="text-sm font-medium text-foreground">
              A Thousand Years
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
