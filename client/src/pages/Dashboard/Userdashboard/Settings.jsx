import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Settings, Bell, Lock, Shield } from "lucide-react";
import { useAuth } from "../../../context/AuthContext.jsx";
import Sidebar from "../../../components/Sidebar/UserSidebar";
// Local Card fallback (components/ui/Card not present)
function Card({ className = "", children }) {
  return (
    <div className={`rounded-xl shadow-lg bg-white dark:bg-gray-800 ${className}`}>
      {children}
    </div>
  );
}
import toast from "react-hot-toast";
import axios from "axios";

const ToggleSwitch = ({ enabled, onChange }) => (
  <button
    onClick={() => onChange(!enabled)}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
      enabled ? "bg-green-600" : "bg-gray-200 dark:bg-gray-600"
    }`}
  >
    <span
      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
        enabled ? "translate-x-6" : "translate-x-1"
      }`}
    />
  </button>
);

const SettingToggle = ({ label, desc, value, onChange }) => (
  <div className="flex items-center justify-between">
    <div>
      <h3 className="font-medium text-gray-900 dark:text-white">{label}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400">{desc}</p>
    </div>
    <ToggleSwitch enabled={value} onChange={onChange} />
  </div>
);

const SettingSelect = ({ label, value, onChange, options }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
      {label}
    </label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

export default function UserSettings() {
  const { user } = useAuth();
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    bookingReminders: true,
    paymentAlerts: true,
    promotionalEmails: false,
    profileVisibility: "private",
    shareBookingHistory: false,
    allowDataCollection: true,
    twoFactorAuth: false,
    loginAlerts: true,
    language: "en",
    timezone: "Asia/Kolkata",
    currency: "INR",
    theme: "system",
    sessionTimeout: 30,
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:4500/api/users/settings", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data) setSettings((prev) => ({ ...prev, ...res.data }));
      } catch {}
    };
    fetchSettings();
  }, []);

  const updateSettings = async (key, value) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        "http://localhost:4500/api/users/settings",
        { [key]: value },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSettings((prev) => ({ ...prev, [key]: value }));
      toast.success("Settings updated successfully!");
    } catch {
      setSettings((prev) => ({ ...prev, [key]: value }));
    } finally {
      setLoading(false);
    }
  };

  if (!user)
    return (
      <div className="flex items-center justify-center h-screen">
        Please log in to view your settings
      </div>
    );

  return (
    <div
      className={`${
        darkMode ? "dark" : ""
      } min-h-screen bg-gradient-to-br from-green-50 via-green-100 to-green-200 dark:from-gray-900 dark:to-gray-800`}
    >
      <div className="flex">
        <Sidebar user={user} onToggleDark={() => setDarkMode(!darkMode)} darkMode={darkMode} />
        <main className="flex-1 ml-0 lg:ml-64 p-4 lg:p-8 pt-48 pb-8 min-h-screen">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Settings</h1>

            {/* Notification Settings */}
            <Card className="p-6 mb-6">
              <div className="flex items-center mb-4">
                <Bell className="w-6 h-6 text-green-600 mr-3" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Notification Preferences</h2>
              </div>
              <div className="space-y-4">
                {[
                  ["Email Notifications", "Receive booking confirmations and updates via email", "emailNotifications"],
                  ["SMS Notifications", "Get text messages for booking reminders", "smsNotifications"],
                  ["Push Notifications", "Receive push notifications on your device", "pushNotifications"],
                  ["Booking Reminders", "Get reminded before your scheduled bookings", "bookingReminders"],
                  ["Payment Alerts", "Notifications for successful and failed payments", "paymentAlerts"],
                  ["Promotional Emails", "Receive offers and promotional content", "promotionalEmails"],
                ].map(([label, desc, key]) => (
                  <SettingToggle
                    key={key}
                    label={label}
                    desc={desc}
                    value={settings[key]}
                    onChange={(val) => updateSettings(key, val)}
                  />
                ))}
              </div>
            </Card>

            {/* Privacy & App Preferences */}
            <Card className="p-6 mb-6">
              <div className="flex items-center mb-4">
                <Shield className="w-6 h-6 text-green-600 mr-3" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Privacy & Preferences</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SettingSelect
                  label="Profile Visibility"
                  value={settings.profileVisibility}
                  onChange={(val) => updateSettings("profileVisibility", val)}
                  options={[
                    { value: "public", label: "Public" },
                    { value: "private", label: "Private" },
                    { value: "friends", label: "Friends Only" },
                  ]}
                />
                <SettingToggle
                  label="Share Booking History"
                  desc="Allow others to see your booking activity"
                  value={settings.shareBookingHistory}
                  onChange={(val) => updateSettings("shareBookingHistory", val)}
                />
                <SettingToggle
                  label="Allow Data Collection"
                  desc="Allow us to collect usage data to improve our service"
                  value={settings.allowDataCollection}
                  onChange={(val) => updateSettings("allowDataCollection", val)}
                />
                <SettingToggle
                  label="Two-Factor Authentication"
                  desc="Add an extra layer of security"
                  value={settings.twoFactorAuth}
                  onChange={(val) => updateSettings("twoFactorAuth", val)}
                />
                <SettingToggle
                  label="Login Alerts"
                  desc="Get notified when someone logs into your account"
                  value={settings.loginAlerts}
                  onChange={(val) => updateSettings("loginAlerts", val)}
                />
                <SettingSelect
                  label="Language"
                  value={settings.language}
                  onChange={(val) => updateSettings("language", val)}
                  options={[
                    { value: "en", label: "English" },
                    { value: "hi", label: "हिन्दी" },
                    { value: "es", label: "Español" },
                    { value: "fr", label: "Français" },
                  ]}
                />
                <SettingSelect
                  label="Timezone"
                  value={settings.timezone}
                  onChange={(val) => updateSettings("timezone", val)}
                  options={[
                    { value: "Asia/Kolkata", label: "Asia/Kolkata" },
                    { value: "UTC", label: "UTC" },
                    { value: "America/New_York", label: "America/New_York" },
                    { value: "Europe/London", label: "Europe/London" },
                  ]}
                />
                <SettingSelect
                  label="Currency"
                  value={settings.currency}
                  onChange={(val) => updateSettings("currency", val)}
                  options={[
                    { value: "INR", label: "₹ Indian Rupee" },
                    { value: "USD", label: "$ US Dollar" },
                    { value: "EUR", label: "€ Euro" },
                    { value: "GBP", label: "£ British Pound" },
                  ]}
                />
                <SettingSelect
                  label="Theme"
                  value={settings.theme}
                  onChange={(val) => updateSettings("theme", val)}
                  options={[
                    { value: "light", label: "Light" },
                    { value: "dark", label: "Dark" },
                    { value: "system", label: "System Default" },
                  ]}
                />
                <SettingSelect
                  label="Session Timeout"
                  value={settings.sessionTimeout}
                  onChange={(val) => updateSettings("sessionTimeout", parseInt(val))}
                  options={[
                    { value: 15, label: "15 minutes" },
                    { value: 30, label: "30 minutes" },
                    { value: 60, label: "1 hour" },
                    { value: 120, label: "2 hours" },
                    { value: 0, label: "Never" },
                  ]}
                />
              </div>
            </Card>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
