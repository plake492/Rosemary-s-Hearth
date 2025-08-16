import {
  fetchProductData,
  updateProductPublishedStatus,
} from '@/routes/_dashboard/_actions/productActions';
import { useProductStore } from '@/state/useProductStore';

interface useHandleProductsProps {
  skipUnpublished?: boolean;
}

export default function useHandleProducts({
  skipUnpublished = true,
}: useHandleProductsProps) {
  const {
    productItems,
    productItemsFull,
    setProductItems,
    setProductItemsFull,
  } = useProductStore();

  const refreshProducts = async () => {
    const data = await fetchProductData(skipUnpublished);
    setProductItems(data || []);
    setProductItemsFull(data || []);
  };

  const handleTogglePublished = async (productId: string) => {
    const product = productItemsFull.find((p) => p.uuid === productId);
    if (!product) return;

    const newPublishedStatus = !product.published;

    await updateProductPublishedStatus({
      newPublishedStatus,
      productId,
    });

    const updatedProductsFull = productItemsFull.map((p) =>
      p.uuid === productId ? { ...p, published: newPublishedStatus } : p,
    );

    const updatedProductItems = skipUnpublished
      ? updatedProductsFull.filter((p) => p.published)
      : updatedProductsFull;

    setProductItemsFull(updatedProductsFull);
    setProductItems(updatedProductItems);
  };

  return {
    productItems,
    productItemsFull,
    refreshProducts,
    handleTogglePublished,
  };
}
