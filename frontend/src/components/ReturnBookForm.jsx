import { useState, useEffect } from 'react';
import { FiUser, FiBook } from 'react-icons/fi';
import { getStudents, getBooks, returnBook } from '../services/api';

export default function ReturnBookForm({ onSuccess }) {
  const [students, setStudents] = useState([]);
  const [books, setBooks] = useState([]);
  const [studentId, setStudentId] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [message, setMessage] = useState(null);
  const [returningId, setReturningId] = useState(null);

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

  useEffect(() => {
    if (!studentId) {
      setSelectedStudent(null);
      return;
    }
    const student = students.find((s) => s._id === studentId);
    setSelectedStudent(student || null);
  }, [studentId, students]);

  const bookMap = {};
  books.forEach((b) => { bookMap[b._id] = b; });

  // The backend populates issuedBooks with full book objects
  const issuedBooks = selectedStudent?.issuedBooks || [];

  const handleReturn = async (bookId) => {
    setMessage(null);
    setReturningId(bookId);
    setLoading(true);
    try {
      const res = await returnBook(studentId, bookId);
      setMessage({ type: 'success', text: res.message || 'Book returned successfully!' });
      onSuccess();
      const sRes = await getStudents();
      setStudents(sRes.data || []);
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setReturningId(null);
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="form">
        <div className="skeleton" style={{ height: 42, marginBottom: 12 }} />
        <div className="skeleton" style={{ height: 42 }} />
      </div>
    );
  }

  return (
    <div className="form">
      {message && (
        <div className={`msg msg--${message.type}`}>{message.text}</div>
      )}

      <div className="form-group">
        <label className="form-label" htmlFor="return-student">Select Student *</label>
        <select className="form-select" id="return-student" value={studentId} onChange={(e) => setStudentId(e.target.value)}>
          <option value="">&mdash; Select a student &mdash;</option>
          {students
            .filter((s) => s.issuedBooks && s.issuedBooks.length > 0)
            .map((s) => (
              <option key={s._id} value={s._id}>
                {s.name} ({s.rollNumber}) &mdash; {s.issuedBooks.length} book(s)
              </option>
            ))}
        </select>
        {students.filter((s) => s.issuedBooks && s.issuedBooks.length > 0).length === 0 && (
          <span className="form-hint">No students with issued books at the moment.</span>
        )}
      </div>

      {selectedStudent && (
        <>
          <div className="student-info-box">
            <FiUser /> <strong>{selectedStudent.name}</strong>
            {selectedStudent.department && <> &mdash; {selectedStudent.department}</>}
            &nbsp;&middot;&nbsp; {issuedBooks.length} book(s) issued
          </div>

          {issuedBooks.length === 0 ? (
            <div className="msg msg--info">
              <FiBook /> This student has no books issued currently.
            </div>
          ) : (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Book Title</th>
                    <th>Author</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {issuedBooks.map((book) => {
                    // book can be a populated object or just an ID
                    const b = typeof book === 'object' && book !== null ? book : bookMap[book];
                    const bid = b?._id || book;
                    return (
                      <tr key={bid}>
                        <td><strong>{b?.title || 'Unknown'}</strong></td>
                        <td>{b?.author || '\u2014'}</td>
                        <td>
                          <button
                            className="btn btn--primary btn--sm"
                            onClick={() => handleReturn(bid)}
                            disabled={loading}
                          >
                            {loading && returningId === bid ? 'Returning\u2026' : 'Return'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}
