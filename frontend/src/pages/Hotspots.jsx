import { useEffect, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import api from "../api/axios";
import Spinner from "../components/ui/Spinner";

const COLOR = { CRITICAL: "#ff2020", HIGH: "#ff7700", MEDIUM: "#d4a017", LOW: "#3fa855" };
const RADIUS = { CRITICAL: 20, HIGH: 14, MEDIUM: 9, LOW: 6 };

export default function Hotspots() {
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [params, setParams] = useState({ radius: 5000, hours: 24 });
  const [meta, setMeta] = useState(null);

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await api.get(
        `/hotspots?lat=28.61&lng=77.23&radius=${params.radius}&city=Delhi&hours=${params.hours}`
      );
      setFeatures(res.data.features || []);
      setMeta(res.data.meta);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, []);

  const counts = { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0 };
  features.forEach(f => counts[f.properties.hotspotLevel]++);

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <div className="page-header-eyebrow">// MODULE-05</div>
          <h1>Hotspot Intelligence</h1>
          <div className="page-header-sub">
            GEOSPATIAL CLUSTER ANALYSIS · {features.length} HOTSPOTS DETECTED
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <select className="form-select" style={{ width: "auto", padding: "6px 10px" }}
            value={params.hours} onChange={e => setParams(p => ({ ...p, hours: +e.target.value }))}>
            {[6,24,48,168].map(h => <option key={h} value={h}>{h<48?`${h}H`:`${h/24}D`}</option>)}
          </select>
          <select className="form-select" style={{ width: "auto", padding: "6px 10px" }}
            value={params.radius} onChange={e => setParams(p => ({ ...p, radius: +e.target.value }))}>
            {[2000,5000,10000,20000].map(r => <option key={r} value={r}>{r/1000}KM</option>)}
          </select>
          <button className="btn btn-primary btn-sm" onClick={fetch}>▶ SCAN</button>
        </div>
      </div>

      {/* Threat summary */}
      <div className="stat-grid" style={{ marginBottom: 14 }}>
        {Object.entries(counts).map(([level, count]) => (
          <div key={level} className={`stat-card ${
            level==="CRITICAL"?"red":level==="HIGH"?"amber":level==="MEDIUM"?"yellow":"green"
          }`}>
            <div className="stripe" />
            <div className="stat-designator"> {level}</div>
            <div className="stat-value">{count}</div>
            <div className="stat-label">HOTSPOT{count !== 1 ? "S" : ""}</div>
          </div>
        ))}
      </div>

      {loading ? <Spinner label="SCANNING SECTOR" /> : (
        <div className="t-card" style={{ padding: 0 }}>
          <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between" }}>
            <span className="t-card-label"><span>◎</span> TACTICAL MAP — DELHI SECTOR</span>
            {meta && (
              <span style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--text-muted)", letterSpacing: "1px" }}>
                CTR: 28.61°N 77.23°E · R:{meta.radius/1000}KM · T:{meta.hours}H
              </span>
            )}
          </div>
          <div className="map-shell" style={{ border: "none" }}>
            <div className="map-overlay-label"> LIVE GRID</div>
            <MapContainer center={[28.61, 77.23]} zoom={12} style={{ height: 460 }}>
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                attribution="© CartoDB"
              />
              {features.map((f, i) => {
                const level = f.properties.hotspotLevel;
                const [lng, lat] = f.geometry.coordinates;
                return (
                  <CircleMarker key={i} center={[lat, lng]}
                    radius={RADIUS[level]}
                    pathOptions={{
                      color: COLOR[level], fillColor: COLOR[level],
                      fillOpacity: 0.45, weight: 1.5,
                    }}>
                    <Popup>
                      <div style={{ fontFamily: "Share Tech Mono, monospace", fontSize: 12, minWidth: 160 }}>
                        <div style={{ color: COLOR[level], fontWeight: 700, letterSpacing: "1px", marginBottom: 6 }}>
                          ◆ {level}
                        </div>
                        <div>INCIDENTS: <b>{f.properties.accidentCount}</b></div>
                        <div>AVG SEVERITY: <b>{f.properties.avgSeverity}</b></div>
                        <div style={{ fontSize: 10, marginTop: 6, color: "#666", letterSpacing: "0.5px" }}>
                          {lat.toFixed(5)}°N {lng.toFixed(5)}°E
                        </div>
                      </div>
                    </Popup>
                  </CircleMarker>
                );
              })}
            </MapContainer>
          </div>

          {/* Legend */}
          <div style={{
            padding: "10px 16px", borderTop: "1px solid var(--border)",
            display: "flex", gap: 20, flexWrap: "wrap", alignItems: "center"
          }}>
            {Object.entries(COLOR).map(([level, color]) => (
              <div key={level} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: color }} />
                <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text-muted)", letterSpacing: "1px" }}>
                  {level} ({counts[level]})
                </span>
              </div>
            ))}
            <span style={{ marginLeft: "auto", fontFamily: "var(--mono)", fontSize: 9, color: "var(--text-muted)" }}>
              {features.length} TOTAL HOTSPOTS DETECTED
            </span>
          </div>
        </div>
      )}
    </div>
  );
}