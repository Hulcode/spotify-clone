import express from "express";
import {
  addSong,
  listSong,
  removeSong,
  albumSongs,
} from "../controllers/songController.js";
import upload from "../middleware/multer.js";
import jwtCheck from "../middleware/jwtProtection.js";

const songRouter = express.Router();

// upload.fields() accepts MULTIPLE files with different field names
songRouter.post(
  "/add",

  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "audio", maxCount: 1 },
  ]),
  addSong,
);

songRouter.get("/list", listSong);
songRouter.delete("/remove/:id", removeSong);
songRouter.get("/album-songs/:id", albumSongs);
export default songRouter;
