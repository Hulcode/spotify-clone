import { v2 as cloudinary } from "cloudinary";
import albumModel from "../model/Album.js";
import songModel from "../model/Song.js";

// ADD album
const addAlbum = async (req, res) => {
  const isAdmin = req.user.isAdmin;

  if (!isAdmin) {
    return res.status(400).json({ message: "Do not have required permitions" });
  }
  try {
    const { name, desc, bgColour } = req.body;

    const imageFile = req.files.image[0]; // from multer

    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
    });

    // Calculate duration from Cloudinary response

    const albumData = {
      name,
      desc,
      bgColour,
      image: imageUpload.secure_url,
    };

    const album = new albumModel(albumData);
    await album.save();

    res.json({ success: true, message: "Album Added" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// LIST SONGS
const listAlbum = async (req, res) => {
  try {
    const allAlbums = await albumModel.find();
    res.json({ success: true, albums: allAlbums });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const album = async (req, res) => {
  try {
    const album = await albumModel.findById(req.params.id);
    res.json({ success: true, album: album });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// REMOVE Album
const removeAlbum = async (req, res) => {
  const isAdmin = req.user.isAdmin;

  if (!isAdmin) {
    return res.status(400).json({ message: "Do not have required permitions" });
  }
  try {
    await albumModel.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "album Removed" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export { addAlbum, listAlbum, removeAlbum, album };
