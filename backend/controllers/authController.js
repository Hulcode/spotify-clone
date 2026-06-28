import User from "../model/User.js";
import jwt from "jsonwebtoken";

const maxAge = 24 * 60 * 60 * 3;
const generateToken = (id, isAdmin) => {
  return jwt.sign({ id, isAdmin }, process.env.JWT_AUTH, { expiresIn: maxAge });
};

async function registerUser(req, res) {
  const { email, password, userName, isAdmin } = req.body;

  if (!userName || !email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "all fields are required" });
  }
  try {
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        message: "Email is already used",
      });
    }

    const newUser = await User.create({
      userName,
      email,
      password,

      isAdmin,
    });
    const { password: _, ...userData } = newUser.toObject();
    const accessToken = generateToken(newUser._id, newUser.isAdmin);

    res.cookie("jwt", accessToken, {
      httpOnly: true,
      maxAge: maxAge * 1000,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    });
    res.status(200).json({
      ...userData,
      success: true,
      accessToken: accessToken,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

async function logoutUser(req, res) {
  res.clearCookie("jwt");

  return res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
}

async function getUser(req, res) {
  const token = req.cookies.jwt;

  if (!token) {
    return res.sendStatus({ success: false });
  }
  const decoded = jwt.verify(token, process.env.JWT_AUTH);
  const user = await User.findById(decoded.id);

  return res.status(200).json({
    success: true,
    message: "successfully",
    user: user,
  });
}

async function loginUser(req, res) {
  const { email, password, adminRequired } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "all fields are required", success: false });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Not found",
      });
    }

    if (!(await user.comparePassword(password))) {
      return res
        .status(400)
        .json({ message: "Invalid password", success: false });
    }
    if (adminRequired && !user.isAdmin) {
      return res
        .status(403)
        .json({ message: "Do not have required permitions", success: false });
    }
    const { password: _, ...userData } = user.toObject();
    const accessToken = generateToken(user._id, user.isAdmin);

    res.cookie("jwt", accessToken, {
      httpOnly: true,
      maxAge: maxAge * 1000,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    });

    res.status(200).json({
      ...userData,
      accessToken: accessToken,
      success: true,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

export { registerUser, loginUser, logoutUser, getUser };
