import { v2 as cloudinary } from "cloudinary";
import songModel from "../model/Song.js";
import albumModel from "../model/Album.js";

// ADD SONG
const addSong = async (req, res) => {
  try {
    const { name, desc, album } = req.body;
    const isAdmin = req.user.isAdmin;

    if (!isAdmin) {
      return res
        .status(400)
        .json({ message: "Do not have required permitions" });
    }
    console.log("start");
    const audioFile = req.files.audio[0]; // from multer
    const imageFile = req.files.image[0]; // from multer

    // Upload both files to Cloudinary
    const audioUpload = await cloudinary.uploader.upload(audioFile.path, {
      resource_type: "video", // Cloudinary uses 'video' for audio files
    });
    console.log("start 2");
    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
    });
    console.log("start 3");
    // Calculate duration from Cloudinary response
    const duration = `${Math.floor(audioUpload.duration / 60)}:${String(Math.floor(audioUpload.duration % 60)).padStart(2, "0")}`;

    const songData = {
      name,
      desc,
      album,
      image: imageUpload.secure_url,
      file: audioUpload.secure_url,
      duration,
    };

    const song = new songModel(songData);
    await song.save();
    console.log("start 4");
    res.json({ success: true, message: "Song Added" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const albumSongs = async (req, res) => {
  try {
    const albumId = req.params.id;

    if (!albumId) {
      return res.status(400).json({
        success: false,
        message: "Album ID is required",
      });
    }

    const album = await albumModel.findById(albumId);

    if (!album) {
      return res.status(404).json({
        success: false,
        message: "Album not found",
      });
    }

    const allSongs = await songModel.find({
      album: album.name,
    });

    res.json({
      success: true,
      songs: allSongs,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// LIST SONGS
const listSong = async (req, res) => {
  try {
    const allSongs = await songModel.find({});
    res.json({ success: true, songs: allSongs });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// REMOVE SONG
const removeSong = async (req, res) => {
  const isAdmin = req.user.isAdmin;

  if (!isAdmin) {
    return res
      .status(403)
      .json({ message: "Do not have required permissions" });
  }

  try {
    const songId = req.params.id;

    if (!songId) {
      return res.status(400).json({
        success: false,
        message: "Song ID is required",
      });
    }

    // Find the song first to get file IDs
    const song = await songModel.findById(songId);
    if (!song) {
      return res.status(404).json({
        success: false,
        message: "Song not found",
      });
    }

    // Delete files from Cloudinary (if you're using it)
    if (song.audioPublicId) {
      await cloudinary.uploader.destroy(song.audioPublicId, {
        resource_type: "video",
      });
    }

    if (song.imagePublicId) {
      await cloudinary.uploader.destroy(song.imagePublicId, {
        resource_type: "image",
      });
    }

    // Delete from database
    await songModel.findByIdAndDelete(songId);

    res.json({
      success: true,
      message: "Song removed successfully",
    });
  } catch (error) {
    console.error("Error removing song:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

export { addSong, listSong, removeSong, albumSongs };
