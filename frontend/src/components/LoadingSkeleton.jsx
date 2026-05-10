export default function LoadingSkeleton({ type = 'card', count = 1 }) {
  if (type === 'table') {
    return (
      <div className="skeleton-table">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="skeleton-table-row">
            {Array.from({ length: 5 }).map((__, j) => (
              <div key={j} className="skeleton skeleton-table-cell" />
            ))}
          </div>
        ))}
      </div>
    );
  }

  if (type === 'form') {
    return (
      <div className="skeleton-form">
        <div className="skeleton-form-row">
          <div className="skeleton-form-group">
            <div className="skeleton skeleton-form-label" />
            <div className="skeleton skeleton-form-input" />
          </div>
          <div className="skeleton-form-group">
            <div className="skeleton skeleton-form-label" />
            <div className="skeleton skeleton-form-input" />
          </div>
        </div>
        <div className="skeleton-form-row">
          <div className="skeleton-form-group">
            <div className="skeleton skeleton-form-label" />
            <div className="skeleton skeleton-form-input" />
          </div>
          <div className="skeleton-form-group">
            <div className="skeleton skeleton-form-label" />
            <div className="skeleton skeleton-form-input" />
          </div>
        </div>
        <div className="skeleton" style={{ height: 42, width: 140, borderRadius: 8, marginTop: 8 }} />
      </div>
    );
  }

  // Default: card skeleton
  return (
    <div className="skeleton skeleton-card">
      <div className="skeleton" style={{ height: 22, width: '45%', marginBottom: 16 }} />
      <div className="skeleton" style={{ height: 14, width: '90%', marginBottom: 8 }} />
      <div className="skeleton" style={{ height: 14, width: '70%', marginBottom: 8 }} />
      <div className="skeleton" style={{ height: 14, width: '50%' }} />
    </div>
  );
}
