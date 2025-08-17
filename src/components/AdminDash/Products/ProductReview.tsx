import useHandleMedia from '@/hooks/useHandleMedia';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import {
  closestCenter,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import React from 'react';
import type { Tables } from '../../../../database.types';

// Sortable Image Item Component
function SortableImageItem({ media, onRemove }: { media: any; onRemove: (uuid: string) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: media.uuid,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} className="relative group flex-shrink-0">
      {/* Drag handle - only the image is draggable */}
      <div {...listeners} className="cursor-move">
        <img src={media.url} alt={media.name || 'Product Image'} className="w-32 h-32 object-cover rounded" />
      </div>
      {/* Remove button - separate from drag listeners */}
      <button
        className="z-10 opacity-0 cursor-pointer group-hover:opacity-100 absolute top-1 right-1 bg-red-500/75 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition-opacity"
        style={{
          fontSize: '24px',
        }}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          onRemove(media.uuid);
        }}
      >
        ×
      </button>
    </div>
  );
}

interface ProductReviewProps {
  product: Partial<Tables<'product'>>;
  mediaIds?: string[];
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  setMediaIds: React.Dispatch<React.SetStateAction<string[]>>;
  handleComplete: (status: 'complete' | 'draft') => Promise<void>;
}

export default function ProductReview({
  product,
  mediaIds,
  setCurrentStep,
  handleComplete,
  setMediaIds,
}: ProductReviewProps) {
  const { mediaItemsFull } = useHandleMedia();
  const [loading, setLoading] = React.useState(false);
  const [productMedia, setProductMedia] = React.useState<any[]>([]);
  const [activeId, setActiveId] = React.useState<string | null>(null);

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

  React.useEffect(() => {
    if (mediaIds && mediaItemsFull) {
      const filteredMedia = mediaItemsFull.filter((media) => mediaIds.includes(media.uuid));
      // Preserve the order based on mediaIds array
      const orderedMedia = mediaIds.map((id) => filteredMedia.find((media) => media.uuid === id)).filter(Boolean);
      setProductMedia(orderedMedia);
    }
  }, [mediaIds, mediaItemsFull]);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (active.id !== over?.id) {
      setProductMedia((items) => {
        const oldIndex = items.findIndex((item) => item.uuid === active.id);
        const newIndex = items.findIndex((item) => item.uuid === over?.id);

        const newOrder = arrayMove(items, oldIndex, newIndex);

        // Update mediaIds to match the new order
        const newMediaIds = newOrder.map((item) => item.uuid);
        setMediaIds(newMediaIds);

        return newOrder;
      });
    }
  };

  const handleRemoveImage = (uuid: string) => {
    setMediaIds((prev) => prev.filter((id) => id !== uuid));
  };

  const handleSubmit = async () => {
    setLoading(true);
    await handleComplete('complete');
    setLoading(false);
  };

  return (
    <>
      <div className="flex flex-col justify-between h-full">
        {productMedia && productMedia.length > 0 && (
          <>
            <div>Drag Image to reorder</div>
            <div className="flex justify-between items-center border-b pb-4 mb-4">
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={productMedia.map((media) => media.uuid)}
                  strategy={horizontalListSortingStrategy}
                >
                  <div
                    className="flex gap-2 max-w-full"
                    style={{
                      overflowX: 'auto',
                      overflowY: 'visible',
                    }}
                  >
                    {productMedia.map((media: any) => (
                      <SortableImageItem key={media.uuid} media={media} onRemove={handleRemoveImage} />
                    ))}
                  </div>
                </SortableContext>
                <DragOverlay>
                  {activeId ? (
                    <div className="relative opacity-90">
                      <img
                        src={productMedia.find((m) => m.uuid === activeId)?.url}
                        alt="Dragging"
                        className="w-32 h-32 object-cover rounded shadow-lg"
                      />
                    </div>
                  ) : null}
                </DragOverlay>
              </DndContext>
              <button
                className="text-brown-900 px-4 py-2 rounded block transition-colors cursor-pointer hover:bg-orange-900 hover:text-white border border-orange-900"
                onClick={() => setCurrentStep(2)}
              >
                Edit
              </button>
            </div>
          </>
        )}
        <div className="flex justify-between items-center gap-8">
          <div className="flex flex-col h-full">
            <div>
              <h3 className="h5 font-bold text-balance mb-4 mt-2">{product.name}</h3>
              <p className="mb-4">{product.description}</p>
            </div>

            <p className="text-xl text-bold justify-self-end text-orange-800">${product.price}</p>
          </div>
          <button
            className="text-brown-900 px-4 py-2 rounded block transition-colors cursor-pointer hover:bg-orange-900 hover:text-white border border-orange-900"
            onClick={() => setCurrentStep(1)}
          >
            Edit
          </button>
        </div>
      </div>

      <div className="flex flex-row justify-between align-items-center mt-8">
        <button
          type="button"
          className="bg-white text-orange-900 px-4 py-2 rounded disabled:opacity-50 cursor-pointer border-orange-900 border"
          disabled={loading}
          onClick={() => setCurrentStep(2)}
        >
          {loading ? 'Saving...' : 'Back'}
        </button>
        <button
          type="button"
          className="bg-brown text-cream px-4 py-2 rounded disabled:opacity-50 cursor-pointer"
          disabled={loading}
          onClick={handleSubmit}
        >
          {loading ? 'Saving...' : 'Save & Close'}
        </button>
      </div>
    </>
  );
}
