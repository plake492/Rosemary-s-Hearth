export default function DeleteConfirmation({
  onConfirm,
  onCancel,
  label,
}: {
  label?: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="my-8">
      <h2 className="text-lg font-bold">{label || 'Confirm Delete'}</h2>
      <div className="flex justify-between mt-8">
        <button
          className="cursor-pointer bg-red-500 text-white px-4 py-2 rounded"
          onClick={onConfirm}
        >
          Confirm Delete
        </button>
        <button
          className="cursor-pointer bg-gray-300 text-black px-4 py-2 rounded"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
