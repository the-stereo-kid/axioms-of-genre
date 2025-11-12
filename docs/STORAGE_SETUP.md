# 📸 Supabase Storage Setup Guide

## Quick Answer: Use Supabase Storage (Not Static Files)

**Why?**
- ✅ Scalable - add images without redeploying
- ✅ Dynamic - different cover images per blog post
- ✅ CDN delivery - fast global performance
- ✅ Smaller bundle size - images aren't in your Vue build
- ✅ Easy updates - change images without code changes

---

## Step 1: Create Storage Bucket

1. Go to your **Supabase Dashboard** → **Storage**
2. Click **"New bucket"**
3. Name it: `cover-images`
4. Set to **"Public"** (or configure RLS if you want private)
5. Click **"Create bucket"**

---

## Step 2: Add Cover Image Column to Posts Table

Run this SQL in your Supabase SQL Editor:

```sql
alter table public.posts
add column if not exists cover_image_url text;
```

Or use the migration file: `docs/migrations/add-cover-image-to-posts.sql`

---

## Step 3: Upload Images (Example Usage)

### In Your Author Dashboard Component:

```vue
<template>
  <div>
    <input type="file" @change="handleImageUpload" accept="image/*" />
    <img v-if="imagePreview" :src="imagePreview" alt="Preview" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { uploadCoverImage } from '@/lib/imageStorage';

const imagePreview = ref<string>('');
const coverImageUrl = ref<string>('');

async function handleImageUpload(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  
  if (!file) return;
  
  try {
    // Show preview
    imagePreview.value = URL.createObjectURL(file);
    
    // Upload to Supabase Storage
    const url = await uploadCoverImage(file);
    coverImageUrl.value = url;
    
    console.log('Image uploaded:', url);
  } catch (error) {
    console.error('Upload failed:', error);
  }
}
</script>
```

### When Creating/Updating a Post:

```typescript
import { supabase } from '@/lib/supabaseClient';

// Save post with cover image URL
const { data, error } = await supabase
  .from('posts')
  .insert({
    title: 'My Post',
    slug: 'my-post',
    markdown: '# Content',
    cover_image_url: coverImageUrl.value, // ← Use the uploaded URL
    author_id: userId
  });
```

---

## Step 4: Display Cover Images

### In Blog List Component:

```vue
<template>
  <article v-for="post in posts" :key="post.id">
    <img 
      v-if="post.cover_image_url" 
      :src="post.cover_image_url" 
      :alt="post.title"
      class="w-full h-48 object-cover rounded-lg"
    />
    <h2>{{ post.title }}</h2>
  </article>
</template>
```

### Optimized Image Loading (Optional):

```vue
<template>
  <img 
    :src="getOptimizedUrl(post.cover_image_url, { width: 800, quality: 80 })"
    :alt="post.title"
  />
</template>

<script setup lang="ts">
import { getOptimizedImageUrl } from '@/lib/imageStorage';

function getOptimizedUrl(url: string, options: { width?: number; quality?: number }) {
  return getOptimizedImageUrl(url, options);
}
</script>
```

---

## Storage Policies (RLS)

If you set the bucket to **Private**, you'll need RLS policies:

```sql
-- Allow authenticated users to upload
CREATE POLICY "Users can upload cover images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'cover-images');

-- Allow public to read cover images
CREATE POLICY "Public can read cover images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'cover-images');
```

---

## File Size Limits

- **Supabase Free Tier**: 50MB per file
- **Recommended**: Keep images under 5MB
- **Best Practice**: Compress images before uploading (use tools like TinyPNG or ImageOptim)

---

## Helper Functions Available

See `src/lib/imageStorage.ts` for:

- `uploadCoverImage(file, fileName?)` - Upload image
- `getCoverImageUrl(filePath)` - Get public URL
- `deleteCoverImage(filePath)` - Delete image
- `getOptimizedImageUrl(url, options)` - Get optimized URL

---

## Troubleshooting

**"Bucket not found"**
- Make sure bucket name matches exactly: `cover-images`
- Check bucket exists in Supabase Dashboard

**"Upload failed"**
- Check file size (should be < 50MB)
- Verify bucket is public OR RLS policies are set
- Check browser console for detailed error

**"Image not displaying"**
- Verify URL is correct (should start with your Supabase project URL)
- Check CORS settings if loading from different domain
- Ensure bucket is set to public

