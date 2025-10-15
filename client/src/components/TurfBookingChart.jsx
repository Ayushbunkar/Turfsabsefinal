import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import api from "../config/Api";
import { useEffect, useState } from "react";

const TurfBookingChart = () => {
  const [data, setData] = useState([]);
  const [notAuthorized, setNotAuthorized] = useState(false);

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      try {
        const res = await api.get("/api/analytics/turf-bookings");
        if (!mounted) return;
        setData(res.data || []);
      } catch (err) {
        // If server returns 403, it's superadmin-only — show safe fallback
        if (err?.response?.status === 403) {
          setNotAuthorized(true);
          setData([]);
          return;
        }
        // otherwise log and keep empty data
        console.error("Failed to load turf bookings for chart:", err);
        setData([]);
      }
    };

    fetchData();
    return () => { mounted = false; };
  }, []);

  if (notAuthorized) {
    return (
      <div className="w-full">
        <div className="mb-2 text-sm text-yellow-800 bg-yellow-50 dark:bg-yellow-900/20 dark:text-yellow-200 p-2 rounded">
          Turf bookings chart is restricted — system-wide analytics are available to Super Admins only.
        </div>
        <div className="flex items-center justify-center h-64 text-gray-500">
          No chart data available
        </div>
      </div>
    );
  }

  return (
    <BarChart width={600} height={300} data={data}>
      <XAxis dataKey="turf" />
      <YAxis />
      <Tooltip />
      <CartesianGrid stroke="#ccc" />
      <Bar dataKey="bookings" fill="#8884d8" />
    </BarChart>
  );
};

export default TurfBookingChart;
