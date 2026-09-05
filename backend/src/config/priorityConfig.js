/**
 * Central Priority Configuration
 * Single source of truth for priority thresholds, weights, colors, and labels.
 * All components (cards, map, dashboard, issue detail, tables) must use this config.
 */

const PRIORITY_WEIGHTS = {
  severity: 0.40,
  corroboration: 0.30,
  upvotes: 0.20,
  age: 0.10,
};

const PRIORITY_LEVELS = {
  CRITICAL: {
    min: 90,
    max: 100,
    label: 'CRITICAL',
    icon: '🔴',
    color: '#dc2626',
    background: '#fef2f2',
    border: '#fecaca',
    textColor: '#991b1b',
    description: 'Requires immediate emergency attention',
  },
  HIGH: {
    min: 75,
    max: 89,
    label: 'HIGH',
    icon: '🟠',
    color: '#ea580c',
    background: '#fff7ed',
    border: '#fed7aa',
    textColor: '#9a3412',
    description: 'Urgent issue requiring prompt action',
  },
  MEDIUM: {
    min: 50,
    max: 74,
    label: 'MEDIUM',
    icon: '🟡',
    color: '#ca8a04',
    background: '#fefce8',
    border: '#fef08a',
    textColor: '#854d0e',
    description: 'Standard priority — scheduled resolution',
  },
  LOW: {
    min: 0,
    max: 49,
    label: 'LOW',
    icon: '🟢',
    color: '#16a34a',
    background: '#f0fdf4',
    border: '#bbf7d0',
    textColor: '#166534',
    description: 'Minor issue — will be addressed in due course',
  },
};

const SEVERITY_VALUES = {
  Low: 25,
  Medium: 50,
  High: 75,
  Critical: 100,
};

/**
 * Derive priority level from a numeric score (0–100).
 */
function getPriorityLevel(score) {
  if (score >= PRIORITY_LEVELS.CRITICAL.min) return PRIORITY_LEVELS.CRITICAL;
  if (score >= PRIORITY_LEVELS.HIGH.min) return PRIORITY_LEVELS.HIGH;
  if (score >= PRIORITY_LEVELS.MEDIUM.min) return PRIORITY_LEVELS.MEDIUM;
  return PRIORITY_LEVELS.LOW;
}

/**
 * Derive the string label (Low/Medium/High/Critical) from a numeric score.
 * This keeps backward compatibility with the existing Issue.priority enum.
 */
function getPriorityLabel(score) {
  if (score >= PRIORITY_LEVELS.CRITICAL.min) return 'Critical';
  if (score >= PRIORITY_LEVELS.HIGH.min) return 'High';
  if (score >= PRIORITY_LEVELS.MEDIUM.min) return 'Medium';
  return 'Low';
}

module.exports = {
  PRIORITY_WEIGHTS,
  PRIORITY_LEVELS,
  SEVERITY_VALUES,
  getPriorityLevel,
  getPriorityLabel,
};
