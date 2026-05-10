import ReturnBookForm from './ReturnBookForm';

export default function ReturnBookPage({ onSuccess }) {
  return (
    <section className="card">
      <h3 className="card-title">Return a Book</h3>
      <ReturnBookForm onSuccess={onSuccess} />
    </section>
  );
}
