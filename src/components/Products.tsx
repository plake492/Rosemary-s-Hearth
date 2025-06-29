import React from 'react';
import { supabase } from '../lib/supabase';
import type { Product } from '../types/database';
import ProductCard from './ProductCard';

export default function Products() {
  const [menuItems, setMenuItems] = React.useState<Product[]>([]);

  React.useEffect(() => {
    const getData = async () => {
      const { data, error } = await supabase.from('product').select();
      if (error) {
        console.error('Error fetching products:', error);
      } else {
        setMenuItems(data);
      }
    };

    getData();
  }, []);

  return (
    <div className="grid grid-cols-3 gap-4">
      {menuItems.map((item) => (
        <ProductCard key={item.id} item={item} />
      ))}{' '}
      {/* {menuItems.map((item) => (
        <ProductCard key={item.id} item={item} />
      ))}{' '}
      {menuItems.map((item) => (
        <ProductCard key={item.id} item={item} />
      ))}{' '} */}
    </div>
  );
}
