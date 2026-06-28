import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { LucideTrash2 } from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/paths";
import { useNavigate } from "react-router-dom";

const ListAlbums = () => {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const fetchAlbums = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get(API_PATHS.ALBUMS.ALL_ALBUMS);

      if (!data.success) {
        throw new Error(data.message || "Failed to fetch songs");
      }

      setAlbums(data.albums || []);
    } catch (err) {
      console.error("Error fetching songs:", err);
      toast.error(err?.response?.data?.message || "Failed to load songs");
      setAlbums([]);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchAlbums();
  }, []);
  const handleDelete = async (albumId) => {
    try {
      const { data } = await axiosInstance.delete(
        API_PATHS.ALBUMS.DELETE(albumId),
      );

      if (!data.success) {
        throw new Error(data.message || "Failed to delete album");
      }

      toast.success("Album deleted successfully");
      fetchAlbums(); // Refresh the list
    } catch (err) {
      console.error("Error deleting album:", err);
      toast.error(err?.response?.data?.message || "Failed to delete album");
      if (err?.response?.data?.message === "Do not have required permissions") {
        navigate("/register");
      }
    }
  };

  if (loading) {
    return (
      <main className="flex-1 bg-[#f0faf2] flex items-center justify-center">
        <div className="text-gray-600">Loading albums...</div>
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
                <th className="table-head-item">Description</th>
                <th className="table-head-item">Album Color</th>
                <th className="table-head-item">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e5efe7]">
              {albums.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    No albums found. Add your first album!
                  </td>
                </tr>
              ) : (
                albums.map((album) => (
                  <tr
                    key={album._id}
                    className="hover:bg-[#f8fbf9] transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="w-12 h-12 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                        {album.image ? (
                          <img
                            src={album.image}
                            alt={album.name}
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
                        {album.name}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {album.desc || "No description"}
                    </td>
                    <td className=" w-full flex py-6 px-6 justify-center">
                      <span
                        className="w-12 h-8 block"
                        style={{ backgroundColor: album.bgColour || "#cccccc" }}
                      ></span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleDelete(album._id)}
                        className="text-gray-400 hover:text-red-500 text-xl font-light transition-colors"
                        aria-label="Delete album"
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

export default ListAlbums;
