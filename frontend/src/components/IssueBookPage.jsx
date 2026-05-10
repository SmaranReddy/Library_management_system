import IssueBookForm from './IssueBookForm';

export default function IssueBookPage({ onSuccess }) {
  return (
    <section className="card">
      <h3 className="card-title">Issue a Book</h3>
      <IssueBookForm onSuccess={onSuccess} />
    </section>
  );
}
