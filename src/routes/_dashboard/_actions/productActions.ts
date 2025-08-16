import { supabase } from '@/lib/supabase';
import type { Tables } from '../../../../database.types';

export const fetchProductData = async (skipUnpublished: boolean) => {
  let query = supabase
    .from('product')
    .select(
      `
      *,
      product_media(
        media_id,
        media(*)
      )
    `,
    )
    .order('id', { ascending: true });

  if (skipUnpublished) {
    query = query.eq('published', true);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }

  // Transform the nested data structure
  return (data || []).map((data) => ({
    ...data,
    media: (data.product_media || []).map((pm) => pm.media).filter(Boolean),
  }));
};

export const createProduct = async (
  productForm: Partial<Tables<'product'>>,
) => {
  const { data, error } = await supabase
    .from('product')
    .upsert(
      [
        {
          ...(productForm.id && { id: productForm.id }),
          name: productForm.name,
          price: productForm.price,
          description: productForm.description,
          link: productForm.link,
        },
      ],
      {
        onConflict: 'id',
      },
    )
    .select();

  return { data: data?.[0], error };
};

export const updateProductPublishedStatus = async ({
  newPublishedStatus,
  productId,
}: {
  newPublishedStatus: boolean;
  productId: string;
}) => {
  const { error } = await supabase
    .from('product')
    .update({ published: newPublishedStatus })
    .eq('uuid', productId);
  if (error) {
    console.error('Error updating product published status:', error);
    return;
  }
};

export const handleDeleteProduct = async (uuid: string) => {
  const { error } = await supabase.from('product').delete().eq('uuid', uuid);
  return { error };
};

export const updateMediaOnProduct = async ({
  productId,
  mediaIds,
}: {
  productId: string;
  mediaIds: string[];
}) => {
  // First, delete existing media associations for this product
  const { error: deleteError } = await supabase
    .from('product_media')
    .delete()
    .eq('product_id', productId);

  if (deleteError) {
    console.error('Error deleting existing media associations:', deleteError);
    return;
  }

  // Then, insert new media associations
  const { error } = await supabase.from('product_media').insert(
    mediaIds.map((mediaId) => ({
      product_id: productId,
      media_id: mediaId,
    })),
  );

  if (error) {
    console.error('Error adding media to product:', error);
    return;
  }
};
