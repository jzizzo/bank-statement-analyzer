/**
 * Array of 10 visually distinct colors optimized for dark mode.
 * Colors are chosen to be accessible and aesthetically pleasing
 * while maintaining good contrast in both light and dark themes.
 * 
 * @type {readonly string[]} Array of hex color codes
 */
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

/**
 * Type definition for chart color indices.
 * Represents the valid index range for accessing colors in the chartColors array.
 */
export type ChartColorIndex = number;
