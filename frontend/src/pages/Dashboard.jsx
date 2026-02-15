import { useState } from "react";
import { predictEmergencyLoad } from "../services/api";
import Loader from "../components/Loader";
import PredictionCard from "../components/PredictionCard";

function Dashboard() {
  const [formData, setFormData] = useState({
    dayOfWeek: 1,
    month: 1,
    isFestival: 0,
    temperature: 30,
    rainfall: 0,
  });

  const [loading, setLoading] = useState(false);
  const [predictionData, setPredictionData] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: Number(e.target.value),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await predictEmergencyLoad(formData);
      setPredictionData(res.data.data);
    } catch (err) {
      alert("Prediction failed");
    }

    setLoading(false);
  };

  return (
    <div className="container-fluid p-4">
      <div className="row">
        {/* FORM */}
        <div className="col-lg-6 mb-4">
          <div className="card shadow-sm p-4">
            <h5 className="mb-3">Input Parameters</h5>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label>Day of Week (0-6)</label>
                <input
                  type="number"
                  name="dayOfWeek"
                  className="form-control"
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label>Month (1-12)</label>
                <input
                  type="number"
                  name="month"
                  className="form-control"
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label>Festival (0/1)</label>
                <select
                  name="isFestival"
                  className="form-select"
                  onChange={handleChange}
                >
                  <option value={0}>No</option>
                  <option value={1}>Yes</option>
                </select>
              </div>

              <div className="mb-3">
                <label>Temperature (°C)</label>
                <input
                  type="number"
                  name="temperature"
                  className="form-control"
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label>Rainfall (mm)</label>
                <input
                  type="number"
                  name="rainfall"
                  className="form-control"
                  onChange={handleChange}
                  required
                />
              </div>

              <button className="btn btn-primary w-100">
                Predict Load
              </button>
            </form>
          </div>
        </div>

        <div className="col-lg-6">
          {loading && <Loader />}

          {predictionData && !loading && (
            <PredictionCard
              prediction={predictionData.prediction}
              alert={{
                level: predictionData.alertLevel,
                trigger: predictionData.alert?.trigger,
                message: predictionData.alert?.message,
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
