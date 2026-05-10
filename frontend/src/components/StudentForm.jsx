import { useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import { createStudent } from '../services/api';

const INITIAL = { name: '', email: '', rollNumber: '', department: '', phone: '' };

export default function StudentForm({ onSuccess }) {
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

    if (!form.name.trim() || !form.email.trim() || !form.rollNumber.trim()) {
      setMessage({ type: 'error', text: 'Name, Email, and Roll Number are required.' });
      return;
    }

    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      rollNumber: form.rollNumber.trim(),
      ...(form.department.trim() && { department: form.department.trim() }),
      ...(form.phone.trim() && { phone: form.phone.trim() }),
    };

    setLoading(true);
    try {
      await createStudent(payload);
      setMessage({ type: 'success', text: 'Student added successfully!' });
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
          <label className="form-label" htmlFor="name">Name *</label>
          <input className="form-input" id="name" name="name" value={form.name} onChange={handleChange} placeholder="Full name" />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="email">Email *</label>
          <input className="form-input" id="email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="student@example.com" />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label" htmlFor="rollNumber">Roll Number *</label>
          <input className="form-input" id="rollNumber" name="rollNumber" value={form.rollNumber} onChange={handleChange} placeholder="Unique roll number" />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="department">Department</label>
          <input className="form-input" id="department" name="department" value={form.department} onChange={handleChange} placeholder="e.g. Computer Science" />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label" htmlFor="phone">Phone</label>
          <input className="form-input" id="phone" name="phone" value={form.phone} onChange={handleChange} placeholder="Contact number" />
        </div>
        <div className="form-group" />
      </div>

      <button className="btn btn--primary" type="submit" disabled={loading}>
        <FiPlus /> {loading ? 'Adding\u2026' : 'Add Student'}
      </button>
    </form>
  );
}
