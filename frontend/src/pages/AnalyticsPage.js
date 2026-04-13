import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Doughnut, Bar, Line } from 'react-chartjs-2';
import API from '../api/axios';
import LoadingSpinner from '../components/LoadingSpinner';
import './pages.css';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const categoryColors = {
  Roads: '#6366f1',
  Garbage: '#10b981',
  Water: '#0ea5e9',
  Electricity: '#f59e0b',
  Sanitation: '#f43f5e',
  Other: '#8b5cf6',
};

const statusColors = {
  Pending: '#f59e0b',
  'In Progress': '#3b82f6',
  Resolved: '#10b981',
  Rejected: '#f43f5e',
};

const AnalyticsPage = () => {
  const [data, setData] = useState({
    categoryDist: [],
    statusDist: [],
    monthlyTrends: [],
    resolutionTime: null,
    topAreas: [],
  });
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [catRes, statusRes, monthRes, resTimeRes, areasRes, statsRes] =
          await Promise.all([
            API.get('/analytics/category-distribution'),
            API.get('/analytics/status-distribution'),
            API.get('/analytics/monthly-trends'),
            API.get('/analytics/resolution-time'),
            API.get('/analytics/top-areas'),
            API.get('/admin/stats'),
          ]);

        setData({
          categoryDist: catRes.data.data,
          statusDist: statusRes.data.data,
          monthlyTrends: monthRes.data.data,
          resolutionTime: resTimeRes.data.data,
          topAreas: areasRes.data.data,
        });
        setStats(statsRes.data.data);
      } catch (err) {
        console.error('Failed to fetch analytics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) return <LoadingSpinner message="Loading analytics..." />;

  // ---- Chart Data ----

  // Category Distribution — Doughnut
  const categoryChartData = {
    labels: data.categoryDist.map((d) => d.category),
    datasets: [
      {
        data: data.categoryDist.map((d) => d.count),
        backgroundColor: data.categoryDist.map(
          (d) => categoryColors[d.category] || '#8b5cf6'
        ),
        borderWidth: 2,
        borderColor: '#fff',
      },
    ],
  };

  // Status Distribution — Bar
  const statusChartData = {
    labels: data.statusDist.map((d) => d.status),
    datasets: [
      {
        label: 'Issues',
        data: data.statusDist.map((d) => d.count),
        backgroundColor: data.statusDist.map(
          (d) => statusColors[d.status] || '#6b7280'
        ),
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  // Monthly Trends — Line
  const monthNames = [
    '', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];

  const monthlyChartData = {
    labels: data.monthlyTrends.map(
      (d) => `${monthNames[d.month]} ${d.year}`
    ),
    datasets: [
      {
        label: 'Total',
        data: data.monthlyTrends.map((d) => d.total),
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: 'Resolved',
        data: data.monthlyTrends.map((d) => d.resolved),
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  // Resolution Time by Category — Bar
  const resolutionChartData = {
    labels: data.resolutionTime?.byCategory?.map((d) => d.category) || [],
    datasets: [
      {
        label: 'Avg Hours',
        data: data.resolutionTime?.byCategory?.map((d) => d.avgHours) || [],
        backgroundColor: data.resolutionTime?.byCategory?.map(
          (d) => categoryColors[d.category] || '#8b5cf6'
        ) || [],
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
          font: { family: 'Inter', size: 12 },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(0,0,0,0.04)' },
        ticks: { font: { family: 'Inter', size: 11 } },
      },
      x: {
        grid: { display: false },
        ticks: { font: { family: 'Inter', size: 11 } },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          padding: 16,
          usePointStyle: true,
          font: { family: 'Inter', size: 12 },
        },
      },
    },
    cutout: '65%',
  };

  return (
    <div className="page-wrapper" id="analytics-page">
      <div className="container-custom">
        <div className="page-header">
          <h1>📊 Analytics Dashboard</h1>
          <p>Insights and trends across all reported issues</p>
        </div>

        {/* Summary Cards */}
        {stats && (
          <div className="grid-4 animate-fade-in" style={{ marginBottom: '32px' }}>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#eef2ff', color: '#6366f1' }}>📋</div>
              <div className="stat-value">{stats.total}</div>
              <div className="stat-label">Total Issues</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#d1fae5', color: '#10b981' }}>✅</div>
              <div className="stat-value">{stats.resolutionRate}%</div>
              <div className="stat-label">Resolution Rate</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#dbeafe', color: '#3b82f6' }}>⏱️</div>
              <div className="stat-value">{data.resolutionTime?.overallAvgHours || 0}h</div>
              <div className="stat-label">Avg Resolution Time</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#fef3c7', color: '#f59e0b' }}>🕐</div>
              <div className="stat-value">{stats.pending}</div>
              <div className="stat-label">Pending Issues</div>
            </div>
          </div>
        )}

        {/* Charts Grid */}
        <div className="grid-2 animate-slide-up">
          {/* Category Distribution */}
          <div className="card chart-card">
            <h3 className="chart-title">Category Distribution</h3>
            <div className="chart-container" style={{ height: '280px' }}>
              {data.categoryDist.length > 0 ? (
                <Doughnut data={categoryChartData} options={doughnutOptions} />
              ) : (
                <div className="chart-empty">No data available</div>
              )}
            </div>
          </div>

          {/* Status Distribution */}
          <div className="card chart-card">
            <h3 className="chart-title">Status Distribution</h3>
            <div className="chart-container" style={{ height: '280px' }}>
              {data.statusDist.length > 0 ? (
                <Bar data={statusChartData} options={chartOptions} />
              ) : (
                <div className="chart-empty">No data available</div>
              )}
            </div>
          </div>

          {/* Monthly Trends */}
          <div className="card chart-card">
            <h3 className="chart-title">Monthly Trends (Last 12 Months)</h3>
            <div className="chart-container" style={{ height: '280px' }}>
              {data.monthlyTrends.length > 0 ? (
                <Line data={monthlyChartData} options={chartOptions} />
              ) : (
                <div className="chart-empty">No data available</div>
              )}
            </div>
          </div>

          {/* Resolution Time */}
          <div className="card chart-card">
            <h3 className="chart-title">Avg Resolution Time by Category</h3>
            <div className="chart-container" style={{ height: '280px' }}>
              {data.resolutionTime?.byCategory?.length > 0 ? (
                <Bar data={resolutionChartData} options={chartOptions} />
              ) : (
                <div className="chart-empty">No resolved issues yet</div>
              )}
            </div>
          </div>
        </div>

        {/* Top Areas */}
        {data.topAreas.length > 0 && (
          <div className="card chart-card animate-slide-up" style={{ marginTop: '24px' }}>
            <h3 className="chart-title">🔥 Top Problem Areas</h3>
            <div className="top-areas-list">
              {data.topAreas.map((area, index) => (
                <div key={index} className="top-area-item">
                  <span className="top-area-rank">#{index + 1}</span>
                  <span className="top-area-name">{area.area}</span>
                  <div className="top-area-bar-wrapper">
                    <div
                      className="top-area-bar"
                      style={{
                        width: `${(area.count / data.topAreas[0].count) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="top-area-count">{area.count}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsPage;
