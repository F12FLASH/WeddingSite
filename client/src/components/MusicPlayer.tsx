import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, SkipBack, SkipForward, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import type { Settings } from "@shared/schema";

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(() => {
    const saved = localStorage.getItem('musicPlayer_isPlaying');
    return saved === 'true';
  });
  const [isMuted, setIsMuted] = useState(() => {
    const saved = localStorage.getItem('musicPlayer_isMuted');
    return saved === 'true';
  });
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(() => {
    const saved = localStorage.getItem('musicPlayer_currentSongIndex');
    return saved ? parseInt(saved, 10) : 0;
  });
  const audioRef = useRef<HTMLAudioElement>(null);

  const { data: settings } = useQuery<Settings | null>({
    queryKey: ["/api/settings"],
  });

  // Build playlist - use custom music from settings if available
  const playlist = (() => {
    const defaultPlaylist = [
      {
        title: "A Thousand Years",
        artist: "Christina Perri",
        src: "/music/a-thousand-years.mp3",
        duration: "4:45"
      },
      {
        title: "Perfect",
        artist: "Ed Sheeran",
        src: "/music/perfect.mp3",
        duration: "4:23"
      },
      {
        title: "Can't Help Falling In Love",
        artist: "Kina Grannis",
        src: "/music/cant-help-falling-in-love.mp3",
        duration: "3:21"
      },
      {
        title: "Marry Me",
        artist: "Train",
        src: "/music/marry-me.mp3",
        duration: "3:52"
      }
    ];

    // If custom background music URL is set in settings, add it as the first song
    if (settings?.backgroundMusicUrl) {
      const customSong = {
        title: "Nhạc Nền Đám Cưới",
        artist: "Custom",
        src: settings.backgroundMusicUrl,
        duration: "--:--"
      };
      return [customSong, ...defaultPlaylist];
    }

    return defaultPlaylist;
  })();

  // Validate and clamp currentSongIndex to prevent crashes when playlist length changes
  useEffect(() => {
    if (currentSongIndex >= playlist.length) {
      setCurrentSongIndex(0);
    }
  }, [playlist.length, currentSongIndex]);

  const currentSong = playlist[currentSongIndex] || playlist[0];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.play().catch(console.error);
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  // Reload audio and restart playback when backgroundMusicUrl changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Force reload audio element when URL changes
    audio.load();
    
    // Restart playback if music was playing
    if (isPlaying) {
      audio.play().catch(console.error);
    }
  }, [settings?.backgroundMusicUrl]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.muted = isMuted;
  }, [isMuted]);

  // Persist state to localStorage
  useEffect(() => {
    localStorage.setItem('musicPlayer_isPlaying', String(isPlaying));
  }, [isPlaying]);

  useEffect(() => {
    localStorage.setItem('musicPlayer_isMuted', String(isMuted));
  }, [isMuted]);

  useEffect(() => {
    localStorage.setItem('musicPlayer_currentSongIndex', String(currentSongIndex));
  }, [currentSongIndex]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const nextSong = () => {
    setCurrentSongIndex((prev) => (prev + 1) % playlist.length);
    setIsPlaying(true);
  };

  const prevSong = () => {
    setCurrentSongIndex((prev) => (prev - 1 + playlist.length) % playlist.length);
    setIsPlaying(true);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    audio.currentTime = percent * duration;
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <>
      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        src={currentSong.src}
        onEnded={nextSong}
        preload="metadata"
      />

      {/* Music Player */}
      <motion.div
        className="fixed bottom-6 right-6 z-40"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          type: "spring",
          stiffness: 300,
          damping: 20,
          delay: 2 
        }}
      >
        <motion.div
          className={`bg-card/95 backdrop-blur-xl border border-card-border/50 shadow-2xl transition-all duration-300 ${
            isExpanded ? "rounded-2xl w-80" : "rounded-2xl"
          }`}
          layout
        >
          {/* Compact View */}
          <AnimatePresence mode="wait">
            {!isExpanded ? (
              <motion.div
                key="compact"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-4"
              >
                <div className="flex items-center gap-3">
                  {/* Vinyl Record */}
                  <motion.div
                    className="relative cursor-pointer"
                    onClick={() => setIsExpanded(true)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.div
                      className={`w-12 h-12 rounded-full bg-gradient-to-br from-primary via-primary/80 to-primary/60 border-4 border-card shadow-lg flex items-center justify-center ${
                        isPlaying ? "animate-spin-slow" : ""
                      }`}
                      animate={isPlaying ? { rotate: 360 } : {}}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    >
                      <div className="w-2 h-2 bg-card rounded-full" />
                    </motion.div>
                    <motion.div
                      className="absolute -top-1 -right-1 bg-primary rounded-full p-1 shadow-lg"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Music size={10} className="text-white" />
                    </motion.div>
                  </motion.div>

                  {/* Controls */}
                  <div className="flex items-center gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={togglePlay}
                      className="rounded-full w-8 h-8"
                      data-testid="button-toggle-music"
                    >
                      <motion.div
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.8 }}
                      >
                        {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                      </motion.div>
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={toggleMute}
                      className="rounded-full w-8 h-8"
                      data-testid="button-toggle-mute"
                    >
                      <motion.div
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.8 }}
                      >
                        {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                      </motion.div>
                    </Button>
                  </div>

                  {/* Now Playing - Compact */}
                  <div 
                    className="flex-1 min-w-0 cursor-pointer"
                    onClick={() => setIsExpanded(true)}
                  >
                    <p className="text-xs text-muted-foreground truncate">Đang Phát</p>
                    <p className="text-sm font-medium text-foreground truncate">
                      {currentSong.title}
                    </p>
                  </div>
                </div>
              </motion.div>
            ) : (
              /* Expanded View */
              <motion.div
                key="expanded"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-6"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-foreground flex items-center gap-2">
                    <Music size={16} />
                    Wedding Playlist
                  </h3>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setIsExpanded(false)}
                    className="rounded-full w-6 h-6"
                  >
                    <motion.div whileHover={{ rotate: 90 }} transition={{ duration: 0.2 }}>
                      <Pause size={12} />
                    </motion.div>
                  </Button>
                </div>

                {/* Vinyl and Song Info */}
                <div className="flex items-center gap-4 mb-6">
                  <motion.div
                    className="flex-shrink-0"
                    animate={isPlaying ? { rotate: 360 } : {}}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  >
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary via-primary/80 to-primary/60 border-4 border-card shadow-xl flex items-center justify-center">
                      <div className="w-3 h-3 bg-card rounded-full" />
                    </div>
                  </motion.div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground text-lg truncate">
                      {currentSong.title}
                    </p>
                    <p className="text-sm text-muted-foreground truncate">
                      {currentSong.artist}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {currentSong.duration}
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div
                    className="w-full h-1 bg-muted rounded-full cursor-pointer"
                    onClick={handleProgressClick}
                  >
                    <motion.div
                      className="h-full bg-primary rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${(currentTime / duration) * 100}%` }}
                      transition={{ duration: 0.1 }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={prevSong}
                    className="rounded-full"
                  >
                    <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.8 }}>
                      <SkipBack size={16} />
                    </motion.div>
                  </Button>
                  
                  <Button
                    size="icon"
                    onClick={togglePlay}
                    className="rounded-full w-12 h-12 bg-primary hover:bg-primary/90"
                  >
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                      {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                    </motion.div>
                  </Button>
                  
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={nextSong}
                    className="rounded-full"
                  >
                    <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.8 }}>
                      <SkipForward size={16} />
                    </motion.div>
                  </Button>
                </div>

                {/* Volume and Mute */}
                <div className="flex items-center gap-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={toggleMute}
                    className="rounded-full w-8 h-8"
                  >
                    <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.8 }}>
                      {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                    </motion.div>
                  </Button>
                  <div className="flex-1 h-1 bg-muted rounded-full">
                    <div className="h-full bg-primary rounded-full w-3/4" />
                  </div>
                </div>

                {/* Playlist */}
                <div className="mt-4 space-y-2 max-h-32 overflow-y-auto">
                  {playlist.map((song, index) => (
                    <motion.div
                      key={song.title}
                      className={`p-2 rounded-lg cursor-pointer text-sm ${
                        index === currentSongIndex
                          ? 'bg-primary/10 text-primary font-medium'
                          : 'hover:bg-muted/50'
                      }`}
                      onClick={() => {
                        setCurrentSongIndex(index);
                        setIsPlaying(true);
                      }}
                      whileHover={{ x: 4 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <div className="flex justify-between items-center">
                        <span className="truncate">{song.title}</span>
                        <span className="text-xs text-muted-foreground">
                          {song.duration}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </>
  );
}