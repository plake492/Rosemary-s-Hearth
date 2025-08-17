import React from 'react';
import DataSearchBar from '../DataSearchBar';
import useHandleProducts from '@/hooks/useHandleProducts';
import ModalWrapper from '@/components/ModalWrapper';
import Product from './ProductItem';
import ProductAddFlow from './ProductFlow';
import Button from '@/components/Button';
import type { ProductType } from '@/types';

interface ProductTableProps {
  showStepper?: boolean;
}

export default function ProductTable({}: ProductTableProps) {
  const [showProductModal, setShowProductModal] = React.useState(false);

  const { productItems, refreshProducts, productItemsFull, setProductItems } = useHandleProducts({
    skipUnpublished: false,
  });

  React.useEffect(() => {
    refreshProducts();
  }, []);

  const onFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const filterValue = e.target.value.toLowerCase();
    const filteredProducts = productItemsFull.filter(
      (product: ProductType) =>
        product.name?.toLowerCase().includes(filterValue) || product.description?.toLowerCase().includes(filterValue),
    );
    setProductItems(filteredProducts);
  };

  return (
    <>
      <div>
        <div className="sticky top-0 bg-white z-10 pt-2 pb-2 border-b-2">
          <DataSearchBar onFilterChange={onFilterChange}>
            <div>
              <Button
                onClick={() => setShowProductModal(true)}
                className="w-full cursor-pointer"
                variant="primary"
                size="md"
              >
                <span className="text-cream">Add Product</span>
              </Button>
            </div>
          </DataSearchBar>
        </div>

        <ul className="divide-y">
          {productItems.map((product) => (
            <Product key={product.id} product={product} />
          ))}
        </ul>
      </div>

      <ModalWrapper
        style={{ maxWidth: '800px' }}
        showModal={showProductModal}
        setShowModal={setShowProductModal}
        hideCloseButton={true}
        noCloseOnBackdropClick={true}
      >
        <ProductAddFlow setShowProductModal={setShowProductModal} />
      </ModalWrapper>
    </>
  );
}
