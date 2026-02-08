import { useState, useEffect } from 'react';
import { StabilizationSettings, DEFAULT_SETTINGS, SETTINGS_BOUNDS } from './settingsTypes';

const STORAGE_KEY = 'network-stabilizer-settings';

function loadSettings(): StabilizationSettings {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return { ...DEFAULT_SETTINGS, ...parsed };
    }
  } catch (error) {
    console.warn('Failed to load settings:', error);
  }
  return DEFAULT_SETTINGS;
}

function saveSettings(settings: StabilizationSettings): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (error) {
    console.warn('Failed to save settings:', error);
  }
}

export function validateSetting(
  key: keyof StabilizationSettings,
  value: number
): number {
  const bounds = SETTINGS_BOUNDS[key];
  return Math.max(bounds.min, Math.min(bounds.max, value));
}

export function useSettings() {
  const [settings, setSettings] = useState<StabilizationSettings>(loadSettings);

  const updateSetting = (key: keyof StabilizationSettings, value: number) => {
    const validated = validateSetting(key, value);
    const updated = { ...settings, [key]: validated };
    setSettings(updated);
    saveSettings(updated);
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
    saveSettings(DEFAULT_SETTINGS);
  };

  return {
    ...settings,
    updateSetting,
    resetSettings,
  };
}
