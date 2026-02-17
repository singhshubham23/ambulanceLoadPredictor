import Card from "../ui/Card";
import Badge from "../ui/Badge";
import ProgressBar from "../ui/Progressbar";

function PredictionResult({ data }) {
  return (
    <Card title="Prediction Result">
      <h2 className="fw-bold text-primary">
        {data.prediction.toFixed(2)}%
      </h2>

      <ProgressBar value={data.prediction} />

      <div className="mt-3">
        <Badge level={data.alertLevel} />
      </div>

      {data.alert?.trigger && (
        <div className="alert alert-danger mt-3">
          {data.alert.message}
        </div>
      )}
    </Card>
  );
}

export default PredictionResult;
