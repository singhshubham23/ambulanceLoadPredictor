export default function Spinner({ label = "LOADING DATA" }) {
  return (
    <div className="spinner-center">
      <div className="spinner-ring" />
      <div className="spinner-label">{label}</div>
    </div>
  );
}