import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Button from '@/components/Button';

// Form-specific interface for price/qty rows
export interface PriceQtyFormRow {
  id: number;
  price: number | '';
  qty: number | '';
}

interface SortableRowProps {
  row: PriceQtyFormRow;
  onUpdate: (id: number, field: 'price' | 'qty', value: number | '') => void;
  onRemove: (id: number) => void;
  showRemove: boolean;
  disabled?: boolean;
}

// Drag handle icon component
const DragHandle = () => (
  <div className="flex flex-col gap-0.5 cursor-grab active:cursor-grabbing">
    <div className="w-5 h-0.5 bg-gray-400 rounded"></div>
    <div className="w-5 h-0.5 bg-gray-400 rounded"></div>
    <div className="w-5 h-0.5 bg-gray-400 rounded"></div>
  </div>
);

// Plus icon for add button
const PlusIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

// Trash icon for remove button
const TrashIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
    />
  </svg>
);

// Sortable row component
function SortableRow({ row, onUpdate, onRemove, showRemove, disabled = false }: SortableRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: row.id,
    disabled,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;

    const value = e.target.value;

    if (value === '') {
      onUpdate(row.id, 'price', '');
      return;
    }

    const priceRegex = /^\d+(\.\d{0,2})?$/;

    if (priceRegex.test(value)) {
      const numericValue = parseFloat(value);
      onUpdate(row.id, 'price', numericValue);
    }
  };

  const handleQtyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;

    const value = e.target.value === '' ? '' : parseInt(e.target.value);
    onUpdate(row.id, 'qty', value);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 p-3 bg-white border border-gray-300 rounded-lg ${
        disabled ? 'opacity-60' : ''
      }`}
    >
      {/* Drag handle */}
      <div {...attributes} {...listeners} className={`flex-shrink-0 ${disabled ? 'cursor-not-allowed' : ''}`}>
        <DragHandle />
      </div>

      {/* Price input */}
      <div className="flex-1">
        <label className="block text-sm font-medium text-brown mb-1">Price</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
          <input
            type="number"
            step="0.01"
            min="0"
            value={row.price}
            onChange={handlePriceChange}
            disabled={disabled}
            className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder="0.00"
          />
        </div>
      </div>

      {/* Quantity input */}
      <div className="flex-1">
        <label className="block text-sm font-medium text-brown mb-1">Quantity</label>
        <input
          type="number"
          min="0"
          value={row.qty}
          onChange={handleQtyChange}
          disabled={disabled}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          placeholder="0"
        />
      </div>

      {/* Remove button (only show if there are multiple rows and not disabled) */}
      {showRemove && !disabled && (
        <button
          type="button"
          onClick={() => onRemove(row.id)}
          className="flex-shrink-0 p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
          aria-label="Remove row"
        >
          <TrashIcon />
        </button>
      )}
    </div>
  );
}

export default function ProductFormPriceQty({
  rows,
  setRows,
}: {
  rows: PriceQtyFormRow[];
  setRows: React.Dispatch<React.SetStateAction<PriceQtyFormRow[]>>;
}) {
  const [activeId, setActiveId] = useState<number | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const addRow = () => {
    const newRow: PriceQtyFormRow = {
      id: Date.now(), // Use timestamp as unique ID
      price: '',
      qty: '',
    };
    setRows([...rows, newRow]);
  };

  const removeRow = (id: number) => {
    if (rows.length > 1) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const updateRow = (id: number, field: 'price' | 'qty', value: number | '') => {
    setRows(rows.map((row) => (row.id === id ? { ...row, [field]: value } : row)));
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as number);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (active.id !== over?.id) {
      setRows((items: PriceQtyFormRow[]) => {
        const oldIndex = items.findIndex((item: PriceQtyFormRow) => item.id === active.id);
        const newIndex = items.findIndex((item: PriceQtyFormRow) => item.id === over?.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const activeRow = rows?.find((row) => row.id === activeId) || null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-brown">Price & Quantity Options</h3>
        <Button type="button" onClick={addRow} className="cursor-pointer" variant="border" leftIcon={<PlusIcon />}>
          Add Option
        </Button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={rows.map((row) => row.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {rows.map((row) => (
              <SortableRow
                key={row.id}
                row={row}
                onUpdate={updateRow}
                onRemove={removeRow}
                showRemove={rows.length > 1}
              />
            ))}
          </div>
        </SortableContext>

        <DragOverlay>
          {activeRow ? (
            <div className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg shadow-lg opacity-90">
              <DragHandle />
              <div className="flex-1">
                <label className="block text-sm font-medium text-brown mb-1">Price</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={activeRow.price || ''}
                    disabled
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded bg-gray-50"
                  />
                </div>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-brown mb-1">Quantity</label>
                <input
                  type="number"
                  value={activeRow.qty || ''}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50"
                />
              </div>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Summary/Preview */}
      {/* {rows.some((row) => row.price !== '' && row.qty !== '') && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-brown mb-2">Preview:</h4>
          <div className="space-y-1 text-sm text-gray-600">
            {rows
              .filter((row) => row.price !== '' && row.qty !== '')
              .map((row, index) => (
                <div key={row.id}>
                  Option {index + 1}: ${row.price} × {row.qty} quantity
                </div>
              ))}
          </div>
        </div>
      )} */}
    </div>
  );
}
