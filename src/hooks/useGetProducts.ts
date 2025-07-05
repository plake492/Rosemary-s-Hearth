import React from 'react';
import { supabase } from '@/lib/supabase';

export default function useGetProducts() {
  const [products, setProducts] = React.useState<any[]>([]);

  React.useEffect(() => {
    const fetchData = async () => {
      const fetchProducts = async () => {
        const { data, error } = await supabase.from('product').select();
        if (error) {
          console.error('Error fetching products:', error);
          return [];
        }

        setProducts(data || []);

        return data;
      };

      const products = await fetchProducts();

      // Fetch media for each product via the pivot table
      if (products && products.length > 0) {
        const productListWithMedia = await Promise.all(
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
        setProducts(productListWithMedia);
      }
    };
    fetchData();
  }, []);

  React.useEffect(() => {
    console.log('products ==>', products);
  }, [products]);

  return { products, setProducts };
}
