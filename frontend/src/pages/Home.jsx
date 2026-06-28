import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Music2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/paths";
import { useAudioPlayer } from "../context/AudioPlayerContext";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "../components/ui/carousel";

const fetchHomeData = async () => {
  const [songsRes, albumsRes] = await Promise.all([
    axiosInstance.get(API_PATHS.SONGS.ALL_SONGS),
    axiosInstance.get(API_PATHS.ALBUMS.ALL_ALBUMS),
  ]);

  return {
    songs: songsRes.data.songs || [],
    albums: albumsRes.data.albums || [],
  };
};

const Home = () => {
  const { playSong, setPlaylist } = useAudioPlayer();
  const navigate = useNavigate();

  const { data, isLoading, error } = useQuery({
    queryKey: ["home-data"],
    queryFn: fetchHomeData,
    staleTime: 1000 * 60 * 10, // Cache for 10 minutes
  });

  const songs = data?.songs ?? [];
  const albums = data?.albums ?? [];

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await axiosInstance.get("/api/auth/check");
      } catch {
        navigate("/login");
      }
    };

    checkAuth();
  }, [navigate]);

  if (isLoading) {
    return (
      <main className="flex-1 bg-[#121212] text-white p-8 flex items-center justify-center">
        Loading...
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex-1 bg-[#121212] text-white p-8 flex items-center justify-center">
        Failed to load data.
      </main>
    );
  }

  return (
    <main className="flex-1 bg-gradient-to-b from-[#1a1a1a] to-[#121212] text-white overflow-y-auto">
      <div className="px-6 py-4 md:px-8 md:py-6">
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">Featured Charts</h2>

          <Carousel opts={{ align: "start" }}>
            <CarouselContent>
              {albums.map((album) => (
                <CarouselItem
                  key={album._id}
                  className="basis-1/2 md:basis-1/3 lg:basis-1/6"
                >
                  <Link
                    to={`/album/${album._id}`}
                    className="block bg-[#181818] rounded-md p-4 hover:bg-[#282828] transition-colors"
                  >
                    <img
                      src={album.image}
                      alt={album.name}
                      className="w-full aspect-square object-cover rounded-md mb-3"
                    />

                    <p className="font-medium truncate">{album.name}</p>

                    <p className="text-xs text-gray-400 line-clamp-2">
                      {album.description}
                    </p>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Today's Biggest Hits</h2>

          <Carousel opts={{ align: "start" }}>
            <CarouselContent>
              {songs.map((song) => (
                <CarouselItem
                  key={song._id}
                  className="basis-1/2 md:basis-1/3 lg:basis-1/6"
                >
                  <div
                    onClick={() => {
                      setPlaylist([]);
                      playSong(song);
                    }}
                    className="bg-[#181818] rounded-md p-4 hover:bg-[#282828] transition-colors cursor-pointer"
                  >
                    <div className="aspect-square rounded-md overflow-hidden mb-3 bg-[#282828]">
                      {song.image ? (
                        <img
                          src={song.image}
                          alt={song.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Music2 className="w-8 h-8 text-white/50" />
                        </div>
                      )}
                    </div>

                    <p className="font-medium truncate">{song.name}</p>

                    <p className="text-xs text-gray-400 truncate">
                      {song.album || "Single"}
                    </p>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </section>
      </div>
    </main>
  );
};

export default Home;
