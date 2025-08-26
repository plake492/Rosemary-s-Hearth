import type { Tables } from '../../../../database.types';

interface ProductPublishCheckboxProps {
  product: Partial<Tables<'product'>>;
  loadingPublishedState: boolean;
  togglePublished: (uuid: string) => Promise<void>;
}

export default function ProductPublishCheckbox({
  product,
  loadingPublishedState,
  togglePublished,
}: ProductPublishCheckboxProps) {
  return (
    <div className="flex flex-row-reverse items-center gap-2 mt-4">
      <label
        htmlFor={`published-toggle-${product.id}`}
        className="relative inline-flex items-center cursor-pointer select-none"
        style={{
          minWidth: 120,
          opacity: loadingPublishedState ? 0.5 : 1,
        }}
      >
        <span
          className="mr-3 text-base text-gray-800"
          style={{
            opacity: product.published ? 0.4 : 1,
          }}
        >
          Unpublished
        </span>
        <input
          type="checkbox"
          id={`published-toggle-${product.id}`}
          name={`published-toggle-${product.id}`}
          checked={!!product.published}
          onClick={() => togglePublished(product.uuid || '')}
          readOnly
          className="sr-only peer"
          disabled={loadingPublishedState}
        />
        <span
          className={`w-11 h-6 flex items-center rounded-full transition-colors relative ${
            product.published ? 'bg-orange' : 'bg-gray-300'
          }`}
        >
          <span
            className={`absolute left-1 transition-transform w-4 h-4 rounded-full translate ${
              product.published ? 'bg-orange translate-x-5 border-2 border-white' : 'bg-white'
            }`}
            style={{
              top: '50%',
              transform: 'translateY(-50%)',
            }}
          ></span>
        </span>
        <span
          className="ml-3 text-base text-gray-800"
          style={{
            opacity: product.published ? 1 : 0.4,
          }}
        >
          Published
        </span>
      </label>
    </div>
  );
}
