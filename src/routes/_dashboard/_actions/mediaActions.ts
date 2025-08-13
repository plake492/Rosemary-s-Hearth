import { supabase } from '@/lib/supabase';
import type { Tables } from '../../../../database.types';

export const fetchMediaItems = async () => {
  const { data, error } = await supabase
    .from('media')
    .select(
      `
      *,
      product_media:product_media (
        product_id,
        product:product (
        id,
        name
        )
      )
      `,
    )
    .order('created_at', { ascending: false });
  if (error) {
    console.error('Error fetching media items:', error);
    return;
  }

  return data as Tables<'media'>[];
};

export const uploadMedia = async ({
  file,
  name,
  alt,
}: {
  file: File;
  name?: string;
  alt?: string;
}) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
  const { error } = await supabase.storage
    .from('product-photos')
    .upload(fileName, file);
  if (error) {
    console.error('Error uploading file:', error);
    return null;
  }

  const url = supabase.storage.from('product-photos').getPublicUrl(fileName)
    .data.publicUrl;

  const { error: dbError } = await supabase
    .from('media')
    .insert([
      {
        url: url,
        name: name,
        alt: alt,
      },
    ])
    .select();

  if (dbError) {
    console.error('Error inserting media record:', dbError);
    return null;
  }

  return await fetchMediaItems();
};

export const updateMediaItem = async (
  uuid: string,
  updates: Partial<Tables<'media'>>,
) => {
  const { error } = await supabase
    .from('media')
    .update(updates)
    .eq('uuid', uuid)
    .select();
  if (error) {
    console.error('Error updating media item:', error);
    return null;
  }

  return await fetchMediaItems();
};

export const deleteMediaItem = async (uuid: string) => {
  // Get the media record to find the file path
  const { data: mediaData, error: fetchError } = await supabase
    .from('media')
    .select('url')
    .eq('uuid', uuid)
    .single();
  if (fetchError || !mediaData) {
    console.error('Error fetching media item for delete:', fetchError);
    return null;
  }
  // Extract the file path from the public URL
  let filePath = '';
  try {
    const url = mediaData.url;
    // Example: https://xyz.supabase.co/storage/v1/object/public/product-photos/filename.jpg
    const parts = url.split('/product-photos/');
    if (parts.length === 2) {
      filePath = parts[1];
    }
  } catch (e) {
    console.error('Error parsing file path:', e);
  }
  if (filePath) {
    const { error: bucketError } = await supabase.storage
      .from('product-photos')
      .remove([filePath]);
    if (bucketError) {
      console.error('Error deleting bucket item:', bucketError);
    }
  }
  // Delete the media record
  const { error } = await supabase.from('media').delete().eq('uuid', uuid);
  if (error) {
    console.error('Error deleting media item:', error);
    return null;
  }
  // Refresh media items after deletion
  return await fetchMediaItems();
};
