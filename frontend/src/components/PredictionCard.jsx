import RiskBadge from "./RiskBadge";

function PredictionCard({ prediction, alert }) {
  return (
    <div className="card shadow-sm p-4">
      <h5>Predicted ED Load</h5>
      <h2 className="fw-bold text-primary">
        {prediction?.toFixed(2)}%
      </h2>

      <div className="my-3">
        <RiskBadge level={alert?.level || "LOW"} />
      </div>

      {alert?.trigger && (
        <div className="alert alert-danger mt-3">
          {alert.message}
        </div>
      )}
    </div>
  );
}

export default PredictionCard;
