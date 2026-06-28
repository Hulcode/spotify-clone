import { Input } from "@/components/ui/input";

import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/paths";
import { useState } from "react";
import { ImagePlus } from "lucide-react";
import UploadZone from "@/myComponents/UploadZone";
import { toast } from "react-toastify";
const AddAlbum = () => {
  const [album, setAlbum] = useState("");
  const [albumDescription, setAlbumDescription] = useState("");

  const [imageFile, setImageFile] = useState(null);
  const [color, setColor] = useState(null);
  const [loading, setLoading] = useState(false);
  const handleSubmit = async () => {
    if (!album.trim()) {
      return toast.error("Album name is required");
    }

    if (!albumDescription.trim()) {
      return toast.error("Album description is required");
    }

    if (!imageFile) {
      return toast.error("Please select an image");
    }
    try {
      setLoading(true);
      const formData = new FormData();

      formData.append("name", album);
      formData.append("desc", albumDescription);
      formData.append("bgColour", color);

      formData.append("image", imageFile);

      const { data } = await axiosInstance.post(API_PATHS.ALBUMS.ADD, formData);

      if (!data.success) {
        throw new Error(data.message || "Failed to add album");
      }

      toast.success("Album added successfully");

      // Reset form
      setAlbum("");
      setAlbumDescription("");
      setColor(null);

      setImageFile(null);
    } catch (err) {
      console.error("Error adding album:", err);

      toast.error(
        err?.response?.data?.message || err.message || "Failed to add album",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex-1 bg-[#f0faf2] flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto px-8 py-7">
        {/* Upload zones */}

        <UploadZone
          label="Upload Image"
          icon={ImagePlus}
          onFileSelect={setImageFile}
        />

        {/* Song name */}
        <div className="my-5">
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Album name
          </label>
          <Input
            value={album}
            onChange={(e) => setAlbum(e.target.value)}
            placeholder="Type here"
            className="max-w-xl border-[#c5e0c9] focus:border-[#1DB954] focus:ring-[#1DB954]/20 bg-white"
          />
        </div>

        {/* Song description */}
        <div className="mb-5">
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Album description
          </label>
          <Input
            value={albumDescription}
            onChange={(e) => setAlbumDescription(e.target.value)}
            placeholder="Type here"
            className="max-w-xl border-[#c5e0c9] focus:border-[#1DB954] focus:ring-[#1DB954]/20 bg-white"
          />
        </div>

        {/* Album */}
        <div className="mb-7">
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Background color
          </label>

          <div className="flex items-center gap-4 max-w-xl">
            <Input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-20 h-12 p-1 cursor-pointer border-[#c5e0c9]"
            />

            <Input
              value={color}
              onChange={(e) => setColor(e.target.value)}
              placeholder="#1DB954"
              className="border-[#c5e0c9] focus:border-[#1DB954] focus:ring-[#1DB954]/20"
            />
          </div>
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

export default AddAlbum;
