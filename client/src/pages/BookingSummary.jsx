import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../config/Api';

export default function BookingSummary() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [turf, setTurf] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function fetchTurf() {
      try {
        const res = await api.get(`/api/turfs/${id}`);
        if (!mounted) return;
        setTurf(res.data);
      } catch (err) {
        console.error('Failed to load turf', err);
        setError('Turf not found');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchTurf();
    return () => (mounted = false);
  }, [id]);

  if (loading) return <div className="p-8">Loading...</div>;
  if (error || !turf) return <div className="p-8">{error || 'Turf not found'}</div>;

  const onContinue = () => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate(`/booking/${id}`);
    } else {
      navigate(`/login?redirect=/booking/${id}`);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-2">{turf.name}</h2>
        <p className="text-sm text-gray-600 mb-4">{turf.location}</p>
        <div className="mb-4">
          <div className="text-sm text-gray-500">Price</div>
          <div className="text-2xl font-bold text-green-600">₹{turf.pricePerHour}</div>
        </div>
        <p className="text-sm text-gray-700 mb-6">{turf.description}</p>

        <div className="flex justify-end">
          <button onClick={onContinue} className="px-4 py-2 bg-green-600 text-white rounded">
            Continue to booking
          </button>
        </div>
      </div>
    </div>
  );
}
