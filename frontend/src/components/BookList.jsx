import { useState, useEffect } from 'react';
import { FiBook, FiTrash2 } from 'react-icons/fi';
import { getBooks, deleteBook } from '../services/api';
import ConfirmModal from './ConfirmModal';
import LoadingSkeleton from './LoadingSkeleton';

export default function BookList({ refreshKey, onDelete }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirm, setConfirm] = useState(null); // { id, title }
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const fetch = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getBooks();
        if (!cancelled) setBooks(res.data || []);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetch();
    return () => { cancelled = true; };
  }, [refreshKey]);

  const handleDelete = async () => {
    if (!confirm) return;
    setDeleting(true);
    try {
      await deleteBook(confirm.id);
      setConfirm(null);
      onDelete();
    } catch (err) {
      alert(err.message);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <LoadingSkeleton type="table" count={5} />;
  if (error) return <div className="msg msg--error">{error}</div>;
  if (books.length === 0) {
    return (
      <div className="empty-state">
        <FiBook className="empty-state-icon" />
        <h3 className="empty-state-title">No books yet</h3>
        <p className="empty-state-text">Start by adding a book using the form above.</p>
      </div>
    );
  }

  return (
    <>
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>ISBN</th>
              <th>Genre</th>
              <th>Available</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book._id}>
                <td><strong>{book.title}</strong></td>
                <td>{book.author}</td>
                <td><code>{book.isbn}</code></td>
                <td>{book.genre || '\u2014'}</td>
                <td>{book.copiesAvailable} / {book.totalCopies}</td>
                <td>
                  {book.copiesAvailable > 0
                    ? <span className="badge badge--success">Available</span>
                    : <span className="badge badge--error">Unavailable</span>
                  }
                </td>
                <td>
                  <button className="btn btn--danger btn--sm" onClick={() => setConfirm({ id: book._id, title: book.title })}>
                    <FiTrash2 /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmModal
        isOpen={!!confirm}
        title="Delete Book"
        message={`Are you sure you want to delete "${confirm?.title}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setConfirm(null)}
        isLoading={deleting}
      />
    </>
  );
}
