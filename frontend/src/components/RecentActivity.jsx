import { FiBook, FiUserPlus, FiBookmark, FiRefreshCw } from 'react-icons/fi';

const ICON_MAP = {
  issue: { icon: FiBook, color: '--warning' },
  return: { icon: FiRefreshCw, color: '--info' },
  student: { icon: FiUserPlus, color: '--success' },
  book: { icon: FiBookmark, color: '--primary' },
};

export default function RecentActivity({ activities }) {
  if (!activities || activities.length === 0) {
    return (
      <div className="activity-empty">
        <p>No recent activity to display.</p>
      </div>
    );
  }

  return (
    <div className="activity-timeline">
      {activities.map((item) => {
        const { icon: ActIcon, color } = ICON_MAP[item.type] || ICON_MAP.book;
        return (
          <div key={item.id} className="activity-item">
            <div className="activity-dot" style={{ backgroundColor: `var(${color})` }}>
              <ActIcon />
            </div>
            <div className="activity-content">
              <p className="activity-text">{item.text}</p>
              <span className="activity-time">{item.time}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
