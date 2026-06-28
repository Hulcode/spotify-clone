import { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { Play, Clock, Music2, ListMusic, ArrowLeft } from "lucide-react";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/paths";
import { useAudioPlayer } from "../context/AudioPlayerContext";
import { useQuery } from "@tanstack/react-query";
const fetchAlbumData = async (id) => {
  const [albumsRes, albumSongsRes] = await Promise.all([
    axiosInstance.get(`${API_PATHS.ALBUMS.GET_ALBUM}/${id}`),
    axiosInstance.get(`${API_PATHS.SONGS.GET_ALBUM_SONGS}/${id}`),
  ]);

  return {
    songs: albumSongsRes.data.songs || [],
    album: albumsRes.data.album || [],
  };
};
const AlbumDisplay = () => {
  const { id } = useParams();

  const {
    playSong,
    playSongsList,
    currentIndex,
    setCurrentIndex,
    setPlaylist,
    isPlaying,
  } = useAudioPlayer();

  const { data, isLoading, error } = useQuery({
    queryKey: ["album", id],
    queryFn: () => fetchAlbumData(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
  });
  const songs = data?.songs ?? [];
  const album = data?.album;
  const totalDuration = useMemo(() => {
    let totalSeconds = 0;

    for (const song of songs) {
      const [minutes, seconds] = song.duration.split(":").map(Number);
      totalSeconds += minutes * 60 + seconds;
    }

    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }, [songs]);
  const handlePlaySong = (index) => {
    setPlaylist(songs);
    playSong(songs[index]);
    setCurrentIndex(index);
  };
  const handlePlaySongsList = (songs) => {
    playSongsList(songs);
    console.log(totalDuration);
  };
  if (isLoading) {
    return (
      <main className="flex-1 bg-gradient-to-b from-[#1a1a1a] to-[#121212] text-white overflow-y-auto">
        <div className="flex items-center justify-center h-full">
          <div className="text-gray-400">Loading...</div>
        </div>
      </main>
    );
  }

  if (error || !album) {
    return (
      <main className="flex-1 bg-gradient-to-b from-[#1a1a1a] to-[#121212] text-white overflow-y-auto">
        <div className="flex flex-col items-center justify-center h-full gap-4">
          <p className="text-red-400">{error || "Album not found"}</p>
          <Link
            to="/"
            className="px-4 py-2 bg-[#1DB954] text-black rounded-full hover:scale-105 transition-transform"
          >
            Go Home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main
      className={`flex-1 bg-gradient-to-b  text-white overflow-y-auto`}
      style={{
        backgroundImage: `linear-gradient(to bottom, #1a1a1a, ${album.bgColour})`,
      }}
    >
      {/* Back Button */}
      <div className="sticky top-0 z-10 px-6 py-4 bg-gradient-to-b from-[#1a1a1a] to-transparent">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm">Back</span>
        </Link>
      </div>

      <div className="px-6 pb-8">
        {/* Album Header */}
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          {/* Album Art */}
          <div className="flex-shrink-0">
            <div className="w-48 h-48 md:w-56 md:h-56 rounded-md overflow-hidden shadow-2xl">
              {album.image ? (
                <img
                  src={album.image}
                  alt={album.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#1DB954] to-[#1ed760]">
                  <ListMusic className="w-16 h-16 text-white/50" />
                </div>
              )}
            </div>
          </div>

          {/* Album Info */}
          <div className="flex flex-col justify-end flex-1">
            <p className="text-sm text-white/80 uppercase tracking-wider mb-2">
              "Album"
            </p>
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              {album.name}
            </h1>
            <p className="text-sm text-gray-400 line-clamp-2 mb-4">
              {album.description || ""}
            </p>

            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span className="font-bold text-white">
                {album.artist || "Various Artists"}
              </span>
              <span>•</span>
              <span>{songs.length} songs</span>
              {totalDuration && (
                <>
                  <span>•</span>
                  <span>about {totalDuration} min</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => {
              handlePlaySongsList(songs);
            }}
            className="bg-[#1DB954] hover:bg-[#1ed760] text-black font-bold py-2 px-8 rounded-full flex items-center gap-2 transition-all hover:scale-105"
          >
            <Play className="w-5 h-5" fill="black" />
            Play
          </button>
        </div>

        {/* Songs List */}
        <div className="bg-[#121212] rounded-md">
          {/* Header */}
          <div className="grid grid-cols-12 gap-4 px-4 py-3 border-b border-gray-800 text-xs text-gray-400 uppercase tracking-wider">
            <div className="col-span-1 text-center">#</div>
            <div className="col-span-5">Title</div>
            <div className="col-span-3 hidden md:block">Album</div>
            <div className="col-span-2 hidden md:block text-right">
              Date Added
            </div>
            <div className="col-span-1 text-right">
              <Clock className="w-4 h-4 inline" />
            </div>
          </div>

          {/* Song Rows */}
          {songs.map((song, index) => (
            <div
              key={song._id || index}
              className={`group grid grid-cols-12 gap-4 px-4 py-2 hover:bg-[#2a2a2a] transition-colors rounded-md cursor-pointer ${
                currentIndex === index && isPlaying ? "bg-[#2a2a2a]" : ""
              }`}
              onClick={() => handlePlaySong(index)}
            >
              <div className="col-span-1 flex items-center justify-center text-sm text-gray-400">
                {index + 1}
              </div>

              <div className="col-span-5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-md overflow-hidden flex-shrink-0 bg-[#282828]">
                  {song.image ? (
                    <img
                      src={song.image}
                      alt={song.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#1DB954] to-[#1ed760]">
                      <Music2 className="w-4 h-4 text-white/50" />
                    </div>
                  )}
                </div>
                <div>
                  <p
                    className={`text-sm font-medium ${
                      currentIndex === index && isPlaying
                        ? "text-[#1DB954]"
                        : "text-white"
                    }`}
                  >
                    {song.name}
                  </p>
                </div>
              </div>

              <div className="col-span-3 hidden md:flex items-center text-sm text-gray-400">
                {song.album}
              </div>

              <div className="col-span-2 hidden md:flex items-center text-sm text-gray-400 justify-end">
                {new Date(song.updatedAt).toLocaleDateString()}
              </div>

              <div className="col-span-1 flex items-center justify-end text-sm text-gray-400">
                {song.duration}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default AlbumDisplay;
