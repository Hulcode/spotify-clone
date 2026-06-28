import express from "express";
import {
  addAlbum,
  listAlbum,
  removeAlbum,
  album,
} from "../controllers/albumController.js";
import upload from "../middleware/multer.js";
import jwtCheck from "../middleware/jwtProtection.js";
const albumRouter = express.Router();

// upload.fields() accepts MULTIPLE files with different field names
albumRouter.post(
  "/add",

  upload.fields([{ name: "image", maxCount: 1 }]),
  addAlbum,
);

albumRouter.get("/list", listAlbum);
albumRouter.delete("/remove/:id", removeAlbum);
albumRouter.get("/:id", album);

export default albumRouter;
