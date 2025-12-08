import express from "express";
import { authController } from "../controllers/auth.controllers.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

// Public routes
router.post("/register", authController.register);
router.post("/login", authController.login);

// Protected routes
router.get("/profile", authMiddleware, authController.getProfile);
router.put("/profile", authMiddleware, authController.updateProfile);
router.delete("/account", authMiddleware, authController.deleteAccount);

// Admin route
router.get("/users", authController.getAllUsers);

export default router;
