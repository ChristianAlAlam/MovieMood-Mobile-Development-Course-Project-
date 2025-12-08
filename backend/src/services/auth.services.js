import prisma from "../config/database.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Helper function to generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

export const authService = {
  // Register new user
  async register(userData) {
    const { name, email, password, avatar } = userData;

    // Validate name
    if (!name || name.trim() === "") {
      throw new Error("Name is required");
    }

    // Validate email
    if (!email || email.trim() === "") {
      throw new Error("Email is required");
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new Error("Email already exists");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        name, // User's name
        email, // User's email
        password: hashedPassword, // Store the hashed password for security
        avatar, // Optional avatar URL
      },
      select: {
        // Specify which fields to return after creating the user
        id: true, // Return the user's id
        name: true, // Return the user's name
        email: true, // Return the user's email
        avatar: true, // Return the avatar URL
        createdAt: true, // Return the timestamp when the user was created
      },
    });

    const token = generateToken(user.id);

    return { user, token };
  },

  // Login user
  async login(email, password) {
    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error("Invalid credentials");
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      throw new Error("Invalid credentials");
    }

    // Return user without password
    // Destructure the 'user' object to remove the 'password' field
    // 'password: _' takes the password property and assigns it to a throwaway variable '_'
    // '...userWithoutPassword' collects all the remaining properties into a new object
    const { password: _, ...userWithoutPassword } = user;

    // Now 'userWithoutPassword' contains all the user's fields except the password
    // This is useful for sending the user object in a response without exposing the password
    const token = generateToken(user.id);
    return { user: userWithoutPassword, token };
  },

  // Get user by ID
  async getUserById(userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        createdAt: true,
        _count: {
          select: { movies: true },
        },
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  },

  // Update user
  async udpateUser(userId, updateData) {
    const { name, email, password, avatar } = updateData;

    const data = {};
    if (name) data.name = name;
    if (email) data.email = email;
    if (avatar !== undefined) data.avatar = avatar;
    if (password) {
      data.password = await bcrypt.hash(password, 10);
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        createdAt: true,
      },
    });

    return user;
  },

  // Delete user
  async deleteUser(userId) {
    await prisma.user.delete({
      where: { id: userId },
    });

    return { message: "User deleted successfully" };
  },

  // Get all users (admin function)
  async getAllUsers() {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        createdAt: true,
        _count: {
          select: { movies: true },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    return users;
  },
};
