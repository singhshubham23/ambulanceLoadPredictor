import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";

const NAV = [
  { to: "/",           icon: "▣", label: "OVERVIEW" },
  { to: "/prediction", icon: "◈", label: "PREDICTION" },
  { to: "/zones",      icon: "◉", label: "ZONE PRESSURE" },
  { to: "/hospitals",  icon: "✚", label: "HOSPITAL OPS" },
  { to: "/hotspots",   icon: "◎", label: "HOTSPOT MAP" },
];

export default function Sidebar({ wsOnline }) {
  const [clock, setClock] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-callsign"> SYSTEM ALPHA</div>
        <div className="brand-name">EMERGENCY AI</div>
        <div className="brand-sub">tactical ops v2.0</div>
      </div>

      <div className="sidebar-body">
        <div className="nav-group-label">MODULES</div>
        {NAV.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) => isActive ? "active" : ""}
          >
            <span className="nav-icon">{icon}</span>
            {label}
          </NavLink>
        ))}
      </div>

      <div className="sidebar-footer">
        <div className="ws-row">
          <div className={`ws-dot ${wsOnline ? "online" : "offline"}`} />
          <span className="ws-label">{wsOnline ? "LIVE FEED" : "DISCONNECTED"}</span>
        </div>
        <div className="sys-clock">
          {clock.toLocaleTimeString("en-IN", { hour12: false })}
        </div>
      </div>
    </div>
  );
}