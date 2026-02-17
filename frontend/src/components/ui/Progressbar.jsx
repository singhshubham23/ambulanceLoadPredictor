export default function ProgressBar({ value, label = "CAPACITY" }) {
  const cls = value > 90 ? "r" : value > 70 ? "o" : value > 40 ? "y" : "g";
  return (
    <div className="prog-wrap">
      <div className="prog-header">
        <span className="prog-label">{label}</span>
        <span className="prog-pct">{value}%</span>
      </div>
      <div className="prog-track">
        <div
          className={`prog-fill ${cls}`}
          style={{ width: `${Math.min(value, 100)}%` }}
        />
      </div>
    </div>
  );
}