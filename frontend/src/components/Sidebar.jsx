function Sidebar() {
  return (
    <div
      className="bg-dark text-white p-3"
      style={{ width: "250px", minHeight: "100vh" }}
    >
      <h4 className="mb-4">
        <i className="bi bi-hospital"></i> AI Emergency
      </h4>

      <ul className="nav flex-column">
        <li className="nav-item mb-2">
          <a className="nav-link text-white" href="#">
            <i className="bi bi-speedometer2"></i> Dashboard
          </a>
        </li>
        <li className="nav-item mb-2">
          <a className="nav-link text-white" href="#">
            <i className="bi bi-activity"></i> Predictions
          </a>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
