import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, SkipBack, SkipForward, Music, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import type { MusicTrack } from "@shared/schema";

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

  const { data: musicTracks = [] } = useQuery<MusicTrack[]>({
    queryKey: ["/api/music-tracks"],
  });

  // Build playlist from music tracks database
  const playlist = (() => {
    // If music tracks exist in database, use those
    if (musicTracks && musicTracks.length > 0) {
      const activeTracks = musicTracks.filter(track => track.isActive);
      if (activeTracks.length > 0) {
        return activeTracks.map(track => ({
          title: track.title,
          artist: track.artist || "Đám Cưới",
          src: track.filename,
          duration: track.duration ? `${Math.floor(track.duration / 60)}:${(track.duration % 60).toString().padStart(2, '0')}` : "--:--"
        }));
      }
    }

    // Fallback to default wedding playlist if no active custom tracks
    return [
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

  // Reload audio and restart playback when music tracks change
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Force reload audio element when tracks change
    audio.load();
    
    // Restart playback if music was playing
    if (isPlaying) {
      audio.play().catch(console.error);
    }
  }, [musicTracks]);

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

  // Auto-play after first user interaction
  useEffect(() => {
    const tryAutoPlay = async () => {
      const audio = audioRef.current;
      if (!audio) return;

      try {
        await audio.play();
        setIsPlaying(true);
      } catch (error) {
        // If autoplay fails, set up listeners for user interaction
        const enableAudio = async () => {
          try {
            await audio.play();
            setIsPlaying(true);
            // Remove listeners after successful play
            document.removeEventListener('click', enableAudio);
            document.removeEventListener('touchstart', enableAudio);
            document.removeEventListener('scroll', enableAudio);
          } catch (err) {
            console.error('Failed to play audio:', err);
          }
        };

        document.addEventListener('click', enableAudio, { once: true });
        document.addEventListener('touchstart', enableAudio, { once: true });
        document.addEventListener('scroll', enableAudio, { once: true });
      }
    };

    // Try to autoplay after a short delay
    const timer = setTimeout(tryAutoPlay, 1000);
    return () => clearTimeout(timer);
  }, []);

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
    if (isNaN(time)) return "0:00";
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
        autoPlay
        loop={playlist.length === 1}
      />

      {/* Music Player */}
      <motion.div
        className="fixed bottom-6 right-6 z-40"
        initial={{ scale: 0, opacity: 0, y: 100 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ 
          type: "spring",
          stiffness: 300,
          damping: 25,
          delay: 1.5
        }}
      >
        <motion.div
          className={`bg-white/95 backdrop-blur-xl border border-slate-200/60 shadow-2xl transition-all duration-500 ${
            isExpanded 
              ? "rounded-3xl w-[90vw] max-w-sm md:w-96" 
              : "rounded-2xl hover:rounded-3xl"
          }`}
          layout
        >
          {/* Compact View */}
          <AnimatePresence mode="wait">
            {!isExpanded ? (
              <motion.div
                key="compact"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="p-4"
              >
                <div className="flex items-center gap-3">
                  {/* Vinyl Record */}
                  <motion.div
                    className="relative cursor-pointer flex-shrink-0"
                    onClick={() => setIsExpanded(true)}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.div
                      className={`w-12 h-12 rounded-full bg-gradient-to-br from-rose-500 to-pink-500 border-4 border-white shadow-lg flex items-center justify-center ${
                        isPlaying ? "animate-spin-slow" : ""
                      }`}
                      animate={isPlaying ? { rotate: 360 } : {}}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    >
                      <div className="w-3 h-3 bg-white rounded-full shadow-inner" />
                    </motion.div>
                    <motion.div
                      className="absolute -top-1 -right-1 bg-rose-500 rounded-full p-1 shadow-lg border border-white"
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Music size={10} className="text-white" />
                    </motion.div>
                  </motion.div>

                  {/* Song Info */}
                  <div 
                    className="flex-1 min-w-0 cursor-pointer"
                    onClick={() => setIsExpanded(true)}
                  >
                    <p className="text-xs text-slate-500 truncate">Đang phát</p>
                    <p className="text-sm font-semibold text-slate-800 truncate">
                      {currentSong.title}
                    </p>
                    <p className="text-xs text-slate-600 truncate">
                      {currentSong.artist}
                    </p>
                  </div>

                  {/* Controls */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={togglePlay}
                      className="rounded-full w-10 h-10 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                      data-testid="button-toggle-music"
                    >
                      <motion.div
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.8 }}
                      >
                        {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                      </motion.div>
                    </Button>
                  </div>
                </div>
              </motion.div>
            ) : (
              /* Expanded View */
              <motion.div
                key="expanded"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="p-6"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <motion.h3 
                    className="font-semibold text-slate-800 flex items-center gap-3 text-lg"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-rose-500 to-pink-500 rounded-lg flex items-center justify-center">
                      <Music size={16} className="text-white" />
                    </div>
                    Wedding Playlist
                  </motion.h3>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setIsExpanded(false)}
                    className="rounded-full w-8 h-8 hover:bg-slate-100"
                  >
                    <motion.div 
                      whileHover={{ scale: 1.2, rotate: 90 }}
                      whileTap={{ scale: 0.8 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X size={16} />
                    </motion.div>
                  </Button>
                </div>

                {/* Vinyl and Song Info */}
                <motion.div 
                  className="flex items-center gap-5 mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <motion.div
                    className="flex-shrink-0 relative"
                    animate={isPlaying ? { rotate: 360 } : {}}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-rose-500 to-pink-500 border-4 border-white shadow-xl flex items-center justify-center relative">
                      {/* Vinyl grooves */}
                      <div className="absolute inset-0 rounded-full border-2 border-white/20" />
                      <div className="absolute inset-3 rounded-full border-2 border-white/15" />
                      <div className="absolute inset-6 rounded-full border-2 border-white/10" />
                      <div className="w-4 h-4 bg-white rounded-full shadow-inner z-10" />
                    </div>
                  </motion.div>
                  <div className="flex-1 min-w-0">
                    <motion.p 
                      className="font-bold text-slate-800 text-xl truncate mb-1"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      {currentSong.title}
                    </motion.p>
                    <motion.p 
                      className="text-slate-600 truncate mb-1"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      {currentSong.artist}
                    </motion.p>
                    <motion.p 
                      className="text-sm text-slate-500"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      {currentSong.duration}
                    </motion.p>
                  </div>
                </motion.div>

                {/* Progress Bar */}
                <motion.div 
                  className="mb-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <div
                    className="w-full h-2 bg-slate-200 rounded-full cursor-pointer mb-2"
                    onClick={handleProgressClick}
                  >
                    <motion.div
                      className="h-full bg-gradient-to-r from-rose-500 to-pink-500 rounded-full relative"
                      initial={{ width: 0 }}
                      animate={{ width: `${(currentTime / duration) * 100}%` }}
                      transition={{ duration: 0.1 }}
                    >
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg border border-slate-300" />
                    </motion.div>
                  </div>
                  <div className="flex justify-between text-sm text-slate-500">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </motion.div>

                {/* Controls */}
                <motion.div 
                  className="flex items-center justify-center gap-4 mb-6"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={prevSong}
                    className="rounded-full w-12 h-12 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                  >
                    <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.8 }}>
                      <SkipBack size={20} />
                    </motion.div>
                  </Button>
                  
                  <Button
                    size="icon"
                    onClick={togglePlay}
                    className="rounded-full w-16 h-16 bg-gradient-to-br from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 shadow-lg transition-all duration-300"
                  >
                    <motion.div 
                      whileHover={{ scale: 1.1 }} 
                      whileTap={{ scale: 0.9 }}
                      className="text-white"
                    >
                      {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
                    </motion.div>
                  </Button>
                  
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={nextSong}
                    className="rounded-full w-12 h-12 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                  >
                    <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.8 }}>
                      <SkipForward size={20} />
                    </motion.div>
                  </Button>
                </motion.div>

                {/* Volume and Playlist */}
                <motion.div 
                  className="space-y-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  {/* Volume Control */}
                  <div className="flex items-center gap-3">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={toggleMute}
                      className="rounded-full w-10 h-10 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                    >
                      <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.8 }}>
                        {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                      </motion.div>
                    </Button>
                    <div className="flex-1 h-2 bg-slate-200 rounded-full cursor-pointer">
                      <div className={`h-full bg-gradient-to-r from-rose-500 to-pink-500 rounded-full ${isMuted ? 'w-0' : 'w-3/4'}`} />
                    </div>
                  </div>

                  {/* Playlist */}
                  <div className="border-t border-slate-200 pt-4">
                    <h4 className="text-sm font-semibold text-slate-700 mb-3">Danh sách phát</h4>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {playlist.map((song, index) => (
                        <motion.div
                          key={song.title}
                          className={`p-3 rounded-xl cursor-pointer transition-all duration-300 ${
                            index === currentSongIndex
                              ? 'bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200 text-rose-700 font-semibold'
                              : 'hover:bg-slate-100 text-slate-700'
                          }`}
                          onClick={() => {
                            setCurrentSongIndex(index);
                            setIsPlaying(true);
                          }}
                          whileHover={{ x: 4 }}
                          transition={{ type: "spring", stiffness: 400 }}
                        >
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                              {index === currentSongIndex && isPlaying && (
                                <motion.div
                                  animate={{ scale: [1, 1.2, 1] }}
                                  transition={{ duration: 1, repeat: Infinity }}
                                  className="w-2 h-2 bg-rose-500 rounded-full"
                                />
                              )}
                              <span className="truncate text-sm">{song.title}</span>
                            </div>
                            <span className="text-xs text-slate-500 flex-shrink-0">
                              {song.duration}
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </>
  );
}