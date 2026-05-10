import { useState } from 'react';
import { FiMenu } from 'react-icons/fi';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import BookForm from './components/BookForm';
import BookList from './components/BookList';
import StudentForm from './components/StudentForm';
import StudentList from './components/StudentList';
import IssueBookPage from './components/IssueBookPage';
import ReturnBookPage from './components/ReturnBookPage';

const PAGE_INFO = {
  dashboard: { title: 'Dashboard', subtitle: 'Library Management System' },
  books: { title: 'Books', subtitle: 'Manage library book inventory' },
  students: { title: 'Students', subtitle: 'Manage registered students' },
  issue: { title: 'Issue Book', subtitle: 'Issue a book to a student' },
  return: { title: 'Return Book', subtitle: 'Return a borrowed book' },
};

export default function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Separate refresh counters so lists only re-fetch when relevant data changes
  const [booksRefreshKey, setBooksRefreshKey] = useState(0);
  const [studentsRefreshKey, setStudentsRefreshKey] = useState(0);

  const handleBookMutation = () => setBooksRefreshKey((k) => k + 1);
  const handleStudentMutation = () => setStudentsRefreshKey((k) => k + 1);
  const handleTransaction = () => {
    setBooksRefreshKey((k) => k + 1);
    setStudentsRefreshKey((k) => k + 1);
  };

  const page = PAGE_INFO[activePage];

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard onNavigate={setActivePage} />;

      case 'books':
        return (
          <>
            <section className="card">
              <h3 className="card-title">Add New Book</h3>
              <BookForm onSuccess={handleBookMutation} />
            </section>
            <section className="card">
              <h3 className="card-title">All Books</h3>
              <BookList refreshKey={booksRefreshKey} onDelete={handleBookMutation} />
            </section>
          </>
        );

      case 'students':
        return (
          <>
            <section className="card">
              <h3 className="card-title">Add New Student</h3>
              <StudentForm onSuccess={handleStudentMutation} />
            </section>
            <section className="card">
              <h3 className="card-title">All Students</h3>
              <StudentList refreshKey={studentsRefreshKey} onDelete={handleStudentMutation} />
            </section>
          </>
        );

      case 'issue':
        return <IssueBookPage onSuccess={handleTransaction} />;

      case 'return':
        return <ReturnBookPage onSuccess={handleTransaction} />;

      default:
        return null;
    }
  };

  return (
    <div className="app-layout">
      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen((v) => !v)}
      />

      <div className="main-content">
        <header className="main-header">
          <button className="header-menu-btn" onClick={() => setSidebarOpen(true)} aria-label="Open menu">
            <FiMenu />
          </button>
          <div>
            <h1 className="page-title">{page.title}</h1>
            <p className="page-subtitle">{page.subtitle}</p>
          </div>
        </header>

        <div className="main-body">
          {renderPage()}
        </div>
      </div>
    </div>
  );
}
