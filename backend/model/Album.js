import mongoose from "mongoose";

const albumSchema = new mongoose.Schema({
  name: { type: String, required: true },
  desc: { type: String, required: true },
  bgColour: { type: String, required: true }, // hex color for album page background
  image: { type: String, required: true }, // Cloudinary URL
});

const albumModel =
  mongoose.models.album || mongoose.model("album", albumSchema);
export default albumModel;
