const { spawn } = require("child_process");
const path = require("path");

exports.predictAccidentLoad = (inputData) => {
  return new Promise((resolve, reject) => {

    const scriptPath = path.join(__dirname, "../ai/predict.py");

    const python = spawn("python", [
      scriptPath,
      JSON.stringify(inputData)
    ]);

    let result = "";

    python.stdout.on("data", (data) => {
      result += data.toString();
    });

    python.stderr.on("data", (data) => {
      console.error(`Python Error: ${data}`);
      reject("Python execution failed");
    });

    python.on("close", () => {
      try {
        resolve(JSON.parse(result));
      } catch (err) {
        reject("Failed to parse ML result");
      }
    });

  });
};
