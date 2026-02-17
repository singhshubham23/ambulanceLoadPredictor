import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import DashboardLayout from "./components/layout/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Prediction from "./pages/Prediction";
import Zones from "./pages/Zones";
import Hospitals from "./pages/Hospitals";
import Hotspots from "./pages/Hotspots";

export default function App() {
  const [alerts, setAlerts] = useState([]);

  const pushAlerts = (incoming) =>
    setAlerts(prev =>
      [...incoming.map(a => ({ ...a, id: Date.now() + Math.random() })), ...prev].slice(0, 6)
    );

  return (
    <Router>
      <DashboardLayout alerts={alerts} onDismiss={(id) => setAlerts(p => p.filter(a => a.id !== id))}>
        <Routes>
          <Route path="/"          element={<Dashboard  pushAlerts={pushAlerts} />} />
          <Route path="/prediction" element={<Prediction />} />
          <Route path="/zones"     element={<Zones pushAlerts={pushAlerts} />} />
          <Route path="/hospitals" element={<Hospitals />} />
          <Route path="/hotspots"  element={<Hotspots />} />
        </Routes>
      </DashboardLayout>
    </Router>
  );
}