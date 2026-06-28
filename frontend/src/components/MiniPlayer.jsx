import { useAudioPlayer } from "../context/AudioPlayerContext";
import { Play, Pause, SkipBack, SkipForward, Volume2 } from "lucide-react";

export default function MiniPlayer() {
  function toMAndS(timeSecond) {
    let seconds = Math.round(timeSecond % 60);
    let minetes = Math.floor(timeSecond / 60);

    return `${minetes <= 9 ? "0" : ""}${minetes}:${seconds <= 9 ? "0" : ""}${seconds}`;
  }
  const {
    currentSong,
    isPlaying,
    pauseSong,
    resumeSong,
    duration,
    currentTime,
    audioRef,
    setCurrentIndex,
    playlist,
    currentIndex,
  } = useAudioPlayer();

  if (!currentSong) return null;

  return (
    <div className="sticky bottom-0 left-0 right-0 z-50 h-20 bg-[#181818] border-t border-neutral-800 flex items-center px-6">
      {/* Left */}
      <div className="flex items-center gap-4 w-1/4">
        <img
          src={currentSong.image}
          alt={currentSong.name}
          className="w-14 h-14 rounded object-cover"
        />

        <div className="overflow-hidden">
          <p className="font-medium truncate text-white">{currentSong.name}</p>
        </div>
      </div>

      {/* Center */}
      <div className="flex flex-col items-center flex-1">
        <div className="flex items-center gap-5">
          <button
            onClick={() => {
              setCurrentIndex(
                currentIndex === 0 ? playlist.length - 1 : currentIndex - 1,
              );
            }}
          >
            <SkipBack size={20} />
          </button>

          <button
            onClick={isPlaying ? pauseSong : resumeSong}
            className="bg-white text-black rounded-full p-2"
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} fill="black" />}
          </button>

          <button
            onClick={() => {
              setCurrentIndex(
                currentIndex === playlist.length - 1 ? 0 : currentIndex + 1,
              );
            }}
          >
            <SkipForward size={20} />
          </button>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-3 mt-2 w-full max-w-xl">
          <span className="text-xs text-gray-400">{toMAndS(currentTime)}</span>

          <input
            type="range"
            min={0}
            max={duration}
            value={currentTime}
            className="flex-1"
            onChange={(e) => {
              audioRef.current.currentTime = Number(e.target.value);
            }}
          />

          <span className="text-xs text-gray-400">{toMAndS(duration)}</span>
        </div>
      </div>

      {/* Right */}
      <div className="w-1/4 flex items-center justify-end gap-3">
        <Volume2 className="w-5 h-5 text-gray-400" />

        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          defaultValue={1}
          className="w-28 accent-white"
          onChange={(e) => {
            audioRef.current.volume = Number(e.target.value);
          }}
        />
      </div>
    </div>
  );
}
