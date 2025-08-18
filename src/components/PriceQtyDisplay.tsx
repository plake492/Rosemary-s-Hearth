import { formatDollar } from '@/utils/helpers';
import type { ProductWithJoins } from '@/types';

interface PriceQtyDisplayProps {
  product: ProductWithJoins;
  children?: React.ReactNode;
  border?: boolean;
  tempPriceQty?: { price: number; qty: number }[];
}

export default function PriceQtyDisplay({ product, children, border, tempPriceQty }: PriceQtyDisplayProps) {
  if ((!product.priceQty || product.priceQty.length === 0) && (!tempPriceQty || tempPriceQty.length === 0)) {
    return null;
  }
  return (
    <div className={`pt-2 w-fit ${border ? 'border-t border-gray-300 mt-4' : ''}`}>
      {children}
      <div className="flex flex-wrap">
        {tempPriceQty
          ? tempPriceQty.map((pq, i: number, arr) => (
              <div key={i}>
                {pq.qty ? <span className="leading-none text-xl text-amber-800">{pq.qty} for: </span> : null}
                <span className="leading-none text-lg text-amber-900">{formatDollar(pq.price)}</span>
                {i < arr.length - 1 && <span className="mx-4 text-amber-800">|</span>}
              </div>
            ))
          : product.priceQty &&
            product.priceQty.map((pq, i: number, arr) => (
              <div key={pq.uuid}>
                {pq.qty ? <span className="leading-none text-xl text-amber-800">{pq.qty} for: </span> : null}
                <span className="leading-none text-lg text-amber-900">{formatDollar(pq.price)}</span>
                {i < arr.length - 1 && <span className="mx-4 text-amber-800">|</span>}
              </div>
            ))}
      </div>
    </div>
  );
}
