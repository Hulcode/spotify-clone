import { Input } from "@/components/ui/input";
import {
  NativeSelect,
  NativeSelectOption,
  NativeSelectOptGroup,
} from "@/components/ui/native-select";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/paths";
import { useState, useEffect } from "react";
import { Music2, ImagePlus } from "lucide-react";
import UploadZone from "@/myComponents/UploadZone";
import { toast } from "react-toastify";
const AddSong = () => {
  const [songName, setSongName] = useState("");
  const [songDescription, setSongDescription] = useState("");
  const [album, setAlbum] = useState("");
  const [albums, setAlbums] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [songFile, setSongFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const handleSubmit = async () => {
    if (!songName.trim()) {
      return toast.error("Song name is required");
    }

    if (!songDescription.trim()) {
      return toast.error("Song description is required");
    }

    if (!songFile) {
      return toast.error("Please select a song file");
    }

    if (!imageFile) {
      return toast.error("Please select an image");
    }
    try {
      setLoading(true);
      const formData = new FormData();

      formData.append("name", songName);
      formData.append("desc", songDescription);
      formData.append("album", album);

      formData.append("audio", songFile);
      formData.append("image", imageFile);

      const { data } = await axiosInstance.post(API_PATHS.SONGS.ADD, formData);

      if (!data.success) {
        throw new Error(data.message || "Failed to add song");
      }

      toast.success("Song added successfully");

      // Reset form
      setSongName("");
      setSongDescription("");
      setAlbum("");
      setSongFile(null);
      setImageFile(null);
    } catch (err) {
      console.error("Error adding song:", err);

      toast.error(
        err?.response?.data?.message || err.message || "Failed to add song",
      );
    } finally {
      setLoading(false);
    }
  };
  const getAlbums = async () => {
    try {
      const { data } = await axiosInstance.get(API_PATHS.ALBUMS.ALL_ALBUMS);

      if (!data.success) {
        throw new Error(data.message || "Failed to fetch albums");
      }

      setAlbums(data.albums);
      console.log(data);
    } catch (err) {
      console.error("Error fetching albums:", err);

      setAlbums([]);
    }
  };
  useEffect(() => {
    getAlbums();
  }, []);

  return (
    <main className="flex-1 bg-[#f0faf2] flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto px-8 py-7">
        {/* Upload zones */}
        <div className="flex gap-4 mb-7">
          <UploadZone
            label="Upload song"
            icon={Music2}
            onFileSelect={setSongFile}
          />
          <UploadZone
            label="Upload Image"
            icon={ImagePlus}
            onFileSelect={setImageFile}
          />
        </div>

        {/* Song name */}
        <div className="mb-5">
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Song name
          </label>
          <Input
            value={songName}
            onChange={(e) => setSongName(e.target.value)}
            placeholder="Type here"
            className="max-w-xl border-[#c5e0c9] focus:border-[#1DB954] focus:ring-[#1DB954]/20 bg-white"
          />
        </div>

        {/* Song description */}
        <div className="mb-5">
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Song description
          </label>
          <Input
            value={songDescription}
            onChange={(e) => setSongDescription(e.target.value)}
            placeholder="Type here"
            className="max-w-xl border-[#c5e0c9] focus:border-[#1DB954] focus:ring-[#1DB954]/20 bg-white"
          />
        </div>

        {/* Album */}
        <div className="mb-7">
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Album
          </label>

          <NativeSelect
            value={album}
            onChange={(e) => setAlbum(e.target.value)}
          >
            <NativeSelectOptGroup>
              <NativeSelectOption value="">None</NativeSelectOption>

              {albums?.map((elment) => {
                return (
                  <NativeSelectOption key={elment._id} value={elment.name}>
                    {elment.name}
                  </NativeSelectOption>
                );
              })}
            </NativeSelectOptGroup>
          </NativeSelect>
        </div>

        {/* Submit */}
        <button
          disabled={loading}
          onClick={handleSubmit}
          className="px-9 py-3 bg-gray-900 text-white text-xs font-bold tracking-widest uppercase rounded-md
              hover:bg-[#1DB954] transition-colors active:scale-95"
        >
          {loading ? "Uploading..." : "ADD"}
        </button>
      </div>
    </main>
  );
};

export default AddSong;
