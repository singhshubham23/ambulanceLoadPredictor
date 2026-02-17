import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

const PAGE_META = {
  "/":           { code: "MOD-01", title: "SYSTEM OVERVIEW" },
  "/prediction": { code: "MOD-02", title: "ML PREDICTION ENGINE" },
  "/zones":      { code: "MOD-03", title: "ZONE PRESSURE ANALYSIS" },
  "/hospitals":  { code: "MOD-04", title: "HOSPITAL OPERATIONS" },
  "/hotspots":   { code: "MOD-05", title: "HOTSPOT INTELLIGENCE" },
};

export default function Topbar({ alerts }) {
  const { pathname } = useLocation();
  const meta = PAGE_META[pathname] || { code: "MOD-00", title: "UNKNOWN" };
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="topbar">
      <div className="topbar-section">
        <span className="topbar-breadcrumb">{meta.code}</span>
        <span style={{ color: "var(--border)", fontFamily: "monospace" }}>|</span>
        <span className="topbar-title">{meta.title}</span>
      </div>

      <div className="topbar-section">
        <span className="topbar-time">
          {time.toLocaleDateString("en-IN", { day: "2-digit", month: "short" }).toUpperCase()}
          {" "}
          {time.toLocaleTimeString("en-IN", { hour12: false })}
        </span>
        <div className="topbar-icon-btn">
          🔔
          {alerts.length > 0 && (
            <span className="alert-pip">{alerts.length}</span>
          )}
        </div>
      </div>
    </div>
  );
}