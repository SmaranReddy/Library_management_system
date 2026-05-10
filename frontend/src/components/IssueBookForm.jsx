import { useState, useEffect } from 'react';
import { FiSend } from 'react-icons/fi';
import { getStudents, getBooks, issueBook } from '../services/api';

export default function IssueBookForm({ onSuccess }) {
  const [students, setStudents] = useState([]);
  const [books, setBooks] = useState([]);
  const [studentId, setStudentId] = useState('');
  const [bookId, setBookId] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const fetch = async () => {
      setFetching(true);
      try {
        const [sRes, bRes] = await Promise.all([getStudents(), getBooks()]);
        if (!cancelled) {
          setStudents(sRes.data || []);
          setBooks(bRes.data || []);
        }
      } catch (err) {
        if (!cancelled) setMessage({ type: 'error', text: 'Failed to load: ' + err.message });
      } finally {
        if (!cancelled) setFetching(false);
      }
    };
    fetch();
    return () => { cancelled = true; };
  }, []);

  const availableBooks = books.filter((b) => b.copiesAvailable > 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    if (!studentId || !bookId) {
      setMessage({ type: 'error', text: 'Please select both a student and a book.' });
      return;
    }

    setLoading(true);
    try {
      const res = await issueBook(studentId, bookId);
      setMessage({ type: 'success', text: res.message || 'Book issued successfully!' });
      setStudentId('');
      setBookId('');
      onSuccess();
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="form">
        <div className="skeleton" style={{ height: 42, marginBottom: 12 }} />
        <div className="skeleton" style={{ height: 42, marginBottom: 12 }} />
        <div className="skeleton" style={{ height: 42, width: 140 }} />
      </div>
    );
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      {message && (
        <div className={`msg msg--${message.type}`}>{message.text}</div>
      )}

      <div className="form-group">
        <label className="form-label" htmlFor="issue-student">Student *</label>
        <select className="form-select" id="issue-student" value={studentId} onChange={(e) => setStudentId(e.target.value)}>
          <option value="">&mdash; Select a student &mdash;</option>
          {students.map((s) => (
            <option key={s._id} value={s._id}>
              {s.name} ({s.rollNumber})
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="issue-book">Book *</label>
        <select className="form-select" id="issue-book" value={bookId} onChange={(e) => setBookId(e.target.value)}>
          <option value="">&mdash; Select a book &mdash;</option>
          {availableBooks.map((b) => (
            <option key={b._id} value={b._id}>
              {b.title} by {b.author} ({b.copiesAvailable} avail.)
            </option>
          ))}
        </select>
        {availableBooks.length === 0 && (
          <span className="form-hint">No books available for issue right now.</span>
        )}
      </div>

      <button className="btn btn--primary" type="submit" disabled={loading || !studentId || !bookId}>
        <FiSend /> {loading ? 'Issuing\u2026' : 'Issue Book'}
      </button>
    </form>
  );
}
