import { authService } from "../services/auth.services.js";

export const authController = {
  // Register
  async register(req, res) {
    try {
      const { user, token } = await authService.register(req.body);
      res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: { user, token },
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },

  // Login
  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "Email and password are required",
        });
      }

      const { user, token } = await authService.login(email, password);
      res.json({
        success: true,
        message: "Login successfully",
        data: { user, token },
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: error.message,
      });
    }
  },

  // Get current user
  async getProfile(req, res) {
    try {
      const user = await authService.getUserById(req.userId);
      res.json({
        success: true,
        data: user,
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  },

  // Update user
  async updateProfile(req, res) {
    try {
      const user = await authService.udpateUser(req.userId, req.body);
      res.json({
        success: true,
        message: "Profile updated successfully",
        data: user,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },

  // Delete user
  async deleteAccount(req, res) {
    try {
      const result = await authService.deleteUser(req.userId);
      res.json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },

  // Get all users (admin)
  async getAllUsers(req, res) {
    try {
      const users = await authService.getAllUsers();
      res.json({
        success: true,
        data: users,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },
};
