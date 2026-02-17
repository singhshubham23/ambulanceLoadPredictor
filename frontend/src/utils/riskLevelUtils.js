export const getRiskColor = (level) => {
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

export const getProgressVariant = (value) => {
  if (value > 90) return "danger";
  if (value > 70) return "warning";
  if (value > 40) return "info";
  return "success";
};
