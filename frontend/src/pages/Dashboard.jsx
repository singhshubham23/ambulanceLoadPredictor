import { useEffect, useState } from "react";
import api from "../api/axios";
import Spinner from "../components/ui/Spinner";
import Badge from "../components/ui/Badge";

export default function Dashboard({ pushAlerts }) {
  const [zones, setZones] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    setLoading(true);
    try {
      const [z, m] = await Promise.all([
        api.get("/zones/pressure?city=Delhi&hours=24"),
        api.get("/health/metrics"),
      ]);
      const data = z.data.data;
      setZones(data.zones || []);
      setMetrics(m.data);
      if (data.alerts?.length) pushAlerts(data.alerts);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []);

  const total   = zones.reduce((s, z) => s + (z.totalAccidents || 0), 0);
  const critical = zones.filter(z => z.alertLevel === "CRITICAL").length;
  const high     = zones.filter(z => z.alertLevel === "HIGH").length;

  return (
    <div>
      {/* SITREP TICKER */}
      <div className="sitrep-ticker">
        <span className="ticker-label">SITREP</span>
        <div className="ticker-divider" />
        <span className="ticker-text">
          {`SYSTEM NOMINAL · MONITORING ACTIVE · DELHI SECTOR · ${zones.length} ZONES TRACKED · ${critical} CRITICAL · ${high} HIGH ALERT · ${total} INCIDENTS (24H) · ALL AMBULANCE UNITS MONITORED · HOTSPOT ANALYSIS LIVE ·`.repeat(2)}
        </span>
      </div>

      <div className="page-header">
        <div className="page-header-left">
          <div className="page-header-eyebrow"> TACTICAL OVERVIEW</div>
          <h1>System Status</h1>
          <div className="page-header-sub">DELHI SECTOR · REAL-TIME MONITORING</div>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={fetch}>↻ REFRESH</button>
      </div>

      {loading ? <Spinner label="ACQUIRING DATA" /> : (
        <>
          {/* Stat Row */}
          <div className="stat-grid">
            {[
              { color: "amber", icon: "◈", val: total, label: "INCIDENTS — 24H", designator: "STAT-01" },
              { color: "red",   icon: "◆", val: critical, label: "CRITICAL ZONES",  designator: "STAT-02" },
              { color: "amber", icon: "▲", val: high,     label: "HIGH ALERT ZONES", designator: "STAT-03" },
              { color: "green", icon: "✚", val: metrics?.totalAmbulanceLogs ?? "—", label: "AMBULANCE LOGS", designator: "STAT-04" },
            ].map(({ color, icon, val, label, designator }) => (
              <div key={designator} className={`stat-card ${color}`}>
                <div className="stripe" />
                <div className="stat-designator"> {designator}</div>
                <div className="stat-value">{val}</div>
                <div className="stat-label">{label}</div>
              </div>
            ))}
          </div>

          {/* Zone Grid */}
          <div className="t-card" style={{ marginBottom: 16 }}>
            <div className="t-card-header">
              <span className="t-card-label"><span>◉</span> ZONE PRESSURE GRID — DELHI</span>
              <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text-muted)" }}>
                LAST 24H · {zones.length} ZONES
              </span>
            </div>
            <div className="zone-grid">
              {zones.map((z, i) => <ZoneCard key={i} zone={z} />)}
            </div>
          </div>

          {/* System Health */}
          {metrics && (
            <div className="t-card">
              <div className="t-card-header">
                <span className="t-card-label"><span>◈</span> SYSTEM DIAGNOSTICS</span>
                <span style={{
                  fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "1px",
                  color: "var(--low)", padding: "2px 8px", border: "1px solid rgba(63,168,85,0.3)",
                  background: "var(--low-dim)"
                }}>
                  ● {(metrics.database || "UNKNOWN").toUpperCase()}
                </span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
                {[
                  { k: "DB RECORDS",   v: metrics.totalAccidents },
                  { k: "AMBU. LOGS",   v: metrics.totalAmbulanceLogs },
                  { k: "UPTIME",       v: `${Math.round(metrics.uptime)}S` },
                ].map(({ k, v }) => (
                  <div key={k} style={{
                    background: "var(--bg-base)", border: "1px solid var(--border)",
                    padding: "12px 14px"
                  }}>
                    <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--text-muted)", letterSpacing: "1.5px", marginBottom: 6 }}>
                      {k}
                    </div>
                    <div style={{ fontFamily: "var(--mono)", fontSize: 22, color: "var(--text-primary)", letterSpacing: "2px" }}>
                      {v}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function ZoneCard({ zone }) {
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
        <span className="prog-label">PRESSURE IDX</span>
        <span className="prog-pct">{pct.toFixed(0)}%</span>
      </div>
      <div className="prog-track">
        <div className={`prog-fill ${cls}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}