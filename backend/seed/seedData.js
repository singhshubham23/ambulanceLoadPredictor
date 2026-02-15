const mongoose = require("mongoose");
require("dotenv").config();

const Accident = require("../models/Accident");
const Hospital = require("../models/Hospital");

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB connected for seeding");
};

const randomBetween = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const zones = ["North", "South", "East", "West"];
const baseCoordinates = {
  North: [77.20, 28.65],
  South: [77.25, 28.55],
  East: [77.30, 28.60],
  West: [77.10, 28.60]
};

const isFestivalDate = (date) => {
  const month = date.getMonth() + 1;
  const day = date.getDate();

  if (month === 11 && day >= 10 && day <= 15) return true; // Diwali
  if (month === 3 && day >= 20 && day <= 25) return true; // Holi
  if (month === 1 && day <= 3) return true; // New Year

  return false;
};

const generateAccidents = async () => {
  await connectDB();
  await Accident.deleteMany();
  console.log("Old accident data cleared");

  const hospitals = await Hospital.find();
  const today = new Date();

  const accidents = [];

  for (let d = 0; d < 365; d++) {
    const date = new Date(today);
    date.setDate(today.getDate() - d);

    const month = date.getMonth() + 1;
    const dayOfWeek = date.getDay();
    const weekend = dayOfWeek === 0 || dayOfWeek === 6;
    const festival = isFestivalDate(date);

    let dailyCount = randomBetween(1, 3); // normal day

    if (weekend) dailyCount += randomBetween(5, 10);

    if (month === 5 || month === 6 || month === 12 || month === 1)
      dailyCount += randomBetween(5, 15);

    if (festival)
      dailyCount += randomBetween(20, 40);

    for (let i = 0; i < dailyCount; i++) {
      const zone = zones[randomBetween(0, zones.length - 1)];
      const hospital =
        hospitals[randomBetween(0, hospitals.length - 1)];

      const baseCoord = baseCoordinates[zone];

      accidents.push({
        location: {
          type: "Point",
          coordinates: [
            baseCoord[0] + (Math.random() - 0.5) * 0.02,
            baseCoord[1] + (Math.random() - 0.5) * 0.02
          ]
        },
        city: "Delhi",
        severity: randomBetween(1, 5),
        zone,
        hospital: hospital._id,
        date
      });
    }
  }

  await Accident.insertMany(accidents);

  console.log(
    `Inserted ${accidents.length} accidents with realistic spikes`
  );

  process.exit();
};

generateAccidents();
