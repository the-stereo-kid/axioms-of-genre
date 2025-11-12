/**
 * 🎯 SUPABASE STORAGE - Image Upload Helper
 *
 * This file handles uploading and retrieving cover images from Supabase Storage.
 *
 * SETUP INSTRUCTIONS:
 * 1. Go to Supabase Dashboard → Storage
 * 2. Create a new bucket called "cover-images"
 * 3. Set it to "Public" (or configure RLS policies if you want private)
 * 4. Use these functions to upload/retrieve images
 *
 * Learn more: https://supabase.com/docs/guides/storage
 */

import { supabase } from "./supabaseClient";

const BUCKET_NAME = "cover-images";

/**
 * Upload a cover image to Supabase Storage
 * @param file - The image file to upload
 * @param fileName - Optional custom filename (defaults to timestamp + original name)
 * @returns Public URL of the uploaded image
 */
export async function uploadCoverImage(file: File, fileName?: string): Promise<string> {
  // Generate unique filename if not provided
  const timestamp = Date.now();
  const sanitizedName = fileName || `${timestamp}-${file.name.replace(/\s+/g, "-")}`;
  const filePath = `covers/${sanitizedName}`;

  // Upload file
  const { data, error } = await supabase.storage.from(BUCKET_NAME).upload(filePath, file, {
    cacheControl: "3600",
    upsert: false, // Set to true if you want to overwrite existing files
  });

  if (error) {
    throw new Error(`Failed to upload image: ${error.message}`);
  }

  // Get public URL
  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);

  return publicUrl;
}

/**
 * Get public URL for a cover image
 * @param filePath - Path to the image in storage (e.g., "covers/my-image.jpg")
 * @returns Public URL
 */
export function getCoverImageUrl(filePath: string): string {
  const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);
  return data.publicUrl;
}

/**
 * Delete a cover image from storage
 * @param filePath - Path to the image in storage
 */
export async function deleteCoverImage(filePath: string): Promise<void> {
  const { error } = await supabase.storage.from(BUCKET_NAME).remove([filePath]);

  if (error) {
    throw new Error(`Failed to delete image: ${error.message}`);
  }
}

/**
 * Transform image URL for optimized delivery (Supabase CDN)
 * @param url - Original image URL
 * @param width - Optional width for resizing
 * @param height - Optional height for resizing
 * @param quality - Optional quality (1-100)
 * @returns Optimized image URL
 */
export function getOptimizedImageUrl(
  url: string,
  options?: {
    width?: number;
    height?: number;
    quality?: number;
  }
): string {
  if (!options) return url;

  const params = new URLSearchParams();
  if (options.width) params.append("width", options.width.toString());
  if (options.height) params.append("height", options.height.toString());
  if (options.quality) params.append("quality", options.quality.toString());

  // Supabase Storage CDN supports query params for transformations
  // Note: This requires Supabase Image Transformation addon or custom CDN config
  return params.toString() ? `${url}?${params.toString()}` : url;
}
