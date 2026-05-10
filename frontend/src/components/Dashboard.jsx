import { useState, useEffect } from 'react';
import { FiBook, FiBookOpen, FiUsers, FiBookmark } from 'react-icons/fi';
import { getBooks, getStudents } from '../services/api';
import StatCard from './StatCard';
import RecentActivity from './RecentActivity';
import QuickActions from './QuickActions';
import LibraryInsights from './LibraryInsights';

/*
 * Generates a timeline of recent library activities from the current data.
 * Falls back to mock entries when there is minimal activity so the panel
 * never appears empty.
 */
function generateActivities(books, students) {
  const activities = [];
  const now = Date.now();

  books.forEach((b) => {
    const issued = (b.totalCopies || 0) - (b.copiesAvailable || 0);
    if (issued > 0) {
      activities.push({
        id: `issue-${b._id}`,
        type: 'issue',
        text: `"${b.title}" issued to a student`,
        time: 'Today',
        ts: now,
      });
    }
  });

  students.forEach((s) => {
    const count = s.issuedBooks?.length || 0;
    if (count > 0) {
      activities.push({
        id: `active-${s._id}`,
        type: 'student',
        text: `${s.name} has ${count} book(s) issued`,
        time: 'Active',
        ts: now,
      });
    }
    // Simulate a "new student added" entry for every student
    activities.push({
      id: `new-${s._id}`,
      type: 'student',
      text: `${s.name} registered as a new member`,
      time: new Date(s.createdAt || now).toLocaleDateString(),
      ts: new Date(s.createdAt || now).getTime(),
    });
  });

  books.forEach((b) => {
    if (b.createdAt) {
      activities.push({
        id: `book-added-${b._id}`,
        type: 'book',
        text: `"${b.title}" added to the catalog`,
        time: new Date(b.createdAt).toLocaleDateString(),
        ts: new Date(b.createdAt).getTime(),
      });
    }
  });

  // Sort by timestamp descending, take top 5
  activities.sort((a, b) => b.ts - a.ts);
  return activities.slice(0, 5);
}

export default function Dashboard({ onNavigate }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      setLoading(true);
      try {
        const [booksRes, studentsRes] = await Promise.all([getBooks(), getStudents()]);
        if (cancelled) return;

        const books = booksRes.data || [];
        const students = studentsRes.data || [];

        const totalBooks = books.length;
        const totalCopies = books.reduce((sum, b) => sum + (b.totalCopies || 0), 0);
        const availableCopies = books.reduce((sum, b) => sum + (b.copiesAvailable || 0), 0);
        const issuedCount = totalCopies - availableCopies;
        const totalStudents = students.length;

        const activities = generateActivities(books, students);

        setData({ books, students, stats: { totalBooks, availableCopies, totalStudents, issuedCount }, activities });
      } catch {
        if (!cancelled) setData(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchData();
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <div className="dashboard">
        <div className="dashboard-greeting">
          <div className="skeleton" style={{ height: 30, width: '280px', marginBottom: 8 }} />
          <div className="skeleton" style={{ height: 18, width: '400px', marginBottom: 24 }} />
        </div>
        <div className="skeleton-stat-grid">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton skeleton-stat" />
          ))}
        </div>
        <div className="dashboard-bottom-grid">
          <div className="skeleton" style={{ height: 260, borderRadius: 12 }} />
          <div className="skeleton" style={{ height: 260, borderRadius: 12 }} />
        </div>
        <div className="skeleton" style={{ height: 240, borderRadius: 12, marginTop: 20 }} />
      </div>
    );
  }

  const { books, students, stats, activities } = data || {};
  const s = stats || {};

  const statCards = [
    { icon: FiBook, value: s.totalBooks ?? 0, label: 'Total Books', color: 'blue', trend: 0 },
    { icon: FiBookOpen, value: s.availableCopies ?? 0, label: 'Available Copies', color: 'green', trend: 0 },
    { icon: FiUsers, value: s.totalStudents ?? 0, label: 'Total Students', color: 'purple', trend: 0 },
    { icon: FiBookmark, value: s.issuedCount ?? 0, label: 'Issued Books', color: 'orange', trend: 0 },
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-greeting">
        <h2>Dashboard Overview</h2>
        <p>Monitor your library operations in real time.</p>
      </div>

      {/* ── Stats Row ── */}
      <div className="stats-grid">
        {statCards.map((card, i) => (
          <StatCard key={i} {...card} />
        ))}
      </div>

      {/* ── Bottom Row: Activity + Quick Actions ── */}
      <div className="dashboard-bottom-grid">
        <section className="dash-card">
          <h3 className="dash-card-title">Recent Activity</h3>
          <RecentActivity activities={activities} />
        </section>
        <section className="dash-card">
          <h3 className="dash-card-title">Quick Actions</h3>
          <QuickActions onNavigate={onNavigate} />
        </section>
      </div>

      {/* ── Library Insights ── */}
      <section className="dash-card">
        <h3 className="dash-card-title">Library Insights</h3>
        <LibraryInsights books={books || []} students={students || []} />
      </section>
    </div>
  );
}
