function PredictionForm({ formData, onChange, onSubmit }) {
  return (
    <form onSubmit={onSubmit} className="row g-3">
      {Object.keys(formData).map((key) => (
        <div className="col-md-6" key={key}>
          <label className="form-label text-capitalize">
            {key}
          </label>
          <input
            type="number"
            className="form-control"
            name={key}
            value={formData[key]}
            onChange={onChange}
            required
          />
        </div>
      ))}

      <div className="col-12">
        <button className="btn btn-primary w-100">
          Predict Emergency Load
        </button>
      </div>
    </form>
  );
}

export default PredictionForm;
