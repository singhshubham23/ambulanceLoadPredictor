import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

export const predictEmergencyLoad = (data) => {
  return API.post("/predictions/predict", data);
};

export default API;
