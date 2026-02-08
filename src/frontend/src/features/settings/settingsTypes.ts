export interface StabilizationSettings {
  interval: number; // seconds
  timeout: number; // milliseconds
  maxRetries: number;
  backoffBaseDelay: number; // milliseconds
  backoffMultiplier: number;
}

export const DEFAULT_SETTINGS: StabilizationSettings = {
  interval: 30,
  timeout: 5000,
  maxRetries: 3,
  backoffBaseDelay: 1000,
  backoffMultiplier: 2,
};

export const SETTINGS_BOUNDS = {
  interval: { min: 5, max: 300 },
  timeout: { min: 1000, max: 30000 },
  maxRetries: { min: 0, max: 10 },
  backoffBaseDelay: { min: 100, max: 10000 },
  backoffMultiplier: { min: 1, max: 5 },
};
