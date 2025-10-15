import api from "../config/Api";

const bookingService = {
  async fetchBookings(query = '') {
    try {
      // Admin bookings endpoint
      const res = await api.get(`/api/bookings/admin${query ? `?${query}` : ''}`);
      return res.data;
    } catch (e) {
      // fallback to empty list for dev
      return [];
    }
  },

  async updateBookingStatus(id, body) {
    try {
      // server expects PUT /api/bookings/:id/status for admin updates
      const res = await api.put(`/api/bookings/${id}/status`, body);
      return res.data;
    } catch (e) {
      throw e;
    }
  },

  async exportBookings(query = '') {
    try {
      // No dedicated export endpoint on server; fetch bookings and build CSV client-side
      const bookings = await this.fetchBookings(query);
      if (!bookings || bookings.length === 0) return new Blob([""], { type: 'text/csv' });

      const headers = Object.keys(bookings[0]).filter(k => typeof bookings[0][k] !== 'object');
      const rows = bookings.map(b => headers.map(h => `"${String(b[h] ?? '').replace(/"/g, '""')}"`).join(','));
      const csv = [headers.join(','), ...rows].join('\n');
      return new Blob([csv], { type: 'text/csv' });
    } catch (e) {
      throw e;
    }
  }
};

export const fetchBookings = bookingService.fetchBookings;
export const updateBookingStatus = bookingService.updateBookingStatus;
export const exportBookings = bookingService.exportBookings;
export default bookingService;
