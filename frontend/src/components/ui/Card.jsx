export default function Card({ title, children }) {
  return (
    <div className="card shadow-sm mb-3">
      <div className="card-body">
        {title && <h5 className="card-title">{title}</h5>}
        {children}
      </div>
    </div>
  );
}
