import { sendWelcomeEmail } from "../emails/emailHandlers.js";
import {
  generateAccessToken,
  generateRefreshToken,
  hashRefreshToken,
  verifyRefreshToken,
  setAccessTokenCookie,
  setRefreshTokenCookie,
} from "../lib/utils.js";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { ENV } from "../lib/env.js";
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters" });
    }

    // check if emailis valid: regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "Email already exists" });

    // 123456 => $dnjasdkasj_?dmsakmk
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      // Persist user first, then issue auth cookies
      const savedUser = await newUser.save();

      // Generate access and refresh tokens
      const accessToken = generateAccessToken(savedUser._id);
      const refreshToken = await generateRefreshToken(savedUser._id);

      // Hash and store refresh token in database
      const hashedRefreshToken = await hashRefreshToken(refreshToken);
      savedUser.refreshToken = hashedRefreshToken;
      await savedUser.save();

      // Set tokens as httpOnly cookies
      setAccessTokenCookie(accessToken, res);
      setRefreshTokenCookie(refreshToken, res);

      res.status(201).json({
        _id: savedUser._id,
        fullName: savedUser.fullName,
        email: savedUser.email,
        profilePic: savedUser.profilePic,
      });

      try {
        await sendWelcomeEmail(savedUser.email, savedUser.fullName, ENV.CLIENT_URL);
      } catch (error) {
        console.error("Failed to send welcome email:", error);
      }
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.log("Error in signup controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });
    // never tell the client which one is incorrect: password or email

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials" });

    // Generate access and refresh tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = await generateRefreshToken(user._id);

    // Hash and store refresh token in database
    const hashedRefreshToken = await hashRefreshToken(refreshToken);
    user.refreshToken = hashedRefreshToken;
    await user.save();

    // Set tokens as httpOnly cookies
    setAccessTokenCookie(accessToken, res);
    setRefreshTokenCookie(refreshToken, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.error("Error in login controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const logout = async (req, res) => {
  try {
    // Clear refresh token from database
    if (req.user) {
      req.user.refreshToken = null;
      await req.user.save();
    }

    // Clear both cookies
    res.cookie("jwt", "", { maxAge: 0 });
    res.cookie("refreshToken", "", { maxAge: 0, path: "/api/auth/refresh" });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    if (!profilePic) return res.status(400).json({ message: "Profile pic is required" });

    const userId = req.user._id;

    const uploadResponse = await cloudinary.uploader.upload(profilePic);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("Error in update profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Refresh access token using refresh token
export const refreshToken = async (req, res) => {
  try {
    // Get refresh token from cookie
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: "Unauthorized - No refresh token provided" });
    }

    // Verify the refresh token signature and extract userId
    let decoded;
    try {
      decoded = jwt.verify(refreshToken, ENV.JWT_REFRESH_SECRET);
    } catch (err) {
      return res.status(401).json({ message: "Unauthorized - Invalid refresh token" });
    }

    const userId = decoded.userId;

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized - Invalid refresh token" });
    }

    // Verify the hashed refresh token
    const isValid = await verifyRefreshToken(refreshToken, user.refreshToken);
    if (!isValid) {
      return res.status(401).json({ message: "Unauthorized - Invalid refresh token" });
    }

    // Generate new access and refresh tokens
    const newAccessToken = generateAccessToken(user._id);
    const newRefreshToken = await generateRefreshToken(user._id);

    // Hash new refresh token and update database (token rotation)
    const newHashedRefreshToken = await hashRefreshToken(newRefreshToken);
    user.refreshToken = newHashedRefreshToken;
    await user.save();

    // Set new tokens as httpOnly cookies
    setAccessTokenCookie(newAccessToken, res);
    setRefreshTokenCookie(newRefreshToken, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.log("Error in refresh token controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
