import { FiBook, FiUserPlus, FiSend, FiRepeat } from 'react-icons/fi';

const actions = [
  { key: 'books', label: 'Add Book', desc: 'Add a new title to the library catalog', icon: FiBook, color: 'blue' },
  { key: 'students', label: 'Add Student', desc: 'Register a new library member', icon: FiUserPlus, color: 'green' },
  { key: 'issue', label: 'Issue Book', desc: 'Issue a book to a student', icon: FiSend, color: 'purple' },
  { key: 'return', label: 'Return Book', desc: 'Process a book return', icon: FiRepeat, color: 'orange' },
];

export default function QuickActions({ onNavigate }) {
  return (
    <div className="quick-actions-grid">
      {actions.map((act) => (
        <button key={act.label} className={`quick-action-card quick-action-card--${act.color}`} onClick={() => onNavigate(act.key)}>
          <div className="quick-action-icon">
            <act.icon />
          </div>
          <div className="quick-action-text">
            <span className="quick-action-label">{act.label}</span>
            <span className="quick-action-desc">{act.desc}</span>
          </div>
        </button>
      ))}
    </div>
  );
}
