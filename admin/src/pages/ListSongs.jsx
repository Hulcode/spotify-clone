import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { LucideTrash2 } from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/paths";
import { useNavigate } from "react-router-dom";

const ListSongs = () => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate;
  const fetchSongs = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get(API_PATHS.SONGS.ALL_SONGS);

      if (!data.success) {
        throw new Error(data.message || "Failed to fetch songs");
      }

      setSongs(data.songs || []);
    } catch (err) {
      console.error("Error fetching songs:", err);
      toast.error(err?.response?.data?.message || "Failed to load songs");
      setSongs([]);
      if (err?.response?.data?.message === "Do not have required permissions") {
        navigate("/register");
      }
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchSongs();
  }, []);
  const handleDelete = async (songId) => {
    if (!window.confirm("Are you sure you want to delete this song?")) {
      return;
    }

    try {
      const { data } = await axiosInstance.delete(
        API_PATHS.SONGS.DELETE(songId),
      );

      if (!data.success) {
        throw new Error(data.message || "Failed to delete song");
      }

      toast.success("Song deleted successfully");
      fetchSongs(); // Refresh the list
    } catch (err) {
      console.error("Error deleting song:", err);
      toast.error(err?.response?.data?.message || "Failed to delete song");
    }
  };

  if (loading) {
    return (
      <main className="flex-1 bg-[#f0faf2] flex items-center justify-center">
        <div className="text-gray-600">Loading songs...</div>
      </main>
    );
  }

  return (
    <main className="flex-1 bg-[#f0faf2] flex flex-col overflow-hidden">
      <div className="bg-white rounded-xl shadow-sm border border-[#e5efe7] overflow-hiddenflex-1 overflow-y-auto px-8 py-7">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#e5efe7] bg-[#f8fbf9]">
                <th className="table-head-item">Image</th>
                <th className="table-head-item">Name</th>
                <th className="table-head-item">Album</th>
                <th className="table-head-item">Duration</th>
                <th className="table-head-item">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e5efe7]">
              {songs.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    No songs found. Add your first song!
                  </td>
                </tr>
              ) : (
                songs.map((song) => (
                  <tr
                    key={song._id}
                    className="hover:bg-[#f8fbf9] transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="w-12 h-12 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                        {song.image ? (
                          <img
                            src={song.image}
                            alt={song.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                            <span className="text-xs">No img</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-gray-800">
                        {song.name}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {song?.album || "No Album"}
                    </td>
                    <td className="px-6 py-4 text-gray-600">{song.duration}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleDelete(song._id)}
                        className="text-gray-400 hover:text-red-500 text-xl font-light transition-colors"
                        aria-label="Delete song"
                      >
                        <LucideTrash2 />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
};

export default ListSongs;
