import { useState, useEffect } from 'react';
import { FiUsers, FiTrash2 } from 'react-icons/fi';
import { getStudents, deleteStudent } from '../services/api';
import ConfirmModal from './ConfirmModal';
import LoadingSkeleton from './LoadingSkeleton';

export default function StudentList({ refreshKey, onDelete }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const fetch = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getStudents();
        if (!cancelled) setStudents(res.data || []);
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
      await deleteStudent(confirm.id);
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
  if (students.length === 0) {
    return (
      <div className="empty-state">
        <FiUsers className="empty-state-icon" />
        <h3 className="empty-state-title">No students yet</h3>
        <p className="empty-state-text">Register students using the form above.</p>
      </div>
    );
  }

  return (
    <>
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Roll Number</th>
              <th>Department</th>
              <th>Phone</th>
              <th>Books Issued</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => {
              const issuedCount = student.issuedBooks?.length || 0;
              return (
                <tr key={student._id}>
                  <td><strong>{student.name}</strong></td>
                  <td>{student.email}</td>
                  <td><code>{student.rollNumber}</code></td>
                  <td>{student.department || '\u2014'}</td>
                  <td>{student.phone || '\u2014'}</td>
                  <td>
                    {issuedCount > 0
                      ? <span className="badge badge--info">{issuedCount} issued</span>
                      : <span className="badge badge--muted">None</span>
                    }
                  </td>
                  <td>
                    <button className="btn btn--danger btn--sm" onClick={() => setConfirm({ id: student._id, name: student.name })}>
                      <FiTrash2 /> Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <ConfirmModal
        isOpen={!!confirm}
        title="Delete Student"
        message={`Are you sure you want to delete "${confirm?.name}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setConfirm(null)}
        isLoading={deleting}
      />
    </>
  );
}
