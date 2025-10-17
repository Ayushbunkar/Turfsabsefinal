import React from 'react';
import { motion } from 'framer-motion';
import {
  MapPin,
  Tag,
  Users,
  Star,
  Calendar,
} from 'lucide-react';
import api from '../config/Api';
import usePrice from '../hooks/usePrice';
import { useTranslation } from 'react-i18next';

// Inline SVG placeholder as data URI to avoid external network dependency (via.placeholder.com can fail)
const PLACEHOLDER = "data:image/svg+xml;utf8," + encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='600' height='300'>
    <rect width='100%' height='100%' fill='#f3f4f6'/>
    <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='#9ca3af' font-family='Arial, Helvetica, sans-serif' font-size='28'>No Image</text>
  </svg>`
);

const sportLabels = {
  football: 'Football',
  cricket: 'Cricket',
  basketball: 'Basketball',
  volleyball: 'Volleyball',
  badminton: 'Badminton',
  tennis: 'Tennis',
  multiple: 'Multiple Sports',
};

export default function TurfCard({ turf, onBook, small = false, index = 0 }) {
  const src = turf.image || (Array.isArray(turf.images) && turf.images[0]) || null;
  const getImage = () => {
    if (!src || src === '/uploads/undefined' || src === 'undefined' || src === undefined) return null;
    if (typeof src !== 'string') return null;
    if (src.startsWith('http')) return src;
    // prefer VITE_API_URL if provided, otherwise use api baseURL
    const base = import.meta.env.VITE_API_URL || api.defaults.baseURL || '';
    if (src.startsWith('/')) return `${base}${src}`;
    return `${base}/${src}`;
  };

  const { formatted: formattedPrice } = usePrice(turf.pricePerHour || 0);
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, delay: index * 0.06 }}
      className={`rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-white border`}
    >
      <div className="relative h-52 overflow-hidden">
        <img
          src={getImage() || PLACEHOLDER}
          alt={turf.name}
          onError={(e) => {
            // prevent infinite loop if data URI somehow fails
            try { e.target.onerror = null; } catch (err) {}
            e.target.src = PLACEHOLDER;
          }}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105 bg-gray-100"
        />

        {/* subtle overlay so image remains visible */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />

        <div className="absolute top-3 left-3 bg-white/90 px-2 py-1 rounded text-xs font-medium">
          {sportLabels[turf.sportType] || turf.sportType || 'Multi'}
        </div>

        {!turf.isApproved && (
          <div className="absolute top-3 right-3 bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">{t('booking.pending') || 'Pending'}</div>
        )}

        <div className="absolute bottom-4 left-4">
          <h3 className="text-white font-bold text-lg drop-shadow-md">{turf.name}</h3>
          <div className="flex items-center text-white/80 text-sm mt-1">
            <Star className="w-4 h-4 text-yellow-400 mr-1" /> {turf.rating || 0} • {turf.reviews || 0} reviews
          </div>
        </div>
      </div>

      {/* DEBUG: show computed image src (temporary) */}
      <div className="px-3 py-2 text-xs text-gray-500 break-words">Image: <span className="font-mono text-[10px]">{getImage() || 'none'}</span></div>

      <div className="p-5 space-y-3">
        <div className="space-y-1">
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-2 text-gray-400" />
            <span className="text-sm text-gray-700 truncate">{turf.location}</span>
          </div>
          <div className="flex items-center">
            <Tag className="w-4 h-4 mr-2 text-gray-400" />
            <span className="text-sm text-gray-700">{sportLabels[turf.sportType] || turf.sportType}</span>
          </div>
          <div className="flex items-center">
            <span className="text-lg font-semibold text-green-600">{formattedPrice} / hour</span>
          </div>
        </div>

        <p className={`text-sm text-gray-500 line-clamp-2`}>{turf.description || ''}</p>

        <div className="flex items-center gap-4">
          {turf.capacity && (
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-1 text-gray-400" />
              <span className="text-sm text-gray-700">{turf.capacity} players</span>
            </div>
          )}
          {turf.size && (
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1 text-gray-400" />
              <span className="text-sm text-gray-700">{turf.size}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div>
            <div className="text-green-600 font-bold">{formattedPrice}</div>
            <div className="text-xs text-gray-500">/ hour</div>
          </div>
          <button onClick={onBook} className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm">{t('booking.book') || 'Book'}</button>
        </div>
      </div>
    </motion.div>
  );
}
