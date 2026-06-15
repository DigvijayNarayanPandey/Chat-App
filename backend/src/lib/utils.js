import jwt from "jsonwebtoken";
import { ENV } from "./env.js";
import bcrypt from "bcryptjs";

// Generate access token (short-lived)
export const generateAccessToken = (userId) => {
  const { JWT_SECRET } = ENV;
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }

  return jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: "15m", // Access token expires in 15 minutes
  });
};

// Generate refresh token (long-lived)
export const generateRefreshToken = (userId) => {
  const { JWT_REFRESH_SECRET } = ENV;
  if (!JWT_REFRESH_SECRET) {
    throw new Error("JWT_REFRESH_SECRET is not configured");
  }

  return jwt.sign({ userId }, JWT_REFRESH_SECRET, {
    expiresIn: "7d", // Refresh token expires in 7 days
  });
};

// Hash refresh token for storage in database
export const hashRefreshToken = async (token) => {
  const salt = await bcrypt.genSalt(12);
  return await bcrypt.hash(token, salt);
};

// Verify hashed refresh token
export const verifyRefreshToken = async (token, hashedToken) => {
  return await bcrypt.compare(token, hashedToken);
};

// Set access token as httpOnly cookie
export const setAccessTokenCookie = (token, res) => {
  res.cookie("jwt", token, {
    maxAge: 15 * 60 * 1000, // 15 minutes
    httpOnly: true,
    sameSite: ENV.NODE_ENV === "development" ? "strict" : "none",
    secure: ENV.NODE_ENV === "development" ? false : true,
  });
};

// Set refresh token as httpOnly cookie
export const setRefreshTokenCookie = (token, res) => {
  res.cookie("refreshToken", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    httpOnly: true,
    sameSite: ENV.NODE_ENV === "development" ? "strict" : "none",
    secure: ENV.NODE_ENV === "development" ? false : true,
    path: "/api/auth/refresh", // Only sent to refresh endpoint
  });
};

// http://localhost
// https://dsmakmk.com
