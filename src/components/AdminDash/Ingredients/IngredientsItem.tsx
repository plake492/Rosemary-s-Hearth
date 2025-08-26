import IconButton from '@/components/IconButton';
import { OutlineModeEdit, BaselineDelete } from '@/components/Svg';

export default function IngredientsItem({ item, hideDeleteButton = false }: { item: any; hideDeleteButton?: boolean }) {
  // TODO: Implement edit and delete functionality
  const handleEdit = () => {
    console.log('Edit ingredient:', item);
    // setShowEditModal(true);
  };

  const handleDelete = () => {
    console.log('Delete ingredient:', item);
    // setShowDeleteConfirmation(true);
  };

  return (
    <li className="list-none [&:not(:last-child)]:mb-2 hover:bg-gray-100 transition-colors">
      <div className="mb-2 grid grid-cols-3 gap-4 items-center pl-2">
        <p>{item.name}</p>
        <p>{item.quantity}</p>
        <div className="flex gap-2 items-center">
          <IconButton
            className="w-12 h-12 p-2.5 hover:bg-emerald-200 rounded-full cursor-pointer transition color-brown-700"
            onClick={handleEdit}
            aria-label="Edit media item"
          >
            <OutlineModeEdit />
          </IconButton>

          {!hideDeleteButton && (
            <IconButton
              className="w-12 h-12 p-2.5 hover:bg-orange-700 hover:color-white-200 rounded-full cursor-pointer transition color-brown-700"
              onClick={handleDelete}
            >
              <BaselineDelete />
            </IconButton>
          )}
        </div>
      </div>
    </li>
  );
}
