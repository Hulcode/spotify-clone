import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import { v2 as cloudinary } from "cloudinary";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import songRouter from "./routes/songRoute.js";
import albumRouter from "./routes/albumRouter.js";
import authRouter from "./routes/authRoutes.js";
import cookieParser from "cookie-parser";
import jwtCheck from "./middleware/jwtProtection.js";
import jwt from "jsonwebtoken";
// App config

const app = express();
const port = process.env.PORT || 4000;

// Connect services
connectDB();
connectCloudinary();

// Middlewares
app.use(express.json());

app.use(
  cors({
    origin: [
      process.env.CLIENT_URL || "http://localhost:5173",
      process.env.ADMIN_URL || "http://localhost:5174",
    ],
    credentials: true,
  }),
);
app.use(cookieParser());

// Routes
app.use("/api/song", jwtCheck, songRouter);
app.use("/api/album", jwtCheck, albumRouter);
app.use("/api/auth", authRouter);
// Test route
app.get("/api/auth/check", (req, res) => {
  const token = req.cookies.jwt;

  if (!token) {
    return res.status(401).json({
      success: false,
    });
  }

  try {
    jwt.verify(token, process.env.JWT_AUTH);

    return res.status(200).json({
      success: true,
    });
  } catch (err) {
    return res.status(401).json({
      success: false,
    });
  }
});

app.listen(port, () => console.log(`Server started on ${port}`));
