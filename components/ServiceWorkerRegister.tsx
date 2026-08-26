"use client";
import { useEffect } from "react";
import { getRemindersConfig } from "@/lib/reminders";

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(console.error);
    }
  }, []);

  // Soft fallback for reminders when app is open
  useEffect(() => {
    const checkReminders = () => {
      const config = getRemindersConfig();
      if (!config.enabled) return;
      if (!("Notification" in window) || Notification.permission !== "granted") return;

      const now = new Date();
      const hm = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      
      const lastMorning = localStorage.getItem("himmah_notif_morning");
      const lastEvening = localStorage.getItem("himmah_notif_evening");
      const todayStr = now.toISOString().slice(0, 10);

      if (hm === config.morningTime && lastMorning !== todayStr) {
        new Notification("Himmah همة", { body: "🌙 A new day begins." });
        localStorage.setItem("himmah_notif_morning", todayStr);
      }
      
      if (hm === config.eveningTime && lastEvening !== todayStr) {
        new Notification("Himmah همة", { body: "🌿 A quiet moment for today's reflection?" });
        localStorage.setItem("himmah_notif_evening", todayStr);
      }
    };

    const interval = setInterval(checkReminders, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  return null;
}
