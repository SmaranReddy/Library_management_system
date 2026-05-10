import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts';
import { FiBook, FiUsers } from 'react-icons/fi';

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];

export default function LibraryInsights({ books, students }) {
  const totalBooks = books.length;
  const totalCopies = books.reduce((s, b) => s + (b.totalCopies || 0), 0);
  const availableCopies = books.reduce((s, b) => s + (b.copiesAvailable || 0), 0);
  const issuedCount = totalCopies - availableCopies;
  const totalStudents = students.length;
  const activeStudents = students.filter((s) => (s.issuedBooks?.length || 0) > 0).length;

  // Donut chart data: issued vs available
  const donutData = [
    { name: 'Available', value: Math.max(availableCopies, 0) },
    { name: 'Issued', value: Math.max(issuedCount, 0) },
  ];

  // Genre bar chart data
  const genreMap = {};
  books.forEach((b) => {
    const g = b.genre || 'Uncategorized';
    genreMap[g] = (genreMap[g] || 0) + 1;
  });
  const genreData = Object.entries(genreMap)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  // Progress percentages
  const availPercent = totalCopies > 0 ? Math.round((availableCopies / totalCopies) * 100) : 0;
  const issuedPercent = totalCopies > 0 ? Math.round((issuedCount / totalCopies) * 100) : 0;
  const engagementPercent = totalStudents > 0 ? Math.round((activeStudents / totalStudents) * 100) : 0;

  return (
    <div className="insights-grid">
      {/* Donut Chart */}
      <div className="insight-card">
        <h4 className="insight-title">Collection Overview</h4>
        <div className="insight-chart">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={donutData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={85}
                paddingAngle={4}
                dataKey="value"
                stroke="none"
              >
                {donutData.map((entry, i) => (
                  <Cell key={entry.name} fill={i === 0 ? '#10b981' : '#f59e0b'} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="insight-legend">
          <span className="legend-item"><span className="legend-dot" style={{ background: '#10b981' }} /> Available ({availableCopies})</span>
          <span className="legend-item"><span className="legend-dot" style={{ background: '#f59e0b' }} /> Issued ({issuedCount})</span>
        </div>
      </div>

      {/* Genre Bar Chart */}
      <div className="insight-card">
        <h4 className="insight-title">Books by Genre</h4>
        {genreData.length === 0 ? (
          <div className="insight-empty">No genre data available.</div>
        ) : (
          <div className="insight-chart">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={genreData} margin={{ top: 0, right: 0, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {genreData.map((entry, i) => (
                    <Cell key={entry.name} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Progress Metrics */}
      <div className="insight-card">
        <h4 className="insight-title">Key Metrics</h4>
        <div className="insight-metrics">
          <div className="metric">
            <div className="metric-header">
              <FiBook className="metric-icon" />
              <span className="metric-label">Inventory Utilization</span>
              <span className="metric-value">{issuedPercent}%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill progress-fill--amber" style={{ width: `${issuedPercent}%` }} />
            </div>
          </div>

          <div className="metric">
            <div className="metric-header">
              <FiBook className="metric-icon" />
              <span className="metric-label">Available Stock</span>
              <span className="metric-value">{availPercent}%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill progress-fill--green" style={{ width: `${availPercent}%` }} />
            </div>
          </div>

          <div className="metric">
            <div className="metric-header">
              <FiUsers className="metric-icon" />
              <span className="metric-label">Student Engagement</span>
              <span className="metric-value">{engagementPercent}%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill progress-fill--blue" style={{ width: `${engagementPercent}%` }} />
            </div>
          </div>

          <div className="metric-stat-row">
            <div className="metric-stat">
              <span className="metric-stat-value">{totalBooks}</span>
              <span className="metric-stat-label">Total Titles</span>
            </div>
            <div className="metric-stat">
              <span className="metric-stat-value">{totalStudents}</span>
              <span className="metric-stat-label">Members</span>
            </div>
            <div className="metric-stat">
              <span className="metric-stat-value">{activeStudents}</span>
              <span className="metric-stat-label">Active Borrowers</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
