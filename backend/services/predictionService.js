const { predictAccidentLoad } = require("./mlService");

exports.calculateMLPrediction = async (inputData = null) => {
  if (!inputData || Object.keys(inputData).length === 0) {
    const now = new Date();
    inputData = {
      dayOfWeek: now.getDay(),
      month: now.getMonth() + 1,
      isFestival: 0,
      temperature: 30,
      rainfall: 0
    };
  }

  if (
    typeof inputData.dayOfWeek !== "number" ||
    typeof inputData.month !== "number"
  ) {
    throw new Error("Invalid input format");
  }

  const result = await predictAccidentLoad(inputData);

  let alertLevel = "LOW";
  if (result.prediction >= 35) alertLevel = "CRITICAL";
else if (result.prediction >= 20) alertLevel = "HIGH";
else if (result.prediction >= 10) alertLevel = "MEDIUM";

  return {
    input: inputData,
    predictedAccidents: result.prediction,
    alertLevel
  };
};
