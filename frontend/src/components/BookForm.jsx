import { useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import { createBook } from '../services/api';
import LoadingSkeleton from './LoadingSkeleton';

const INITIAL = { title: '', author: '', isbn: '', publishedYear: '', genre: '', totalCopies: '' };

export default function BookForm({ onSuccess }) {
  const [form, setForm] = useState(INITIAL);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (!form.title.trim() || !form.author.trim() || !form.isbn.trim()) {
      setMessage({ type: 'error', text: 'Title, Author, and ISBN are required.' });
      return;
    }

    const payload = {
      title: form.title.trim(),
      author: form.author.trim(),
      isbn: form.isbn.trim(),
      ...(form.publishedYear && { publishedYear: Number(form.publishedYear) }),
      ...(form.genre.trim() && { genre: form.genre.trim() }),
      ...(form.totalCopies && { totalCopies: Number(form.totalCopies) }),
    };

    setLoading(true);
    try {
      await createBook(payload);
      setMessage({ type: 'success', text: 'Book added successfully!' });
      setForm(INITIAL);
      onSuccess();
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      {message && (
        <div className={`msg msg--${message.type}`}>{message.text}</div>
      )}

      <div className="form-row">
        <div className="form-group">
          <label className="form-label" htmlFor="title">Title *</label>
          <input className="form-input" id="title" name="title" value={form.title} onChange={handleChange} placeholder="Book title" />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="author">Author *</label>
          <input className="form-input" id="author" name="author" value={form.author} onChange={handleChange} placeholder="Author name" />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label" htmlFor="isbn">ISBN *</label>
          <input className="form-input" id="isbn" name="isbn" value={form.isbn} onChange={handleChange} placeholder="Unique ISBN" />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="publishedYear">Published Year</label>
          <input className="form-input" id="publishedYear" name="publishedYear" type="number" value={form.publishedYear} onChange={handleChange} placeholder="e.g. 2024" />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label" htmlFor="genre">Genre</label>
          <input className="form-input" id="genre" name="genre" value={form.genre} onChange={handleChange} placeholder="e.g. Fiction" />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="totalCopies">Total Copies</label>
          <input className="form-input" id="totalCopies" name="totalCopies" type="number" min="1" value={form.totalCopies} onChange={handleChange} placeholder="Default: 1" />
        </div>
      </div>

      <button className="btn btn--primary" type="submit" disabled={loading}>
        <FiPlus /> {loading ? 'Adding\u2026' : 'Add Book'}
      </button>
    </form>
  );
}
