import { useEffect, useState } from "react";
import api from "../api/axios";
import AppLayout from "../components/layout/AppLayout";

const statusConfig = {
  strong: { color: "#34D399", bar: "#10B981", label: "Strong" },
  moderate: { color: "#FCD34D", bar: "#F59E0B", label: "Moderate" },
  weak: { color: "#F87171", bar: "#EF4444", label: "Weak" },
};

// Minimal SVG bar chart (no external deps)
const BarChart = ({ topics }) => {
  if (!topics.length) return null;
  const maxAcc = 100;
  const barW = Math.max(28, Math.floor(560 / topics.length) - 8);

  return (
    <svg width="100%" height={180} style={{ overflow: "visible" }}>
      {/* Grid lines */}
      {[0, 25, 50, 75, 100].map(y => (
        <g key={y}>
          <line x1={40} y1={140 - (y / 100) * 130} x2="100%" y2={140 - (y / 100) * 130} stroke="rgba(255,255,255,0.05)" strokeWidth={1} />
          <text x={32} y={145 - (y / 100) * 130} fill="#4B5563" fontSize={9} textAnchor="end">{y}%</text>
        </g>
      ))}
      {topics.map((t, i) => {
        const x = 52 + i * (barW + 8);
        const barH = Math.max(4, (t.accuracy / maxAcc) * 130);
        const cfg = statusConfig[t.status] || statusConfig.moderate;
        return (
          <g key={t.topic}>
            {/* Bar */}
            <rect x={x} y={140 - barH} width={barW} height={barH} rx={5} fill={cfg.bar} opacity={0.85} />
            {/* Accuracy label on bar */}
            <text x={x + barW / 2} y={134 - barH} fill={cfg.color} fontSize={10} fontWeight="700" textAnchor="middle">
              {Math.round(t.accuracy)}%
            </text>
            {/* Topic label below */}
            <text
              x={x + barW / 2} y={155} fill="#6B7280" fontSize={9} textAnchor="middle"
              style={{ overflow: "hidden", textOverflow: "ellipsis" }}
            >
              {t.topic.length > 10 ? t.topic.slice(0, 10) + "…" : t.topic}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

// Donut chart for weak/moderate/strong distribution
const DonutChart = ({ strong, moderate, weak }) => {
  const total = strong + moderate + weak || 1;
  const toAngle = (v) => (v / total) * 2 * Math.PI;

  const slices = [
    { value: strong, color: "#10B981" },
    { value: moderate, color: "#F59E0B" },
    { value: weak, color: "#EF4444" },
  ];

  const cx = 60, cy = 60, r = 44, ir = 28;
  let angle = -Math.PI / 2;

  const arcs = slices.map(s => {
    const startAngle = angle;
    angle += toAngle(s.value);
    const x1 = cx + r * Math.cos(startAngle);
    const y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(angle);
    const y2 = cy + r * Math.sin(angle);
    const x3 = cx + ir * Math.cos(angle);
    const y3 = cy + ir * Math.sin(angle);
    const x4 = cx + ir * Math.cos(startAngle);
    const y4 = cy + ir * Math.sin(startAngle);
    const large = s.value / total > 0.5 ? 1 : 0;
    return { ...s, d: s.value === 0 ? "" : `M${x1},${y1} A${r},${r} 0 ${large} 1 ${x2},${y2} L${x3},${y3} A${ir},${ir} 0 ${large} 0 ${x4},${y4} Z` };
  });

  return (
    <svg viewBox="0 0 120 120" width={120} height={120}>
      {arcs.map((a, i) => a.d && <path key={i} d={a.d} fill={a.color} />)}
      <text x={cx} y={cy - 6} textAnchor="middle" fill="#fff" fontSize={14} fontWeight="700">{total}</text>
      <text x={cx} y={cy + 10} textAnchor="middle" fill="#6B7280" fontSize={8}>topics</text>
    </svg>
  );
};

const AnalyticsPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/analytics/me")
      .then(r => setData(r.data.data))
      .catch(e => setError(e.response?.data?.message || "Failed to load analytics"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <AppLayout><div style={{ padding: 32, color: "#6B7280" }}>Loading analytics...</div></AppLayout>;
  if (error) return <AppLayout><div style={{ padding: 32, color: "#F87171" }}>{error}</div></AppLayout>;

  const topics = data?.topicBreakdown || [];
  const strong = topics.filter(t => t.status === "strong").length;
  const moderate = topics.filter(t => t.status === "moderate").length;
  const weak = topics.filter(t => t.status === "weak").length;

  const statCards = [
    { label: "Total Topics", value: topics.length, color: "#818CF8" },
    { label: "Strong", value: strong, color: "#34D399" },
    { label: "Moderate", value: moderate, color: "#FCD34D" },
    { label: "Needs Work", value: weak, color: "#F87171" },
    { label: "Avg Accuracy", value: `${data?.summary?.avgAccuracy?.toFixed(0) ?? 0}%`, color: "#A78BFA" },
    { label: "Quiz Attempts", value: data?.summary?.totalAttempts ?? 0, color: "#60A5FA" },
  ];

  return (
    <AppLayout>
      <div style={{ padding: 28, maxWidth: 1050, margin: "0 auto", display: "flex", flexDirection: "column", gap: 22 }}>

        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#fff" }}>📊 Analytics</h1>
          <p style={{ fontSize: 13, color: "#6B7280", marginTop: 4 }}>Your learning performance across all topics</p>
        </div>

        {/* Stat cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
          {statCards.map(s => (
            <div key={s.label} style={{ background: "#161B27", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: "18px 20px" }}>
              <div style={{ fontSize: 26, fontWeight: 700, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 12, color: "#6B7280", marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Charts row */}
        {topics.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 20 }}>
            {/* Bar chart */}
            <div style={{ background: "#161B27", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 22, overflow: "hidden" }}>
              <div style={{ fontWeight: 600, fontSize: 14, color: "#fff", marginBottom: 16 }}>Accuracy by Topic</div>
              <BarChart topics={topics} />
            </div>

            {/* Donut */}
            <div style={{ background: "#161B27", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 22, minWidth: 200, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14 }}>
              <div style={{ fontWeight: 600, fontSize: 14, color: "#fff" }}>Mastery Split</div>
              <DonutChart strong={strong} moderate={moderate} weak={weak} />
              <div style={{ display: "flex", flexDirection: "column", gap: 6, width: "100%" }}>
                {[["#10B981", "Strong", strong], ["#F59E0B", "Moderate", moderate], ["#EF4444", "Weak", weak]].map(([c, l, v]) => (
                  <div key={l} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: c, flexShrink: 0 }} />
                    <span style={{ fontSize: 12, color: "#9CA3AF", flex: 1 }}>{l}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Topic table */}
        {topics.length > 0 ? (
          <div style={{ background: "#161B27", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, overflow: "hidden" }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.05)", fontWeight: 600, fontSize: 14, color: "#fff" }}>
              Topic Breakdown
            </div>
            {topics.map((t, i) => {
              const cfg = statusConfig[t.status] || statusConfig.moderate;
              return (
                <div key={t._id || i} style={{
                  display: "flex", alignItems: "center", gap: 14, padding: "13px 20px",
                  borderBottom: i < topics.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                  borderLeft: `3px solid ${cfg.bar}`,
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: "#fff" }}>{t.topic}</div>
                    <div style={{ fontSize: 11, color: "#6B7280", marginTop: 2 }}>{t.subject}{t.chapter ? ` · ${t.chapter}` : ""}</div>
                  </div>
                  {/* Mini accuracy bar */}
                  <div style={{ width: 100 }}>
                    <div style={{ height: 5, borderRadius: 3, background: "rgba(255,255,255,0.06)" }}>
                      <div style={{ width: `${t.accuracy}%`, height: "100%", borderRadius: 3, background: cfg.bar, transition: "width 0.5s" }} />
                    </div>
                  </div>
                  <div style={{ width: 46, textAlign: "right", fontSize: 13, fontWeight: 700, color: cfg.color }}>{Math.round(t.accuracy)}%</div>
                  <span style={{ fontSize: 11, padding: "3px 8px", borderRadius: 6, fontWeight: 500, background: `${cfg.bar}22`, color: cfg.color }}>{cfg.label}</span>
                  <div style={{ fontSize: 11, color: "#4B5563", minWidth: 60, textAlign: "right" }}>{t.attempts} attempt{t.attempts !== 1 ? "s" : ""}</div>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ background: "#161B27", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: "48px 24px", textAlign: "center" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📊</div>
            <div style={{ fontWeight: 600, color: "#fff", marginBottom: 8 }}>No analytics yet</div>
            <div style={{ fontSize: 13, color: "#6B7280" }}>Complete some quizzes to see your topic mastery here.</div>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default AnalyticsPage;
