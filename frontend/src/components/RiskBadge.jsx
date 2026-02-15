function RiskBadge({ level }) {
  const getColor = () => {
    switch (level) {
      case "CRITICAL":
        return "danger";
      case "HIGH":
        return "warning";
      case "MEDIUM":
        return "info";
      default:
        return "success";
    }
  };

  return (
    <span className={`badge bg-${getColor()} fs-6`}>
      {level}
    </span>
  );
}

export default RiskBadge;
