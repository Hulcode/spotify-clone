// context/AudioPlayerContext.jsx

import { createContext, useContext, useEffect, useRef, useState } from "react";

const AudioPlayerContext = createContext();

export function AudioPlayerProvider({ children }) {
  const audioRef = useRef(new Audio());

  const [currentSong, setCurrentSong] = useState(null);
  const [playlist, setPlaylist] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  useEffect(() => {
    const audio = audioRef.current;
    if (currentIndex >= 0 && currentIndex < playlist.length) {
      playSong(playlist[currentIndex]);
    }
    const handleEnded = () => {
      if (currentIndex < playlist.length - 1) {
        const nextIndex = currentIndex + 1;

        setCurrentIndex(nextIndex);
        playSong(playlist[nextIndex]);
      }
    };

    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("ended", handleEnded);
    };
  }, [currentIndex, playlist]);
  useEffect(() => {
    const audio = audioRef.current;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration || 0);

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
    };
  }, []);
  const playSong = (song) => {
    if (audioRef.current.src !== song.file) {
      audioRef.current.src = song.file;
    }

    audioRef.current.play();

    setCurrentSong(song);
    setIsPlaying(true);
  };
  const playSongsList = (songs) => {
    if (!songs.length) return;

    setPlaylist(songs);
    setCurrentIndex(0);

    playSong(songs[0]);
  };
  const pauseSong = () => {
    audioRef.current.pause();
    setIsPlaying(false);
  };

  const resumeSong = () => {
    audioRef.current.play();
    setIsPlaying(true);
  };

  return (
    <AudioPlayerContext.Provider
      value={{
        currentSong,
        isPlaying,
        playSong,
        pauseSong,
        resumeSong,
        audioRef,
        playSongsList,
        currentIndex,
        duration,
        currentTime,
        setCurrentIndex,
        playlist,
        setPlaylist,
      }}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
}

export const useAudioPlayer = () => useContext(AudioPlayerContext);
