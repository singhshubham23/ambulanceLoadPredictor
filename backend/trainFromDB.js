const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
require("dotenv").config();

const Accident = require("./models/Accident");

mongoose.connect(process.env.MONGO_URI);

const isFestivalDate = (date) => {
  const month = date.getMonth() + 1;
  const day = date.getDate();

  if (month === 11 && day >= 10 && day <= 15) return 1; // Diwali
  if (month === 3 && day >= 20 && day <= 25) return 1; // Holi
  if (month === 1 && day <= 3) return 1; // New Year

  return 0;
};

const getTemperature = (month) => {
  if ([5, 6].includes(month)) return 40; // Summer peak
  if ([12, 1].includes(month)) return 8; // Winter
  return 25; // Normal
};

const getRainfall = (month) => {
  if ([7, 8].includes(month)) return 15; // Monsoon
  return 0;
};

async function exportAndTrain() {
  try {
    const accidents = await Accident.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
            day: { $dayOfMonth: "$date" }
          },
          count: { $sum: 1 }
        }
      }
    ]);

    const trainingData = accidents.map(a => {
      const date = new Date(
        a._id.year,
        a._id.month - 1,
        a._id.day
      );

      const month = date.getMonth() + 1;

      return {
        dayOfWeek: date.getDay(),
        month,
        isFestival: isFestivalDate(date),
        temperature: getTemperature(month),
        rainfall: getRainfall(month),
        accidents: a.count
      };
    });

    const dataPath = path.join(__dirname, "ai", "trainingData.json");

    fs.writeFileSync(dataPath, JSON.stringify(trainingData, null, 2));

    console.log(`Training data exported (${trainingData.length} days)`);

    exec("python ai/trainModel.py", (error, stdout, stderr) => {
      if (error) {
        console.error("Training failed:", stderr);
        return;
      }
      console.log(stdout);
      process.exit();
    });

  } catch (err) {
    console.error("Export failed:", err);
  }
}

exportAndTrain();
