interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog = ({ isOpen, title, onConfirm, onCancel }: ConfirmDialogProps) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-primary/50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface p-6 rounded-xl border border-border shadow-lg max-w-sm w-full">
        <h3 className="font-bold text-lg text-primary mb-4">{title}</h3>
        <div className="flex gap-4">
          <button className="bg-red-600 text-white px-4 py-2 rounded-lg" onClick={onConfirm}>Delete</button>
          <button className="bg-border text-primary px-4 py-2 rounded-lg" onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
};
