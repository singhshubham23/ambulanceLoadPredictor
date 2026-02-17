import { useEffect, useState } from "react";
import api from "../api/axios";
import Spinner from "../components/ui/Spinner";
import Badge from "../components/ui/Badge";

export default function Zones({ pushAlerts }) {
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hours, setHours] = useState(24);

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/zones/pressure?city=Delhi&hours=${hours}`);
      const d = res.data.data;
      setZones(d.zones || []);
      if (d.alerts?.length) pushAlerts?.(d.alerts);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, [hours]);

  const critical = zones.filter(z => z.alertLevel === "CRITICAL").length;

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <div className="page-header-eyebrow"> MODULE-03</div>
          <h1>Zone Pressure</h1>
          <div className="page-header-sub">
            DELHI SECTOR · {zones.length} ACTIVE ZONES · {critical} CRITICAL
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {[6, 12, 24, 48, 168].map(h => (
            <button key={h} onClick={() => setHours(h)}
              className={`btn btn-sm ${hours === h ? "btn-primary" : "btn-ghost"}`}>
              {h < 48 ? `${h}H` : `${h/24}D`}
            </button>
          ))}
        </div>
      </div>

      {loading ? <Spinner label="ACQUIRING ZONE DATA" /> : (
        <div className="zone-grid">
          {zones.map((zone, i) => <ZoneDetailCard key={i} zone={zone} />)}
        </div>
      )}
    </div>
  );
}

function ZoneDetailCard({ zone }) {
  const level = zone.alertLevel || "NORMAL";
  const pct = Math.min((zone.totalAccidents / 80) * 100, 100);
  const cls = level === "CRITICAL" ? "r" : level === "HIGH" ? "o" : level === "MEDIUM" ? "y" : "g";

  return (
    <div className={`zone-card ${level}`}>
      <div className="zone-header">
        <div>
          <div className="zone-designator"> SECTOR</div>
          <div className="zone-name">{zone.zone}</div>
        </div>
        <Badge level={level} />
      </div>

      <div className="zone-stat-row">
        <div className="zone-stat">
          <div className="zone-stat-val">{zone.totalAccidents ?? 0}</div>
          <div className="zone-stat-key">INCIDENTS</div>
        </div>
        <div className="zone-stat">
          <div className="zone-stat-val">{zone.avgSeverity?.toFixed(1) ?? "—"}</div>
          <div className="zone-stat-key">AVG SEV.</div>
        </div>
      </div>

      <div className="prog-header">
        <span className="prog-label">PRESSURE INDEX</span>
        <span className="prog-pct">{pct.toFixed(0)}%</span>
      </div>
      <div className="prog-track">
        <div className={`prog-fill ${cls}`} style={{ width: `${pct}%` }} />
      </div>

      {level === "CRITICAL" && (
        <div style={{
          marginTop: 10, fontFamily: "var(--mono)", fontSize: 9, letterSpacing: "1.5px",
          color: "var(--critical)", padding: "5px 8px", background: "var(--critical-dim)",
          border: "1px solid rgba(255,32,32,0.2)", textTransform: "uppercase"
        }}>
          ◆ IMMEDIATE RESPONSE REQUIRED
        </div>
      )}
    </div>
  );
}