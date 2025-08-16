import React from 'react';
import DataSearchBar from '../DataSearchBar';
import useHandleProducts from '@/hooks/useHandleProducts';
import ModalWrapper from '../../ModalWrapper';
import Product from './ProductItem';
import ProductAddFlow from './ProductAddFlow';

interface ProductTableProps {
  showStepper?: boolean;
}

export default function ProductTable({}: ProductTableProps) {
  const [showProductModal, setShowProductModal] = React.useState(false);

  const { productItems, refreshProducts } = useHandleProducts({
    skipUnpublished: false,
  });

  React.useEffect(() => {
    refreshProducts();
  }, []);

  return (
    <>
      <div>
        <div className="sticky top-0 bg-white z-10 pt-2 pb-2 border-b-2">
          <DataSearchBar>
            <div>
              <button
                className="bg-orange text-cream px-4 py-2 rounded block hover:bg-brown-dark transition-colors cursor-pointer ml-auto"
                onClick={() => setShowProductModal(true)}
              >
                <span className="text-cream">Add Product</span>
              </button>
            </div>
          </DataSearchBar>
        </div>

        <ul className="divide-y">
          {productItems.map((product) => (
            <Product
              key={product.id}
              product={product}
              fetchProductData={refreshProducts}
            />
          ))}
        </ul>
      </div>

      <ModalWrapper
        style={{ maxWidth: '800px' }}
        showModal={showProductModal}
        setShowModal={setShowProductModal}
      >
        <ProductAddFlow setShowProductModal={setShowProductModal} />
      </ModalWrapper>
    </>
  );
}
