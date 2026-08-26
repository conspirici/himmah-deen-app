"use client";

export interface ReminderConfig {
  enabled: boolean;
  morningTime: string;
  eveningTime: string;
}

const DEFAULT_CONFIG: ReminderConfig = {
  enabled: false,
  morningTime: "06:00",
  eveningTime: "21:00",
};

const KEY = "himmah_reminders";

export function getRemindersConfig(): ReminderConfig {
  if (typeof window === "undefined") return DEFAULT_CONFIG;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : DEFAULT_CONFIG;
  } catch {
    return DEFAULT_CONFIG;
  }
}

export function saveRemindersConfig(config: ReminderConfig) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(config));
  // Passing config to service worker to handle background notifications (if supported)
  if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: "UPDATE_REMINDERS",
      config
    });
  }
}
