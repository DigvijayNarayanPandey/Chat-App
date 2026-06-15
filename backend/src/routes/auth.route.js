import express from "express";
import { signup, login, logout, updateProfile, refreshToken } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { arcjetProtection } from "../middleware/arcjet.middleware.js";
import { authRateLimiter } from "../middleware/authRateLimit.middleware.js";

const router = express.Router();

router.use(arcjetProtection);

// Apply specific rate limiting to auth endpoints
router.post("/signup", authRateLimiter, signup);
router.post("/login", authRateLimiter, login);
router.post("/logout", logout);
router.post("/refresh", refreshToken); // New refresh token endpoint

router.put("/update-profile", protectRoute, updateProfile);

router.get("/check", protectRoute, (req, res) => res.status(200).json(req.user));

export default router;
