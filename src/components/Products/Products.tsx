import React from 'react';
import { supabase } from '../../lib/supabase';
import type { Tables } from '../../../database.types';
import ProductCard from './ProductCard';
import useGetProducts from '@/hooks/useGetProducts';

export default function Products() {
  const { products } = useGetProducts();

  return products.map((item) => (
    <ProductCard key={item.id} item={item} color="#000" />
  ));
}
