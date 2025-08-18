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
      ),
      product_price-quantity(
        price-quantity_id,
        priceQty:price-quantity(*) 
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
  return (data || []).map((item: any) => ({
    ...item,
    media: (item.product_media || []).map((pm: any) => pm.media).filter(Boolean),
    priceQty: (item['product_price-quantity'] || []).map(({ priceQty: pq }: any) => ({
      id: pq.id.toString(),
      uuid: pq.uuid,
      price: pq.price,
      qty: pq.qty,
    })),
  }));
};

export const createProduct = async (productForm: Partial<Tables<'product'>>) => {
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
          status: productForm.status || null,
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
  const { error } = await supabase.from('product').update({ published: newPublishedStatus }).eq('uuid', productId);
  if (error) {
    console.error('Error updating product published status:', error);
    return;
  }
};

export const handleDeleteProduct = async (uuid: string) => {
  const { error } = await supabase.from('product').delete().eq('uuid', uuid);
  return { error };
};

export const updateMediaOnProduct = async ({ productId, mediaIds }: { productId: string; mediaIds: string[] }) => {
  // First, delete existing media associations for this product
  const { error: deleteError } = await supabase.from('product_media').delete().eq('product_id', productId);

  if (deleteError) {
    console.error('Error deleting existing media associations:', deleteError);
    return { error: deleteError };
  }

  // Then, insert new media associations
  const { error } = await supabase.from('product_media').insert(
    mediaIds.map((mediaId) => ({
      product_id: productId,
      media_id: mediaId,
    })),
  );

  return { error };
};

export const addPriceQtyToProduct = async ({
  productId,
  priceQty,
}: {
  productId: string;
  priceQty: { price: number; qty: number }[];
}) => {
  // First, delete existing price-quantity associations for this product
  const { error: deleteError } = await supabase.from('product_price-quantity').delete().eq('product_id', productId);

  if (deleteError) {
    console.error('Error deleting existing price-quantity associations:', deleteError);
    return { error: deleteError };
  }

  // Process each price-quantity combination
  const priceQtyToInsert = [];

  for (const pq of priceQty) {
    // Check if a price-quantity item already exists with the same price and quantity
    const { data: existingPriceQty, error: checkError } = await supabase
      .from('price-quantity')
      .select('uuid')
      .eq('price', pq.price)
      .eq('qty', pq.qty)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      // PGRST116 is "not found" error, which is expected if no match exists
      console.error('Error checking for existing price-quantity:', checkError);
      return { error: checkError };
    }

    let priceQtyId: string | null = null;

    if (existingPriceQty) {
      // Use existing price-quantity item
      priceQtyId = existingPriceQty.uuid;
    } else {
      // Create new price-quantity item
      const { data: newPriceQty, error: createError } = await supabase
        .from('price-quantity')
        .insert({
          price: pq.price,
          qty: pq.qty,
        })
        .select('uuid')
        .single();

      if (createError) {
        console.error('Error creating new price-quantity:', createError);
        return { error: createError };
      }

      priceQtyId = newPriceQty.uuid;
    }

    // Add to the list of associations to create
    priceQtyToInsert.push({
      product_id: productId,
      ['price-quantity_id']: priceQtyId,
    });
  }

  // Insert the product-price-quantity associations
  const { error } = await supabase.from('product_price-quantity').insert(priceQtyToInsert);

  if (error) {
    console.error('Error creating product price-quantity associations:', error);
    return { error };
  }

  return { error: null };
};

export const fetchProductPriceQty = async (productId: string) => {
  const { data, error } = await supabase
    .from('product_price-quantity')
    .select(
      `
      price-quantity_id,
      price-quantity:price-quantity_id (
        id,
        price,
        quantity
      )
    `,
    )
    .eq('product_id', productId)
    .order('id', { ascending: true });

  if (error) {
    console.error('Error fetching product price-quantity data:', error);
    return { data: [], error };
  }

  // Transform the nested data structure
  const priceQtyData = (data || []).map((item: any) => ({
    id: item['price-quantity'].id.toString(),
    price: item['price-quantity'].price,
    qty: item['price-quantity'].quantity,
  }));

  return { data: priceQtyData, error: null };
};

// export const setProductStep = async (productId: string, step: number) => {
//   const { error } = await supabase.from('product').update({ step }).eq('uuid', productId);

//   if (error) {
//     console.error('Error updating product step:', error);
//     return { error };
//   }

//   return { error: null };
// };
