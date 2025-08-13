import React from 'react';
import ModalWrapper from '../ModalWrapper';

interface DataSearchBarProps {
  onFilterChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  DataTable?: React.ReactNode;
  closeOverride?: boolean;
}

export default function DataSearchBar({
  onFilterChange,
  DataTable,
  closeOverride,
}: DataSearchBarProps) {
  const [openModal, setOpenModal] = React.useState(false);

  return (
    <>
      <div className="flex justify-between items-center mb-2 p-4 bg-brown rounded">
        {onFilterChange && (
          <div className="flex justify-start items-center  flex-1">
            <label htmlFor="filter-items" className="visually-hidden"></label>
            <input
              type="text"
              placeholder="Search media by name..."
              className="w-full max-w-[400px] px-3 py-2 border rounded"
              id="filter-items"
              onChange={onFilterChange}
            />
          </div>
        )}
        <div>
          <button
            className="bg-orange text-cream px-4 py-2 rounded block hover:bg-brown-dark transition-colors cursor-pointer"
            onClick={() => setOpenModal(true)}
          >
            Add Product
          </button>
        </div>
      </div>
      {DataTable && (
        <ModalWrapper
          openOverride={openModal}
          setOpenOverride={setOpenModal}
          closeOverride={closeOverride}
          className="max-w-lg px-8 pb-16 pr-16 bg-white"
          style={{ maxWidth: '600px' }}
        >
          {DataTable}
        </ModalWrapper>
      )}
    </>
  );
}
