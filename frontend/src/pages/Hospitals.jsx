import { useEffect, useState } from "react";
import api from "../api/axios";
import Spinner from "../components/ui/Spinner";

export default function Hospitals() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortKey, setSortKey] = useState("loadPercent");

  useEffect(() => {
    api.get("/hospitals/load").then(r => setData(r.data || [])).finally(() => setLoading(false));
  }, []);

  const sorted = [...data].sort((a, b) => b[sortKey] - a[sortKey]);
  const critical = data.filter(h => h.status === "CRITICAL").length;
  const avgLoad  = data.length ? Math.round(data.reduce((s, h) => s + h.loadPercent, 0) / data.length) : 0;

  if (loading) return <Spinner label="LOADING HOSPITAL DATA" />;

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <div className="page-header-eyebrow">MODULE-04</div>
          <h1>Hospital Operations</h1>
          <div className="page-header-sub">CAPACITY UTILIZATION · ALL FACILITIES · DELHI SECTOR</div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {["loadPercent", "arrivals", "capacity"].map(k => (
            <button key={k} className={`btn btn-sm ${sortKey===k?"btn-primary":"btn-ghost"}`}
              onClick={() => setSortKey(k)}>
              {k === "loadPercent" ? "BY LOAD" : k === "arrivals" ? "BY ARRIVALS" : "BY CAP."}
            </button>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="stat-grid" style={{ gridTemplateColumns: "repeat(3,1fr)" }}>
        {[
          { color: "amber", val: data.length, label: "TOTAL FACILITIES",  designator: "STAT-01" },
          { color: "red",   val: critical,     label: "CRITICAL LOAD",     designator: "STAT-02" },
          { color: avgLoad>70?"amber":"green", val: `${avgLoad}%`, label: "AVG LOAD", designator: "STAT-03" },
        ].map(({ color, val, label, designator }) => (
          <div key={designator} className={`stat-card ${color}`}>
            <div className="stripe" />
            <div className="stat-designator"> {designator}</div>
            <div className="stat-value">{val}</div>
            <div className="stat-label">{label}</div>
          </div>
        ))}
      </div>

      <div className="t-card">
        <div className="t-card-header">
          <span className="t-card-label"><span>✚</span> FACILITY STATUS REPORT</span>
          <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text-muted)" }}>
            {data.length} UNITS TRACKED
          </span>
        </div>
        <table className="t-table">
          <thead>
            <tr>
              <th>#</th>
              <th>FACILITY</th>
              <th>SECTOR</th>
              <th>CAP.</th>
              <th>ARRIVALS</th>
              <th style={{ minWidth: 180 }}>LOAD STATUS</th>
              <th>CONDITION</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((h, i) => {
              const cls = h.loadPercent > 90 ? "r" : h.loadPercent > 70 ? "o" : h.loadPercent > 40 ? "y" : "g";
              return (
                <tr key={i}>
                  <td className="row-index">{String(i + 1).padStart(2, "0")}</td>
                  <td style={{ fontWeight: 700, color: "var(--text-primary)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    {h.hospital}
                  </td>
                  <td style={{ fontFamily: "var(--mono)", textTransform: "uppercase" }}>{h.zone}</td>
                  <td style={{ fontFamily: "var(--mono)" }}>{h.capacity}</td>
                  <td style={{ fontFamily: "var(--mono)" }}>{h.arrivals}</td>
                  <td>
                    <div className="prog-header" style={{ marginBottom: 3 }}>
                      <span />
                      <span style={{ fontFamily: "var(--mono)", fontSize: 10 }}>{h.loadPercent}%</span>
                    </div>
                    <div className="prog-track">
                      <div className={`prog-fill ${cls}`} style={{ width: `${Math.min(h.loadPercent,100)}%` }} />
                    </div>
                  </td>
                  <td><span className={`status-tag ${h.status}`}>{h.status}</span></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}