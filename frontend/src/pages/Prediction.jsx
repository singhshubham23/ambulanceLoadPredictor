import { useState } from "react";
import api from "../api/axios";
import Spinner from "../components/ui/Spinner";

const DAYS   = ["SUN","MON","TUE","WED","THU","FRI","SAT"];
const MONTHS = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];

const ALERT_DATA = {
  CRITICAL: { icon: "🚨", color: "var(--critical)", msg: "IMMEDIATE SURGE EXPECTED — DEPLOY ALL UNITS" },
  HIGH:     { icon: "⚠️", color: "var(--high)",     msg: "HIGH PROBABILITY — PRE-POSITION AMBULANCES NOW" },
  MEDIUM:   { icon: "🔶", color: "var(--medium)",   msg: "ELEVATED RISK — MAINTAIN STANDBY STATUS" },
  LOW:      { icon: "✅", color: "var(--low)",       msg: "NOMINAL CONDITIONS — STANDARD PROTOCOL" },
};

export default function Prediction() {
  const [form, setForm] = useState({
    dayOfWeek: 1, month: 1, isFestival: 0, temperature: 28, rainfall: 0,
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true); setErr(null);
    try {
      const res = await api.post("/predictions/predict", {
        dayOfWeek: +form.dayOfWeek, month: +form.month,
        isFestival: +form.isFestival, temperature: +form.temperature,
        rainfall: +form.rainfall,
      });
      setResult(res.data.data);
    } catch {
      setErr("UPLINK FAILED — CHECK SERVER CONNECTION");
    } finally {
      setLoading(false);
    }
  };

  const info = result ? ALERT_DATA[result.alertLevel] ?? ALERT_DATA.LOW : null;

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <div className="page-header-eyebrow"> MODULE-02</div>
          <h1>Prediction Engine</h1>
          <div className="page-header-sub">RANDOMFOREST ML · TRAINED ON 365 DAYS · DELHI SECTOR</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, maxWidth: 960 }}>

        {/* Input Panel */}
        <div className="t-card">
          <div className="t-card-header">
            <span className="t-card-label"><span>◈</span> MISSION PARAMETERS</span>
          </div>
          <form onSubmit={submit}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label"><span></span> DAY OF WEEK</label>
                <select className="form-select" value={form.dayOfWeek}
                  onChange={e => set("dayOfWeek", e.target.value)}>
                  {DAYS.map((d, i) => <option key={i} value={i}>{i} — {d}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label"><span></span> MONTH</label>
                <select className="form-select" value={form.month}
                  onChange={e => set("month", e.target.value)}>
                  {MONTHS.map((m, i) => <option key={i} value={i+1}>{`${String(i+1).padStart(2,"0")} — ${m}`}</option>)}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label"><span></span> TEMPERATURE (°C)</label>
                <input className="form-input" type="number"
                  value={form.temperature} placeholder="e.g. 38"
                  onChange={e => set("temperature", e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label"><span></span> RAINFALL (MM)</label>
                <input className="form-input" type="number" min="0"
                  value={form.rainfall} placeholder="e.g. 12"
                  onChange={e => set("rainfall", e.target.value)} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label"><span></span> FESTIVAL / HOLIDAY STATUS</label>
              <select className="form-select" value={form.isFestival}
                onChange={e => set("isFestival", e.target.value)}>
                <option value={0}>0 — NEGATIVE / STANDARD OPS</option>
                <option value={1}>1 — POSITIVE / FESTIVAL ACTIVE</option>
              </select>
            </div>

            {err && (
              <div style={{
                fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.5px",
                background: "var(--critical-dim)", border: "1px solid rgba(255,32,32,0.3)",
                color: "var(--critical)", padding: "10px 12px", marginBottom: 12
              }}>
                ✕ {err}
              </div>
            )}

            {/* Input summary readout */}
            <div style={{
              background: "var(--bg-base)", border: "1px solid var(--border-dim)",
              padding: "10px 12px", marginBottom: 12,
              fontFamily: "var(--mono)", fontSize: 10, color: "var(--text-muted)",
              lineHeight: 2, letterSpacing: "0.5px"
            }}>
              <div style={{ color: "var(--accent)", marginBottom: 4, letterSpacing: "1.5px" }}> PAYLOAD PREVIEW</div>
              {Object.entries({ ...form }).map(([k, v]) => (
                <div key={k}>
                  <span style={{ color: "var(--text-secondary)" }}>{k}:</span>{" "}
                  <span style={{ color: "var(--text-primary)" }}>{v}</span>
                </div>
              ))}
            </div>

            <button className="btn btn-primary btn-full" type="submit" disabled={loading}>
              {loading ? "◈ COMPUTING..." : "◈ EXECUTE PREDICTION"}
            </button>
          </form>
        </div>

        {/* Output Panel */}
        <div className="t-card">
          <div className="t-card-header">
            <span className="t-card-label"><span>◆</span> READOUT — PREDICTED INCIDENTS</span>
          </div>

          {!result && !loading && (
            <div style={{ textAlign: "center", padding: "50px 20px", fontFamily: "var(--mono)", color: "var(--text-muted)" }}>
              <div style={{ fontSize: 36, marginBottom: 12, opacity: 0.3 }}>◎</div>
              <div style={{ fontSize: 10, letterSpacing: "2px", textTransform: "uppercase" }}>
                AWAITING INPUT<br/>
                <span style={{ fontSize: 9, opacity: 0.6 }}>CONFIGURE PARAMETERS AND EXECUTE</span>
              </div>
            </div>
          )}

          {loading && <Spinner label="RUNNING MODEL INFERENCE" />}

          {result && !loading && (
            <>
              <div className="pred-display">
                <div className="pred-readout-label"> PREDICTED INCIDENT COUNT</div>
                <div className={`pred-number ${result.alertLevel}`}>
                  {String(Math.round(result.prediction)).padStart(3, "0")}
                </div>
                <div className="pred-unit">ACCIDENTS · NEXT PERIOD</div>

                <div className={`pred-alert-bar ${result.alertLevel}`}>
                  <span className="pred-alert-icon">{info.icon}</span>
                  <div>
                    <div className="pred-alert-title" style={{ color: info.color }}>
                      THREAT LEVEL: {result.alertLevel}
                    </div>
                    <div className="pred-alert-msg">{info.msg}</div>
                  </div>
                </div>
              </div>

              <div className="divider" />

              {/* Input echo */}
              <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text-muted)" }}>
                <div style={{ color: "var(--accent)", letterSpacing: "1.5px", marginBottom: 8 }}> INPUT VECTOR</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                  {[
                    ["DAY", DAYS[+form.dayOfWeek]],
                    ["MONTH", MONTHS[+form.month - 1]],
                    ["TEMP", `${form.temperature}°C`],
                    ["RAIN", `${form.rainfall}mm`],
                    ["FESTIVAL", +form.isFestival ? "YES" : "NO"],
                  ].map(([k, v]) => (
                    <div key={k} style={{
                      background: "var(--bg-base)", border: "1px solid var(--border-dim)",
                      padding: "7px 9px"
                    }}>
                      <div style={{ fontSize: 9, color: "var(--text-muted)", letterSpacing: "1.5px" }}>{k}</div>
                      <div style={{ color: "var(--text-primary)", marginTop: 2, letterSpacing: "1px" }}>{v}</div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}