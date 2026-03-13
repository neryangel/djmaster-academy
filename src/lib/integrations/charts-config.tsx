/**
 * Recharts Configuration for DJ Analytics
 * הגדרות Recharts לניתוחי DJ
 */

import React from 'react';
import {
  BarChart,
  LineChart,
  AreaChart,
  PieChart,
  RadarChart,
  ScatterChart,
  ComposedChart,
  Bar,
  Line,
  Area,
  Pie,
  Radar,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';

/**
 * DJ Theme Colors for Charts
 * צבעי תימת DJ לתרשימים
 */
export const DJ_CHART_COLORS = {
  background: '#0A0A0F',
  surface: '#1A1A2E',
  primary: '#6C63FF',
  secondary: '#9F7AEA',
  accent: '#FF006E',
  warning: '#FFB703',
  success: '#10B981',
  error: '#EF4444',
  text: {
    primary: '#FFFFFF',
    secondary: '#B0B0B5',
    muted: '#6B6B78',
  },
  grid: '#2D2D44',
  gradients: {
    primary: ['#6C63FF', '#9F7AEA'],
    accent: ['#FF006E', '#FFB703'],
    success: ['#10B981', '#6EE7B7'],
  },
};

/**
 * Chart theme configuration
 * הגדרת תימת תרשים
 */
export const CHART_THEME = {
  backgroundColor: DJ_CHART_COLORS.background,
  textColor: DJ_CHART_COLORS.text.primary,
  tooltipBackground: DJ_CHART_COLORS.surface,
  gridColor: DJ_CHART_COLORS.grid,
  labelColor: DJ_CHART_COLORS.text.secondary,
};

/**
 * Responsive container default props
 */
export const RESPONSIVE_CONTAINER_DEFAULTS = {
  width: '100%',
  height: 300,
  margin: { top: 20, right: 30, left: 0, bottom: 20 },
};

/**
 * Custom Tooltip component for charts
 * רכיב Tooltip מותאם לתרשימים
 */
export const DJChartTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          backgroundColor: DJ_CHART_COLORS.surface,
          border: `1px solid ${DJ_CHART_COLORS.grid}`,
          borderRadius: '8px',
          padding: '12px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
        }}
      >
        <p style={{ color: DJ_CHART_COLORS.text.primary, margin: '0 0 8px 0' }}>
          {label}
        </p>
        {payload.map((entry: any, index: number) => (
          <p
            key={index}
            style={{
              color: entry.color,
              margin: '4px 0',
              fontSize: '14px',
            }}
          >
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

/**
 * XP Progress Chart
 * תרשים התקדמות XP
 */
export const XPProgressChart = ({
  data,
  isRTL = true,
}: {
  data: Array<{ name: string; xp: number }>;
  isRTL?: boolean;
}) => {
  return (
    <ResponsiveContainer {...RESPONSIVE_CONTAINER_DEFAULTS} height={250}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ left: 100, right: 30, top: 5, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke={DJ_CHART_COLORS.grid} />
        <XAxis
          type="number"
          stroke={DJ_CHART_COLORS.text.secondary}
          tick={{ fill: DJ_CHART_COLORS.text.muted }}
        />
        <YAxis
          dataKey="name"
          type="category"
          stroke={DJ_CHART_COLORS.text.secondary}
          tick={{ fill: DJ_CHART_COLORS.text.muted }}
          width={95}
        />
        <Tooltip content={<DJChartTooltip />} />
        <Bar
          dataKey="xp"
          fill={DJ_CHART_COLORS.primary}
          radius={[0, 8, 8, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

/**
 * Frequency Spectrum Chart
 * תרשים ספקטרום תדירויות
 */
export const FrequencySpectrum = ({
  data,
}: {
  data: Array<{ frequency: string; amplitude: number }>;
}) => {
  return (
    <ResponsiveContainer {...RESPONSIVE_CONTAINER_DEFAULTS} height={250}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke={DJ_CHART_COLORS.grid} />
        <XAxis
          dataKey="frequency"
          stroke={DJ_CHART_COLORS.text.secondary}
          tick={{ fill: DJ_CHART_COLORS.text.muted, fontSize: 12 }}
        />
        <YAxis
          stroke={DJ_CHART_COLORS.text.secondary}
          tick={{ fill: DJ_CHART_COLORS.text.muted }}
        />
        <Tooltip content={<DJChartTooltip />} />
        <Bar dataKey="amplitude" fill={DJ_CHART_COLORS.accent} radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

/**
 * BPM History Chart
 * תרשים היסטוריית BPM
 */
export const BPMHistoryChart = ({
  data,
}: {
  data: Array<{ time: string; bpm: number }>;
}) => {
  return (
    <ResponsiveContainer {...RESPONSIVE_CONTAINER_DEFAULTS} height={250}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="bpmGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={DJ_CHART_COLORS.primary} stopOpacity={0.8} />
            <stop offset="95%" stopColor={DJ_CHART_COLORS.primary} stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={DJ_CHART_COLORS.grid} />
        <XAxis
          dataKey="time"
          stroke={DJ_CHART_COLORS.text.secondary}
          tick={{ fill: DJ_CHART_COLORS.text.muted, fontSize: 12 }}
        />
        <YAxis
          stroke={DJ_CHART_COLORS.text.secondary}
          tick={{ fill: DJ_CHART_COLORS.text.muted }}
          domain={[60, 180]}
        />
        <Tooltip content={<DJChartTooltip />} />
        <Area
          type="monotone"
          dataKey="bpm"
          stroke={DJ_CHART_COLORS.primary}
          fillOpacity={1}
          fill="url(#bpmGradient)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

/**
 * Energy Flow Chart
 * תרשים זרימת אנרגיה
 */
export const EnergyFlowChart = ({
  data,
}: {
  data: Array<{
    name: string;
    energy: number;
    crowd: number;
    dj: number;
  }>;
}) => {
  return (
    <ResponsiveContainer {...RESPONSIVE_CONTAINER_DEFAULTS} height={300}>
      <ComposedChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke={DJ_CHART_COLORS.grid} />
        <XAxis
          dataKey="name"
          stroke={DJ_CHART_COLORS.text.secondary}
          tick={{ fill: DJ_CHART_COLORS.text.muted, fontSize: 12 }}
        />
        <YAxis
          stroke={DJ_CHART_COLORS.text.secondary}
          tick={{ fill: DJ_CHART_COLORS.text.muted }}
          domain={[0, 100]}
        />
        <Tooltip content={<DJChartTooltip />} />
        <Legend
          wrapperStyle={{
            paddingTop: '20px',
            color: DJ_CHART_COLORS.text.secondary,
          }}
        />
        <Area
          type="monotone"
          dataKey="energy"
          fill={DJ_CHART_COLORS.primary}
          stroke={DJ_CHART_COLORS.primary}
          fillOpacity={0.3}
        />
        <Line
          type="monotone"
          dataKey="crowd"
          stroke={DJ_CHART_COLORS.success}
          strokeWidth={2}
          dot={{ fill: DJ_CHART_COLORS.success, r: 4 }}
        />
        <Line
          type="monotone"
          dataKey="dj"
          stroke={DJ_CHART_COLORS.accent}
          strokeWidth={2}
          dot={{ fill: DJ_CHART_COLORS.accent, r: 4 }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
};

/**
 * Mixing Skills Radar Chart
 * תרשים Radar להערכת כישורי ערבוב
 */
export const MixingSkillsRadar = ({
  data,
}: {
  data: Array<{
    skill: string;
    level: number;
  }>;
}) => {
  return (
    <ResponsiveContainer {...RESPONSIVE_CONTAINER_DEFAULTS} height={300}>
      <RadarChart data={data}>
        <CartesianGrid stroke={DJ_CHART_COLORS.grid} />
        <PolarAngleAxis
          dataKey="skill"
          tick={{ fill: DJ_CHART_COLORS.text.secondary, fontSize: 12 }}
        />
        <PolarRadiusAxis
          angle={90}
          domain={[0, 100]}
          tick={{ fill: DJ_CHART_COLORS.text.muted }}
        />
        <Radar
          name="כישור"
          dataKey="level"
          stroke={DJ_CHART_COLORS.primary}
          fill={DJ_CHART_COLORS.primary}
          fillOpacity={0.6}
        />
        <Tooltip content={<DJChartTooltip />} />
      </RadarChart>
    </ResponsiveContainer>
  );
};

/**
 * Time spent by course chart
 * תרשים זמן בצפייה לפי קורס
 */
export const TimeSpentChart = ({
  data,
}: {
  data: Array<{
    course: string;
    hours: number;
    percentage: number;
  }>;
}) => {
  return (
    <ResponsiveContainer {...RESPONSIVE_CONTAINER_DEFAULTS} height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ course, percentage }) => `${course}: ${percentage}%`}
          outerRadius={80}
          fill={DJ_CHART_COLORS.primary}
          dataKey="hours"
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={[
                DJ_CHART_COLORS.primary,
                DJ_CHART_COLORS.secondary,
                DJ_CHART_COLORS.accent,
                DJ_CHART_COLORS.success,
                DJ_CHART_COLORS.warning,
              ][index % 5]}
            />
          ))}
        </Pie>
        <Tooltip content={<DJChartTooltip />} />
      </PieChart>
    </ResponsiveContainer>
  );
};

/**
 * Helper function to create chart with custom theme
 */
export function createDJChart(
  ChartComponent: React.ComponentType<any>,
  props: any
) {
  return <ChartComponent {...props} />;
}

/**
 * Export from Recharts for convenience
 */
export {
  ResponsiveContainer,
  BarChart,
  LineChart,
  AreaChart,
  PieChart,
  RadarChart,
  ScatterChart,
  ComposedChart,
  Bar,
  Line,
  Area,
  Pie,
  Radar,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
};

export default {
  DJ_CHART_COLORS,
  CHART_THEME,
  RESPONSIVE_CONTAINER_DEFAULTS,
  DJChartTooltip,
  XPProgressChart,
  FrequencySpectrum,
  BPMHistoryChart,
  EnergyFlowChart,
  MixingSkillsRadar,
  TimeSpentChart,
  createDJChart,
};
