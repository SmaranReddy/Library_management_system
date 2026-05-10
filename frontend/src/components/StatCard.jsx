import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi';

export default function StatCard({ icon: Icon, value, label, color, trend }) {
  const trendUp = trend > 0;
  const TrendIcon = trendUp ? FiTrendingUp : FiTrendingDown;

  return (
    <div className="stat-card">
      <div className="stat-card-top">
        <div className={`stat-card-icon stat-card-icon--${color}`}>
          <Icon />
        </div>
        {trend !== undefined && (
          <span className={`stat-card-trend ${trendUp ? 'stat-card-trend--up' : 'stat-card-trend--down'}`}>
            <TrendIcon /> {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div className="stat-card-body">
        <span className="stat-card-value">{value}</span>
        <span className="stat-card-label">{label}</span>
      </div>
    </div>
  );
}
