// Array of 10 visually distinct colors optimized for dark mode
export const chartColors = [
  '#60a5fa', // Soft blue
  '#f87171', // Soft red
  '#4ade80', // Soft green
  '#c084fc', // Soft purple
  '#fb923c', // Soft orange
  '#facc15', // Soft yellow
  '#38bdf8', // Sky blue
  '#a78bfa', // Soft violet
  '#34d399', // Soft emerald
  '#94a3b8'  // Soft slate (for "Other")
] as const;

export type ChartColorIndex = number; 