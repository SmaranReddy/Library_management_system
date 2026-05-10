import { FiGrid, FiBook, FiUsers, FiSend, FiRepeat, FiBook as FiLogo, FiX } from 'react-icons/fi';

const NAV_ITEMS = [
  { key: 'dashboard', label: 'Dashboard', icon: FiGrid },
  { key: 'books', label: 'Books', icon: FiBook },
  { key: 'students', label: 'Students', icon: FiUsers },
  { key: 'issue', label: 'Issue Book', icon: FiSend },
  { key: 'return', label: 'Return Book', icon: FiRepeat },
];

export default function Sidebar({ activePage, onNavigate, isOpen, onToggle }) {
  return (
    <>
      {/* Dark overlay for mobile */}
      {isOpen && <div className="sidebar-overlay" onClick={onToggle} />}

      <aside className={`sidebar ${isOpen ? 'sidebar--open' : ''}`}>
        {/* Brand / Logo */}
        <div className="sidebar-brand">
          <div className="sidebar-logo">
            <FiLogo className="sidebar-logo-icon" />
          </div>
          <div className="sidebar-brand-text">
            <span className="sidebar-brand-title">Library</span>
            <span className="sidebar-brand-subtitle">Management</span>
          </div>
          <button className="sidebar-close" onClick={onToggle} aria-label="Close sidebar">
            <FiX />
          </button>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {NAV_ITEMS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              className={`sidebar-link ${activePage === key ? 'sidebar-link--active' : ''}`}
              onClick={() => {
                onNavigate(key);
                if (isOpen) onToggle(); // close sidebar on mobile after navigating
              }}
            >
              <Icon className="sidebar-link-icon" />
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </aside>
    </>
  );
}
