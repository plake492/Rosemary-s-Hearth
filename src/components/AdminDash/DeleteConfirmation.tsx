import Button from '@/components/Button';

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
        <Button variant="error-border" className="cursor-pointer" fullWidth onClick={onConfirm}>
          Confirm Delete
        </Button>
        <Button className="cursor-pointer" fullWidth onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
