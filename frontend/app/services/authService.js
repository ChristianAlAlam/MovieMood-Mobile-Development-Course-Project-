import * as SecureStore from "expo-secure-store";
import api from "./api";

/**
 * Authentication Service - API Version
 *
 * Connects to Express backend for authentication
 */

// Storage Keys
const STORAGE_KEYS = {
  AUTH_TOKEN: "auth_token",
  USER_DATA: "userData",
};

/**
 * Register a new user
 */

export const registerUser = async (userData) => {
  try {
    const { name, email, password } = userData;

    const response = await api.post("/auth/register", {
      name,
      email,
      password,
    });

    if (response.data.success) {
      const { user, token } = response.data.data;

      // Store token and user data in SecureStore
      await SecureStore.setItemAsync(STORAGE_KEYS.AUTH_TOKEN, token);
      await SecureStore.setItemAsync(
        STORAGE_KEYS.USER_DATA,
        JSON.stringify(user)
      );

      return {
        success: true,
        message: "Registration successful!",
        user,
      };
    }

    return {
      success: false,
      message: response.data.message || "Registration failed",
    };
  } catch (error) {
    console.error("Register error:", error);
    const errorMessage =
      error.response?.data?.message || "Registration failed. Please try again.";
    return {
      success: false,
      message: errorMessage,
    };
  }
};

/**
 * Login user
 */

export const loginUser = async (credentials) => {
  try {
    const { email, password } = credentials;

    const response = await api.post("/auth/login", {
      email,
      password,
    });

    if (response.data.success) {
      const { user, token } = response.data.data;

      // Store token and user in SecureStore
      await SecureStore.setItemAsync(STORAGE_KEYS.AUTH_TOKEN, token);
      await SecureStore.setItemAsync(
        STORAGE_KEYS.USER_DATA,
        JSON.stringify(user)
      );

      return {
        success: true,
        message: "Login successful!",
        user,
      };
    }

    return {
      success: false,
      message: response.data.message || "Login failed",
    };
  } catch (error) {
    console.error("Login error:", error);
    const errorMessage =
      error.response?.data?.message || "Invalid email or password";
    return {
      success: false,
      message: errorMessage,
    };
  }
};

/**
 * Logout user
 */

export const logoutUser = async () => {
  try {
    // Remove auth token and user data from SecureStore
    await SecureStore.deleteItemAsync(STORAGE_KEYS.AUTH_TOKEN);
    await SecureStore.deleteItemAsync(STORAGE_KEYS.USER_DATA);

    return {
      success: true,
      message: "Logged out successfully",
    };
  } catch (error) {
    console.error("Logout error:", error);
    return {
      success: false,
      message: "Logout failed",
    };
  }
};

/**
 * Check if user is logged in
 */

export const isLoggedIn = async () => {
  try {
    const token = await SecureStore.getItemAsync(STORAGE_KEYS.AUTH_TOKEN);
    return !!token;
  } catch (error) {
    console.error("Session check error:", error);
    return false;
  }
};

/**
 * Get current logged in user data (from local storage)
 */

export const getCurrentUser = async () => {
  try {
    const userDataString = await SecureStore.getItemAsync(
      STORAGE_KEYS.USER_DATA
    );
    if (userDataString) {
      return JSON.parse(userDataString);
    }

    return null;
  } catch (error) {
    console.error("Get current user error:", error);
    return null;
  }
};

/**
 * Get user profile from backend (fresh data)
 */

export const getUserProfile = async () => {
  try {
    const response = await api.get("/auth/profile");

    if (response.data.success) {
      const user = response.data.data;

      // Update local storage with fresh data
      await SecureStore.setItemAsync(
        STORAGE_KEYS.USER_DATA,
        JSON.stringify(user)
      );
      return user;
    }

    return null;
  } catch (error) {
    console.error("Get profile error:", error);
    return null;
  }
};

/**
 * Update user profile
 */

export const updateUserProfile = async (updates) => {
  try {
    const response = await api.put("/auth/profile", updates);

    if (response.data.success) {
      const user = response.data.data;

      // Updated local storage
      await SecureStore.setItemAsync(
        STORAGE_KEYS.USER_DATA,
        JSON.stringify(user)
      );

      return {
        success: true,
        message: "Profile updated successfully",
        user,
      };
    }

    return {
      success: false,
      message: response.data.message || "Failed to update profile",
    };
  } catch (error) {
    console.error("Update profile error", error);
    return {
      success: false,
      message: error.response?.data?.message || "Failed to update profile",
    };
  }
};

/**
 * Delete user account
 */

export const deleteUserAccount = async () => {
  try {
    const response = await api.delete("/auth/account");

    if (response.data.success) {
      // Clear local storage
      await SecureStore.deleteItemAsync(STORAGE_KEYS.AUTH_TOKEN);
      await SecureStore.deleteItemAsync(STORAGE_KEYS.USER_DATA);

      return {
        success: true,
        message: "Account deleted succesfully",
      };
    }

    return {
      success: false,
      message: response.data.message || "Failed to delete account",
    };
  } catch (error) {
    console.error("Delete account error:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Failed to delete account",
    };
  }
};

/**
 * Clear all data (for testing/development)
 */

export const clearAllData = async () => {
  try {
    await SecureStore.deleteItemAsync(STORAGE_KEYS.AUTH_TOKEN);
    await SecureStore.deleteItemAsync(STORAGE_KEYS.USER_DATA);
    console.log("All data cleared successfully");
  } catch (error) {
    console.error("Clear data error:", error);
  }
};

export default {};
