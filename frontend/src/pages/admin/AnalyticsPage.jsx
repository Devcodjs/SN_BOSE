import { useQuery } from '@tanstack/react-query';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, CartesianGrid
} from 'recharts';
import API from '../../services/api';
import PageWrapper from '../../components/layout/PageWrapper';
import KPICard from '../../components/charts/KPICard';
import HeatmapGrid from '../../components/charts/HeatmapGrid';
import Card from '../../components/ui/Card';
import { SkeletonStats, Skeleton } from '../../components/ui/Skeleton';

/* ─── Design tokens ──────────────────────────────────────────── */
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@400;500;600&display=swap');

  :root {
    --teal-50:  #f0fdfa;
    --teal-100: #ccfbf1;
    --teal-400: #2dd4bf;
    --teal-500: #14b8a6;
    --teal-600: #0d9488;
    --teal-700: #0f766e;
    --sky-400:  #38bdf8;
    --sky-500:  #0ea5e9;
    --amber-400:#fbbf24;
    --amber-500:#f59e0b;
    --emerald-400:#34d399;
    --emerald-500:#10b981;
    --rose-500: #f43f5e;
    --violet-500:#8b5cf6;
    --orange-500:#f97316;
    --slate-50:  #f8fafc;
    --slate-100: #f1f5f9;
    --slate-200: #e2e8f0;
    --slate-300: #cbd5e1;
    --slate-400: #94a3b8;
    --slate-500: #64748b;
    --slate-600: #475569;
    --slate-700: #334155;
    --slate-800: #1e293b;
    --slate-900: #0f172a;

    --font-display: 'Syne', sans-serif;
    --font-body:    'DM Sans', sans-serif;

    --radius-card: 20px;
    --radius-sm:   10px;

    --shadow-card: 0 1px 3px rgba(15,23,42,.06), 0 4px 16px rgba(15,23,42,.07);
    --shadow-hover:0 8px 32px rgba(13,148,136,.13);
  }

  /* ── Page shell ── */
  .ap-root {
    font-family: var(--font-body);
    background: var(--slate-50);
    min-height: 100vh;
  }

  .ap-inner {
    max-width: 1280px;
    margin: 0 auto;
    padding: 56px 24px 80px;
  }

  /* ── Header ── */
  .ap-header {
    margin-bottom: 48px;
  }

  .ap-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-family: var(--font-body);
    font-size: 11px;
    font-weight: 600;
    letter-spacing: .12em;
    text-transform: uppercase;
    color: var(--teal-600);
    background: var(--teal-50);
    border: 1px solid var(--teal-100);
    border-radius: 999px;
    padding: 4px 14px;
    margin-bottom: 14px;
  }

  .ap-title {
    font-family: var(--font-display);
    font-size: clamp(28px, 4vw, 42px);
    font-weight: 800;
    color: var(--slate-900);
    line-height: 1.1;
    margin: 0 0 10px;
    letter-spacing: -.02em;
  }

  .ap-subtitle {
    font-size: 15px;
    color: var(--slate-400);
    margin: 0;
    font-weight: 400;
  }

  /* ── Section labels ── */
  .ap-section-label {
    font-family: var(--font-display);
    font-size: 11px;
    font-weight: 700;
    letter-spacing: .14em;
    text-transform: uppercase;
    color: var(--slate-400);
    margin: 0 0 20px;
  }

  /* ── KPI grid ── */
  .ap-kpi-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
    margin-bottom: 52px;
  }

  @media (min-width: 900px) {
    .ap-kpi-grid { grid-template-columns: repeat(4, 1fr); }
  }

  .ap-kpi-card {
    background: #fff;
    border: 1px solid var(--slate-200);
    border-radius: var(--radius-card);
    padding: 28px 24px;
    box-shadow: var(--shadow-card);
    transition: box-shadow .22s, transform .22s;
    position: relative;
    overflow: hidden;
  }

  .ap-kpi-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    border-radius: var(--radius-card) var(--radius-card) 0 0;
  }

  .ap-kpi-card:nth-child(1)::before { background: linear-gradient(90deg, var(--teal-400), var(--sky-400)); }
  .ap-kpi-card:nth-child(2)::before { background: linear-gradient(90deg, var(--emerald-400), var(--teal-400)); }
  .ap-kpi-card:nth-child(3)::before { background: linear-gradient(90deg, var(--sky-400), var(--violet-500)); }
  .ap-kpi-card:nth-child(4)::before { background: linear-gradient(90deg, var(--amber-400), var(--orange-500)); }

  .ap-kpi-card:hover {
    box-shadow: var(--shadow-hover);
    transform: translateY(-3px);
  }

  .ap-kpi-icon {
    font-size: 26px;
    margin-bottom: 14px;
    display: block;
  }

  .ap-kpi-value {
    font-family: var(--font-display);
    font-size: 32px;
    font-weight: 800;
    color: var(--slate-900);
    line-height: 1;
    margin-bottom: 6px;
    letter-spacing: -.02em;
  }

  .ap-kpi-label {
    font-size: 12px;
    font-weight: 600;
    color: var(--slate-400);
    text-transform: uppercase;
    letter-spacing: .08em;
  }

  .ap-kpi-trend {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    margin-top: 10px;
    font-size: 11px;
    font-weight: 600;
    padding: 3px 10px;
    border-radius: 999px;
  }

  .ap-kpi-trend.up   { background: #fef3c7; color: #92400e; }
  .ap-kpi-trend.down { background: #d1fae5; color: #065f46; }

  /* ── Charts grid ── */
  .ap-charts-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 24px;
    margin-bottom: 24px;
  }

  @media (min-width: 860px) {
    .ap-charts-grid { grid-template-columns: repeat(2, 1fr); }
  }

  /* ── Chart card ── */
  .ap-chart-card {
    background: #fff;
    border: 1px solid var(--slate-200);
    border-radius: var(--radius-card);
    padding: 32px 28px;
    box-shadow: var(--shadow-card);
    transition: box-shadow .22s;
  }

  .ap-chart-card:hover { box-shadow: var(--shadow-hover); }

  .ap-chart-title {
    font-family: var(--font-display);
    font-size: 15px;
    font-weight: 700;
    color: var(--slate-800);
    margin: 0 0 24px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .ap-chart-title-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .ap-chart-body { height: 280px; }

  /* ── Full-width card ── */
  .ap-full-card {
    background: #fff;
    border: 1px solid var(--slate-200);
    border-radius: var(--radius-card);
    padding: 32px 28px;
    box-shadow: var(--shadow-card);
    margin-bottom: 24px;
    transition: box-shadow .22s;
  }

  .ap-full-card:hover { box-shadow: var(--shadow-hover); }

  /* ── Skeleton ── */
  .ap-skel {
    background: linear-gradient(90deg, var(--slate-100) 25%, var(--slate-50) 50%, var(--slate-100) 75%);
    background-size: 200% 100%;
    animation: shimmer 1.4s infinite;
    border-radius: var(--radius-sm);
    width: 100%; height: 100%;
  }

  @keyframes shimmer {
    0%   { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  /* ── Top areas ── */
  .ap-areas-list { display: flex; flex-direction: column; gap: 16px; }

  .ap-area-row {
    display: grid;
    grid-template-columns: 28px 180px 1fr 52px;
    align-items: center;
    gap: 16px;
  }

  @media (max-width: 640px) {
    .ap-area-row { grid-template-columns: 24px 1fr 52px; }
    .ap-area-name { display: none; }
  }

  .ap-area-rank {
    font-family: var(--font-display);
    font-size: 13px;
    font-weight: 800;
    color: var(--teal-600);
  }

  .ap-area-name {
    font-size: 13px;
    font-weight: 600;
    color: var(--slate-700);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .ap-area-bar-track {
    height: 10px;
    background: var(--slate-100);
    border-radius: 999px;
    overflow: hidden;
  }

  .ap-area-bar-fill {
    height: 100%;
    border-radius: 999px;
    background: linear-gradient(90deg, var(--teal-600), var(--teal-400));
    transition: width .6s cubic-bezier(.34,1.56,.64,1);
  }

  .ap-area-count {
    font-family: var(--font-display);
    font-size: 13px;
    font-weight: 700;
    color: var(--slate-500);
    text-align: right;
  }

  /* ── Divider ── */
  .ap-divider {
    height: 1px;
    background: var(--slate-100);
    margin: 40px 0 32px;
  }

  /* ── Custom tooltip ── */
  .ap-tooltip {
    background: var(--slate-900);
    border: none;
    border-radius: 10px;
    padding: 10px 16px;
    font-family: var(--font-body);
    font-size: 12px;
    font-weight: 500;
    color: #fff;
    box-shadow: 0 8px 24px rgba(0,0,0,.2);
  }
`;

/* ─── Color maps ─────────────────────────────────────────────── */
const COLORS = {
  Roads:       '#0d9488',
  Water:       '#0ea5e9',
  Garbage:     '#f97316',
  Electricity: '#eab308',
  Sanitation:  '#ec4899',
  Other:       '#8b5cf6',
};

const STATUS_COLORS = {
  Pending:     '#f59e0b',
  'In Progress':'#3b82f6',
  Resolved:    '#10b981',
  Rejected:    '#ef4444',
};

const DOT_COLORS = {
  'Category Distribution': '#0d9488',
  'Status Distribution':   '#3b82f6',
  'Daily Trends (30 days)':'#14b8a6',
  'Avg Resolution Time':   '#f97316',
};

/* ─── Sub-components ──────────────────────────────────────────── */
function StyleInjector() {
  return <style>{css}</style>;
}

function KPICardCustom({ icon, value, label, trend, index }) {
  const trendSign = trend > 0 ? 'up' : 'down';
  return (
    <div className="ap-kpi-card" style={{ animationDelay: `${index * 80}ms` }}>
      <span className="ap-kpi-icon">{icon}</span>
      <div className="ap-kpi-value">{value}</div>
      <div className="ap-kpi-label">{label}</div>
      {trend !== undefined && (
        <div className={`ap-kpi-trend ${trendSign}`}>
          {trendSign === 'up' ? '↑' : '↓'} {Math.abs(trend)}% this week
        </div>
      )}
    </div>
  );
}

function ChartCard({ title, dotColor, children }) {
  return (
    <div className="ap-chart-card">
      <div className="ap-chart-title">
        <span className="ap-chart-title-dot" style={{ background: dotColor || '#0d9488' }} />
        {title}
      </div>
      <div className="ap-chart-body">{children}</div>
    </div>
  );
}

function FullCard({ title, children }) {
  return (
    <div className="ap-full-card">
      <div className="ap-chart-title">
        <span className="ap-chart-title-dot" style={{ background: '#0d9488' }} />
        {title}
      </div>
      {children}
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="ap-tooltip">
      {label && <div style={{ marginBottom: 6, opacity: .7, fontSize: 11 }}>{label}</div>}
      {payload.map((p, i) => (
        <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: p.color, display: 'inline-block' }} />
          <span style={{ opacity: .8 }}>{p.name ?? p.dataKey}:</span>
          <strong>{p.value}</strong>
        </div>
      ))}
    </div>
  );
};

/* ─── Page ────────────────────────────────────────────────────── */
export default function AnalyticsPage() {
  const { data: stats }    = useQuery({ queryKey: ['admin-stats'],  queryFn: () => API.get('/admin/stats').then(r => r.data.data) });
  const { data: catDist }  = useQuery({ queryKey: ['cat-dist'],     queryFn: () => API.get('/analytics/category-distribution').then(r => r.data.data) });
  const { data: statusDist}= useQuery({ queryKey: ['status-dist'],  queryFn: () => API.get('/analytics/status-distribution').then(r => r.data.data) });
  const { data: trends }   = useQuery({ queryKey: ['trends'],       queryFn: () => API.get('/analytics/trends').then(r => r.data.data) });
  const { data: resTime }  = useQuery({ queryKey: ['res-time'],     queryFn: () => API.get('/analytics/resolution-time').then(r => r.data.data) });
  const { data: heatmap }  = useQuery({ queryKey: ['heatmap'],      queryFn: () => API.get('/analytics/heatmap').then(r => r.data.data) });
  const { data: topAreas } = useQuery({ queryKey: ['top-areas'],    queryFn: () => API.get('/analytics/top-areas').then(r => r.data.data) });

  return (
    <>
      <StyleInjector />
      <PageWrapper className="ap-root">
        <div className="ap-inner">

          {/* ── Header ── */}
          <div className="ap-header">
            <div className="ap-eyebrow">📊 Dashboard</div>
            <h1 className="ap-title">Civic Analytics</h1>
            <p className="ap-subtitle">Comprehensive insights across all reported civic issues</p>
          </div>

          {/* ── KPIs ── */}
          <p className="ap-section-label">Key Performance Indicators</p>
          {!stats ? (
            <SkeletonStats />
          ) : (
            <div className="ap-kpi-grid">
              <KPICardCustom icon="📋" value={stats.total}                     label="Total Issues"    index={0} />
              <KPICardCustom icon="✅" value={`${stats.resolutionRate}%`}       label="Resolution Rate" index={1} />
              <KPICardCustom icon="⏱️" value={`${stats.avgResolutionHours}h`}  label="Avg Resolution"  index={2} />
              <KPICardCustom icon="🕐" value={stats.pending}                   label="Pending"         trend={stats.weekTrend} index={3} />
            </div>
          )}

          <div className="ap-divider" />

          {/* ── Charts ── */}
          <p className="ap-section-label">Distribution & Trends</p>
          <div className="ap-charts-grid">

            {/* Category donut */}
            <ChartCard title="Category Distribution" dotColor={COLORS.Roads}>
              {catDist ? (
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={catDist}
                      dataKey="count"
                      nameKey="category"
                      cx="50%" cy="50%"
                      innerRadius={68}
                      outerRadius={108}
                      paddingAngle={4}
                      label={({ category, percent }) => `${category} (${(percent * 100).toFixed(0)}%)`}
                      labelLine={{ stroke: '#cbd5e1', strokeWidth: 1 }}
                    >
                      {catDist.map((e, i) => (
                        <Cell key={i} fill={COLORS[e.category] || '#8b5cf6'} stroke="none" />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              ) : <div className="ap-skel" />}
            </ChartCard>

            {/* Status bar */}
            <ChartCard title="Status Distribution" dotColor={STATUS_COLORS['In Progress']}>
              {statusDist ? (
                <ResponsiveContainer>
                  <BarChart data={statusDist} barCategoryGap="30%" margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="status" tick={{ fontSize: 12, fill: '#64748b', fontFamily: 'DM Sans' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 12, fill: '#94a3b8', fontFamily: 'DM Sans' }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
                    <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                      {statusDist.map((e, i) => (
                        <Cell key={i} fill={STATUS_COLORS[e.status] || '#6b7280'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : <div className="ap-skel" />}
            </ChartCard>

            {/* Trends line */}
            <ChartCard title="Daily Trends (30 days)" dotColor="#14b8a6">
              {trends ? (
                <ResponsiveContainer>
                  <LineChart data={trends} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8', fontFamily: 'DM Sans' }} axisLine={false} tickLine={false} tickFormatter={d => d.slice(5)} />
                    <YAxis tick={{ fontSize: 12, fill: '#94a3b8', fontFamily: 'DM Sans' }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 12, fontFamily: 'DM Sans', color: '#64748b', paddingTop: 12 }} />
                    <Line type="monotone" dataKey="submitted" stroke="#0d9488" strokeWidth={2.5} dot={false} activeDot={{ r: 5, fill: '#0d9488' }} />
                    <Line type="monotone" dataKey="resolved"  stroke="#10b981" strokeWidth={2.5} dot={false} activeDot={{ r: 5, fill: '#10b981' }} strokeDasharray="5 3" />
                  </LineChart>
                </ResponsiveContainer>
              ) : <div className="ap-skel" />}
            </ChartCard>

            {/* Resolution time */}
            <ChartCard title="Avg Resolution Time (hours)" dotColor={COLORS.Garbage}>
              {resTime?.byCategory ? (
                <ResponsiveContainer>
                  <BarChart data={resTime.byCategory} barCategoryGap="30%" margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="category" tick={{ fontSize: 12, fill: '#64748b', fontFamily: 'DM Sans' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 12, fill: '#94a3b8', fontFamily: 'DM Sans' }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
                    <Bar dataKey="avgHours" radius={[8, 8, 0, 0]}>
                      {resTime.byCategory.map((e, i) => (
                        <Cell key={i} fill={COLORS[e.category] || '#8b5cf6'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : <div className="ap-skel" />}
            </ChartCard>

          </div>

          {/* ── Heatmap ── */}
          <FullCard title="Issue Reporting Heatmap — 90 days">
            {heatmap ? <HeatmapGrid data={heatmap} /> : <div style={{ height: 176 }} className="ap-skel" />}
          </FullCard>

          {/* ── Top Areas ── */}
          {topAreas?.length > 0 && (
            <FullCard title="Top Problem Areas">
              <div className="ap-areas-list">
                {topAreas.map((a, i) => (
                  <div key={i} className="ap-area-row">
                    <span className="ap-area-rank">#{i + 1}</span>
                    <span className="ap-area-name">{a.area}</span>
                    <div className="ap-area-bar-track">
                      <div
                        className="ap-area-bar-fill"
                        style={{ width: `${(a.count / topAreas[0].count) * 100}%` }}
                      />
                    </div>
                    <span className="ap-area-count">{a.count}</span>
                  </div>
                ))}
              </div>
            </FullCard>
          )}

        </div>
      </PageWrapper>
    </>
  );
}