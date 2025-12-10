// utils/uploadAvatar.js

// Import your configured Supabase client instance
import { supabase } from "../config/supabase"; // Adjust path as necessary
import { decode } from "base64-arraybuffer";

/**
 * Uploads a local image file URI to Supabase storage.
 * Reads the file as a base64 string and converts to ArrayBuffer for upload.
 *
 * @param {string} userId The ID of the user (used for file naming)
 * @param {object} asset The ImagePicker asset object containing base64 data
 * @returns {Promise<string|null>} The public URL of the uploaded avatar, or null if failed.
 */
export const uploadAvatar = async (userId, asset) => {
  // Ensure the asset object has the necessary base64 data
  if (!asset || !asset.base64) {
    console.error("❌ Asset object is missing base64 data.");
    // Make sure your ImagePicker calls in ProfileScreen.js have 'base64: true'
    return null;
  }

  const base64 = asset.base64;
  const fileType = asset.mimeType || "image/jpeg";
  const fileName = `public/${userId}/${Date.now()}.jpeg`; // Organize by user folder

  console.log("📤 Starting upload for:", fileName);

  try {
    // 1. Convert Base64 data to ArrayBuffer (required for React Native uploads)
    const arrayBuffer = decode(base64);

    // 2. Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("avatars") // Make sure this bucket name is correct in your Supabase dashboard
      .upload(fileName, arrayBuffer, {
        contentType: fileType,
        upsert: true,
      });

    if (uploadError) {
      console.error("❌ Supabase upload error:", uploadError.message);
      throw uploadError;
    }

    console.log("✅ Upload successful:", uploadData.path);

    // 3. Get the public URL to save in your PostgreSQL database (via Prisma backend)
    const { data: publicUrlData } = supabase.storage
      .from("avatars")
      .getPublicUrl(fileName);

    return publicUrlData.publicUrl;
  } catch (error) {
    console.error("❌ Error during avatar upload process:", error);
    throw error; // Re-throw the error so authService can catch it and show an Alert
  }
};

/**
 * Deletes an avatar file from Supabase storage using its full URL.
 *
 * @param {string} avatarUrl The full public URL of the avatar.
 */
export const deleteAvatar = async (avatarUrl) => {
  try {
    if (!avatarUrl || !avatarUrl.includes("supabase.co")) {
      // If the URL is invalid or not a Supabase URL, just return
      return;
    }

    console.log("🗑️ Deleting avatar:", avatarUrl);

    // Extract file path from URL
    // e.g., turn 'https://<project>.supabase.co/storage/v1/object/public/avatars/public/...'
    // into 'public/...'
    const pathRegex = /avatars\/(.*)$/;
    const match = avatarUrl.match(pathRegex);

    if (!match || match.length < 2) {
      console.log("⚠️ Could not extract valid file path from URL.");
      return;
    }

    const filePath = match[1];
    console.log("🗑️ Deleting path:", filePath);

    const { error } = await supabase.storage.from("avatars").remove([filePath]);

    if (error) {
      console.error("❌ Error deleting old avatar:", error);
      throw error;
    } else {
      console.log("✅ Avatar deleted successfully");
    }
  } catch (error) {
    console.error("❌ Error in deleteAvatar:", error);
  }
};
