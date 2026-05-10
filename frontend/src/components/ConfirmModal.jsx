import { FiAlertTriangle } from 'react-icons/fi';

export default function ConfirmModal({
  isOpen,
  title = 'Confirm',
  message = 'Are you sure?',
  confirmLabel = 'Delete',
  onConfirm,
  onCancel,
  isLoading = false,
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-icon">
          <FiAlertTriangle />
        </div>
        <h3 className="modal-title">{title}</h3>
        <p className="modal-message">{message}</p>
        <div className="modal-actions">
          <button className="btn btn--ghost" onClick={onCancel} disabled={isLoading}>
            Cancel
          </button>
          <button className="btn btn--danger" onClick={onConfirm} disabled={isLoading}>
            {isLoading ? 'Deleting\u2026' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
