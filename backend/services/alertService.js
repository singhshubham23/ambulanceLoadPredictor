exports.evaluateAlert = (pressureScore, level) => {
  if (level === "CRITICAL") {
    return {
      trigger: true,
      priority: "HIGH",
      message: "CRITICAL ALERT: Emergency overload detected. Activate protocols immediately."
    };
  }

  if (level === "HIGH") {
    return {
      trigger: true,
      priority: "MEDIUM",
      message: "High emergency load detected. Prepare additional resources."
    };
  }

  return {
    trigger: false
  };
};
