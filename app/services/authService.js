import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

/**
 * Authentication Service
 * 
 * Handles all authentication operations including:
 * - User registration (storing user data in AsyncStorage)
 * - User login (validating credentials)
 * - Session management (storing auth token in SecureStore)
 * - Logout (clearing session and data)
 * 
 * Data Storage:
 * - AsyncStorage: Non-sensitive user data (email, name, etc.)
 * - SecureStore: Sensitive data (auth token, session)
 */

// Storage Keys
const STORAGE_KEYS = {
  USERS: '@moviemood_users', // All registered users
  CURRENT_USER: '@moviemood_current_user', // Currently logged in user email
  AUTH_TOKEN: 'auth_token', // Session token (SecureStore)
};

/**
 * Register a new user
 * 
 * @param {object} userData - User registration data
 * @param {string} userData.name - User's full name
 * @param {string} userData.email - User's email (used as unique identifier)
 * @param {string} userData.password - User's password (in real app, should be hashed)
 * @returns {object} - { success: boolean, message: string, user?: object }
 */
export const registerUser = async (userData) => {
  try {
    const { name, email, password } = userData;

    // 1. Get existing users from AsyncStorage
    const existingUsersJson = await AsyncStorage.getItem(STORAGE_KEYS.USERS);
    const existingUsers = existingUsersJson ? JSON.parse(existingUsersJson) : [];

    // 2. Check if user already exists
    const userExists = existingUsers.find(user => user.email.toLowerCase() === email.toLowerCase());
    if (userExists) {
      return {
        success: false,
        message: 'An account with this email already exists',
      };
    }

    // 3. Create new user object
    const newUser = {
      id: Date.now().toString(), // Simple unique ID
      name,
      email: email.toLowerCase(),
      password, // NOTE: In production, NEVER store plain passwords! Use bcrypt or similar
      createdAt: new Date().toISOString(),
      avatar: null, // Can be set later in profile
    };

    // 4. Add new user to array
    existingUsers.push(newUser);

    // 5. Save updated users array to AsyncStorage
    await AsyncStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(existingUsers));

    // 6. Automatically log in the new user
    const loginResult = await loginUser({ email, password });

    return {
      success: true,
      message: 'Registration successful!',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      },
    };
  } catch (error) {
    console.error('Registration error:', error);
    return {
      success: false,
      message: 'Registration failed. Please try again.',
    };
  }
};

/**
 * Login user
 * 
 * @param {object} credentials - Login credentials
 * @param {string} credentials.email - User's email
 * @param {string} credentials.password - User's password
 * @returns {object} - { success: boolean, message: string, user?: object }
 */
export const loginUser = async (credentials) => {
  try {
    const { email, password } = credentials;

    // 1. Get all users from AsyncStorage
    const usersJson = await AsyncStorage.getItem(STORAGE_KEYS.USERS);
    const users = usersJson ? JSON.parse(usersJson) : [];

    // 2. Find user with matching email
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    // 3. Validate user exists
    if (!user) {
      return {
        success: false,
        message: 'No account found with this email',
      };
    }

    // 4. Validate password
    if (user.password !== password) {
      return {
        success: false,
        message: 'Incorrect password',
      };
    }

    // 5. Generate mock auth token (in real app, this comes from backend)
    const authToken = `token_${user.id}_${Date.now()}`;

    // 6. Store auth token in SecureStore (encrypted storage)
    await SecureStore.setItemAsync(STORAGE_KEYS.AUTH_TOKEN, authToken);

    // 7. Store current user email in AsyncStorage (for quick access)
    await AsyncStorage.setItem(STORAGE_KEYS.CURRENT_USER, user.email);

    // 8. Return success with user data (without password)
    return {
      success: true,
      message: 'Login successful!',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
    };
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      message: 'Login failed. Please try again.',
    };
  }
};

/**
 * Logout user
 * 
 * Clears session token and current user data
 */
export const logoutUser = async () => {
  try {
    // 1. Remove auth token from SecureStore
    await SecureStore.deleteItemAsync(STORAGE_KEYS.AUTH_TOKEN);

    // 2. Remove current user from AsyncStorage
    await AsyncStorage.removeItem(STORAGE_KEYS.CURRENT_USER);

    return {
      success: true,
      message: 'Logged out successfully',
    };
  } catch (error) {
    console.error('Logout error:', error);
    return {
      success: false,
      message: 'Logout failed',
    };
  }
};

/**
 * Check if user is logged in
 * 
 * @returns {boolean} - True if user has valid session
 */
export const isLoggedIn = async () => {
  try {
    // Check if auth token exists in SecureStore
    const token = await SecureStore.getItemAsync(STORAGE_KEYS.AUTH_TOKEN);
    return !!token; // Returns true if token exists, false otherwise
  } catch (error) {
    console.error('Session check error:', error);
    return false;
  }
};

/**
 * Get current logged in user data
 * 
 * @returns {object|null} - User object or null if not logged in
 */
export const getCurrentUser = async () => {
  try {
    // 1. Get current user email
    const currentUserEmail = await AsyncStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (!currentUserEmail) return null;

    // 2. Get all users
    const usersJson = await AsyncStorage.getItem(STORAGE_KEYS.USERS);
    const users = usersJson ? JSON.parse(usersJson) : [];

    // 3. Find and return current user (without password)
    const user = users.find(u => u.email.toLowerCase() === currentUserEmail.toLowerCase());
    if (!user) return null;

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      createdAt: user.createdAt,
    };
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
};

/**
 * Update user profile
 * 
 * @param {object} updates - Fields to update (name, avatar, etc.)
 * @returns {object} - { success: boolean, message: string, user?: object }
 */
export const updateUserProfile = async (updates) => {
  try {
    // 1. Get current user email
    const currentUserEmail = await AsyncStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (!currentUserEmail) {
      return { success: false, message: 'No user logged in' };
    }

    // 2. Get all users
    const usersJson = await AsyncStorage.getItem(STORAGE_KEYS.USERS);
    const users = usersJson ? JSON.parse(usersJson) : [];

    // 3. Find user index
    const userIndex = users.findIndex(u => u.email === currentUserEmail);
    if (userIndex === -1) {
      return { success: false, message: 'User not found' };
    }

    // 4. Update user data
    users[userIndex] = {
      ...users[userIndex],
      ...updates,
      email: users[userIndex].email, // Email cannot be changed
      password: users[userIndex].password, // Password cannot be changed here
    };

    // 5. Save updated users
    await AsyncStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

    return {
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: users[userIndex].id,
        name: users[userIndex].name,
        email: users[userIndex].email,
        avatar: users[userIndex].avatar,
      },
    };
  } catch (error) {
    console.error('Update profile error:', error);
    return {
      success: false,
      message: 'Failed to update profile',
    };
  }
};

/**
 * Clear all data (for testing/development)
 * WARNING: This deletes ALL user data!
 */
export const clearAllData = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.USERS);
    await AsyncStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    await SecureStore.deleteItemAsync(STORAGE_KEYS.AUTH_TOKEN);
    console.log('All data cleared successfully');
  } catch (error) {
    console.error('Clear data error:', error);
  }
};