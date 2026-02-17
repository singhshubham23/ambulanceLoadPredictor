export default function AlertToasts({ alerts, onDismiss }) {
  return (
    <div className="toast-stack">
      {alerts.map((a) => (
        <div key={a.id} className={`toast-item ${a.alertLevel}`}>
          <div className="toast-header">
            <div>
              <div className="toast-designator">// ZONE ALERT</div>
              <div className="toast-zone">{a.zone} — {a.alertLevel}</div>
            </div>
            <button className="toast-close" onClick={() => onDismiss(a.id)}>✕</button>
          </div>
          <div className="toast-msg">{a.message}</div>
        </div>
      ))}
    </div>
  );
}