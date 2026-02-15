const cron = require("node-cron");
const rateLimit = require("express-rate-limit");
const { exec } = require("child_process");
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

dotenv.config();
const connectDB = require("./config/db");

const accidentRoutes = require("./routes/accidentRoutes");
const ambulanceRoutes = require("./routes/ambulanceRoutes");
const predictionRoutes = require("./routes/predictionRoutes");
const errorHandler = require("./middleware/errorHandler");
const healthRoutes = require("./routes/healthRoutes");
const hospitalAnalyticsRoutes = require("./routes/hospitalAnalyticsRoutes");
const hotspotRoutes = require("./routes/hotspotRoutes");
const zoneAnalyticsRoutes = require("./routes/zoneAnalyticsRoutes");

connectDB();

const app = express();


const predictionLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many prediction requests. Please try again later."
  }
});

app.use(cors());
app.use(express.json());


app.use("/api/accidents", accidentRoutes);
app.use("/api/ambulances", ambulanceRoutes);
app.use("/api/predictions", predictionLimiter, predictionRoutes);
app.use("/api/health", healthRoutes);
app.use("/api/hospitals", hospitalAnalyticsRoutes);
app.use("/api/hotspots", hotspotRoutes);
app.use("/api/zones", zoneAnalyticsRoutes);


app.get("/", (req, res) => {
  res.json({
    status: "Backend running",
    service: "AI Emergency Pressure System",
  });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

cron.schedule("0 3 * * *", () => {
  console.log("Running daily model retraining...");

  exec(
    "node scripts/exportAndTrain.js",
    { timeout: 5 * 60 * 1000 }, 
    (error, stdout, stderr) => {
      if (error) {
        console.error("Cron training failed:", error.message);
      } else {
        console.log("Model retrained successfully");
      }
    }
  );
});

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

app.set("io", io);

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);
});

server.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
