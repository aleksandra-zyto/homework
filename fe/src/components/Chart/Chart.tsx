import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import styles from "./Chart.module.scss";

// Color palette following your theme
const COLORS = [
  "#a350a3", // primary
  "#10b981", // success
  "#f59e0b", // warning
  "#ef4444", // danger
  "#6366f1", // indigo
  "#8b5cf6", // violet
  "#ec4899", // pink
  "#06b6d4", // cyan
];

export interface ChartData {
  name: string;
  value: number;
  color?: string;
  [key: string]: any;
}

export interface ChartProps {
  title: string;
  subtitle?: string;
  type: "bar" | "pie";
  data: ChartData[];
  loading?: boolean;
  error?: string;
  showLegend?: boolean;
  height?: number;
  children?: React.ReactNode; // For custom controls
}

const ErrorIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z"
    />
  </svg>
);

const NoDataIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012-2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
    />
  </svg>
);

export const Chart = ({
  title,
  subtitle,
  type,
  data,
  loading = false,
  error,
  showLegend = true,
  height = 300,
  children,
}: ChartProps) => {
  // Add colors to data if not provided
  const dataWithColors = data.map((item, index) => ({
    ...item,
    color: item.color || COLORS[index % COLORS.length],
  }));

  const renderBarChart = () => (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={dataWithColors}
        margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis
          dataKey="name"
          stroke="#6b7280"
          fontSize={11}
          tick={{ fill: "#6b7280" }}
          interval={0}
          angle={-45}
          textAnchor="end"
          height={60}
        />
        <YAxis
          stroke="#6b7280"
          fontSize={11}
          tick={{ fill: "#6b7280" }}
          width={40}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            fontSize: "12px",
          }}
        />
        <Bar dataKey="value" fill="#a350a3" radius={[2, 2, 0, 0]}>
          {dataWithColors.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );

  const renderPieChart = () => (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
        <Pie
          data={dataWithColors}
          cx="50%"
          cy="50%"
          innerRadius={40}
          outerRadius={80}
          paddingAngle={1}
          dataKey="value"
        >
          {dataWithColors.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            fontSize: "12px",
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );

  const renderLegend = () => (
    <div className={styles.legend}>
      {dataWithColors.map((item, index) => (
        <div key={index} className={styles.legendItem}>
          <div
            className={styles.legendColor}
            style={{ backgroundColor: item.color }}
          />
          <span className={styles.legendLabel}>{item.name}</span>
          <span className={styles.legendValue}>({item.value})</span>
        </div>
      ))}
    </div>
  );

  return (
    <div className={styles.chartContainer}>
      <div className={styles.header}>
        <div>
          <h3 className={styles.title}>{title}</h3>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
        {children && <div className={styles.controls}>{children}</div>}
      </div>

      <div className={styles.chartWrapper}>
        {loading ? (
          <div className={styles.loadingState}>
            <div className={styles.spinner} />
            <span>Loading chart data...</span>
          </div>
        ) : error ? (
          <div className={styles.errorState}>
            <div className={styles.errorIcon}>
              <ErrorIcon />
            </div>
            <p>Failed to load chart</p>
            <p className={styles.errorMessage}>{error}</p>
          </div>
        ) : data.length === 0 ? (
          <div className={styles.noDataState}>
            <div className={styles.noDataIcon}>
              <NoDataIcon />
            </div>
            <p className={styles.noDataMessage}>No data available</p>
          </div>
        ) : (
          <>
            {type === "bar" ? renderBarChart() : renderPieChart()}
            {showLegend && renderLegend()}
          </>
        )}
      </div>
    </div>
  );
};
