import { supabase } from '@/lib/supabase';

export const fetchProductData = async (skipUnpublished: boolean) => {
  const fetchProducts = async () => {
    let query = supabase
      .from('product')
      .select()
      .order('id', { ascending: true });
    if (skipUnpublished) {
      query = query.eq('published', true);
    }
    const { data, error } = await query;
    if (error) {
      console.error('Error fetching products:', error);
      return [];
    }
    return data;
  };

  let products = await fetchProducts();

  // Fetch media for each product via the pivot table
  if (products && products.length > 0) {
    products = await Promise.all(
      products.map(async (product) => {
        // Query product_media pivot table and join media
        const { data: pivots, error: pivotError } = await supabase
          .from('product_media' as any)
          .select('media_id, media:media_id(*)')
          .eq('product_id', product.uuid);
        if (pivotError) {
          console.error('Error fetching product_media:', pivotError);
          return { ...product, media: [] };
        }
        // Extract media objects
        const media = (pivots || [])
          .map((pivot: any) => pivot.media)
          .filter(Boolean);
        return { ...product, media };
      }),
    );
  }

  return products || [];
};

// const handleTogglePublished = async (productId: string) => {
//   const product = products.find((p) => p.uuid === productId);
//   if (!product) return;
//   const newPublishedStatus = !product.published;
//   const { error } = await supabase
//     .from('product')
//     .update({ published: newPublishedStatus })
//     .eq('uuid', productId);
//   if (error) {
//     console.error('Error updating product published status:', error);
//     return;
//   }
//   // Update local state
//   setProducts((prev) =>
//     prev.map((p) =>
//       p.uuid === productId ? { ...p, published: newPublishedStatus } : p,
//     ),
//   );
// };
