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
    <div className="">
      <h2 className="text-lg font-bold">{label || 'Confirm Delete'}</h2>
      <div className="flex justify-between mt-8 gap-18">
        <button
          className="cursor-pointer border border-red-500 bg-white text-red-500 px-4 py-2 rounded"
          onClick={onConfirm}
        >
          Confirm Delete
        </button>
        <button
          className="cursor-pointer bg-gray-300 text-black px-4 py-2 rounded flex-1"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
