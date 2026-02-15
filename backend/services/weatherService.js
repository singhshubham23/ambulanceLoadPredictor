const axios = require("axios");

const weatherCache = {};
const CACHE_TTL = 10 * 60 * 1000;

exports.getCurrentWeather = async (city = "Delhi") => {
  try {
    const API_KEY = process.env.WEATHER_API_KEY;


    if (!API_KEY) {
      return { temperature: 30, rainfall: 0 };
    }


    const cached = weatherCache[city];
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.data;
    }

    const response = await axios.get(
      "https://api.openweathermap.org/data/2.5/weather",
      {
        params: {
          q: city,
          appid: API_KEY,
          units: "metric"
        },
        timeout: 5000
      }
    );

    const weatherData = {
      temperature: response.data?.main?.temp ?? 30,
      rainfall: response.data?.rain?.["1h"] ?? 0
    };

    weatherCache[city] = {
      data: weatherData,
      timestamp: Date.now()
    };

    return weatherData;

  } catch (err) {
    console.error("Weather API error:", err.message);


    return { temperature: 30, rainfall: 0 };
  }
};
