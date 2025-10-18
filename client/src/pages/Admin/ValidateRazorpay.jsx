import React, { useState } from 'react';
import api from '../../config/Api';

export default function ValidateRazorpay() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [detail, setDetail] = useState(null);

  const run = async () => {
    setLoading(true); setStatus(null); setDetail(null);
    try {
      const res = await api.post('/api/payments/validate-keys');
      setStatus('ok');
      setDetail(res.data);
    } catch (e) {
      setStatus('fail');
      setDetail(e?.response?.data || e.message);
    } finally { setLoading(false); }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h3 className="text-lg font-bold mb-4">Validate Razorpay Keys</h3>
      <p className="mb-4 text-sm text-gray-600">This action will attempt a tiny Razorpay API call to verify the configured keys. Admin only.</p>
      <div className="flex gap-2">
        <button onClick={run} disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">{loading ? 'Running...' : 'Run validation'}</button>
      </div>
      {status && (
        <div className={`mt-4 p-3 rounded ${status === 'ok' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          <div className="font-semibold">{status === 'ok' ? 'Keys valid' : 'Validation failed'}</div>
          <pre className="mt-2 text-xs overflow-auto">{JSON.stringify(detail, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
