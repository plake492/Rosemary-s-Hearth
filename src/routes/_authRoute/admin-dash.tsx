import React from 'react';

import OrderWindowForm from '@/components/AdminDash/OrderWindowForm';
import ProductForm from '@/components/AdminDash/ProductForm';
import ProductList from '@/components/AdminDash/ProductList';
import { supabase } from '@/lib/supabase';
import { createFileRoute } from '@tanstack/react-router';
import useGetProducts from '@/hooks/useGetProducts';

export const Route = createFileRoute('/_authRoute/admin-dash')({
  component: RouteComponent,
});

function RouteComponent() {
  // const [productList, setProductList] = React.useState<any[]>([]);

  // React.useEffect(() => {
  //   const fetchData = async () => {
  //     const fetchProducts = async () => {
  //       const { data, error } = await supabase.from('product').select();
  //       if (error) {
  //         console.error('Error fetching products:', error);
  //         return [];
  //       }

  //       setProductList(data || []);

  //       return data;
  //     };

  //     const productList = await fetchProducts();

  //     // Fetch media for each product via the pivot table
  //     if (productList && productList.length > 0) {
  //       const productListWithMedia = await Promise.all(
  //         productList.map(async (product) => {
  //           // Query product_media pivot table and join media
  //           const { data: pivots, error: pivotError } = await supabase
  //             .from('product_media' as any)
  //             .select('media_id, media:media_id(*)')
  //             .eq('product_id', product.uuid);
  //           if (pivotError) {
  //             console.error('Error fetching product_media:', pivotError);
  //             return { ...product, media: [] };
  //           }
  //           // Extract media objects
  //           const media = (pivots || [])
  //             .map((pivot: any) => pivot.media)
  //             .filter(Boolean);
  //           return { ...product, media };
  //         }),
  //       );
  //       setProductList(productListWithMedia);
  //     }
  //   };
  //   fetchData();
  // }, []);

  const { products, setProducts } = useGetProducts();

  return (
    <div className="bg-cream container mx-auto p-4">
      <h1 className="h1">Admin Dash</h1>
      <div className="grid grid-cols-3">
        <OrderWindowForm />
        <ProductForm product={null} setProductList={setProducts} />
        <ProductList productList={products} setProductList={setProducts} />
      </div>
    </div>
  );
}
