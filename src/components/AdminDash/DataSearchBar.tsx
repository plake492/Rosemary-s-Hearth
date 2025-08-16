import React from 'react';

interface DataSearchBarProps {
  onFilterChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  children?: React.ReactNode;
}

export default function DataSearchBar({
  onFilterChange,
  children,
}: DataSearchBarProps) {
  return (
    <>
      <div className="flex justify-between items-center mb-2 p-4 bg-brown rounded">
        {onFilterChange && (
          <div className="flex justify-start items-center  flex-1">
            <label htmlFor="filter-items" className="visually-hidden"></label>
            <input
              type="text"
              placeholder="Search data by name..."
              className="w-full max-w-[400px] px-3 py-2 border rounded"
              id="filter-items"
              onChange={onFilterChange}
            />
          </div>
        )}
        {!!children && children}
      </div>
    </>
  );
}
