import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../app.js';
import User from '../models/User.js';
import Turf from '../models/Turf.js';
import Booking from '../models/Booking.js';
import jwt from 'jsonwebtoken';

let mongo;
let server;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongo.stop();
});

describe('Booking endpoints', () => {
  let token;
  let user;
  let turf;

  beforeEach(async () => {
    await User.deleteMany({});
    await Turf.deleteMany({});
    await Booking.deleteMany({});

    user = await User.create({ name: 'Test', email: 't@test.com', password: 'pass', role: 'user' });
    // sign token using server JWT_SECRET or fallback
    token = jwt.sign({ id: user._id, role: 'user' }, process.env.JWT_SECRET || 'testsecret');

    turf = await Turf.create({ name: 'Turf 1', location: 'A', pricePerHour: 500, availableSlots: [{ startTime: '10:00', endTime: '11:00' }], admin: user._id, isApproved: true });
  });

  test('create booking -> create order -> verify payment lifecycle', async () => {
    // create booking
    const bookingRes = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${token}`)
      .send({ turfId: turf._id, slot: turf.availableSlots[0], date: '2025-10-20' })
      .expect(201);

    const booking = bookingRes.body.booking;
    expect(booking.status).toBe('pending');

    // create payment order (we won't call razorpay, but controller uses razorpay.orders.create)
    // stub by calling create-order and expect 500 or object; instead we'll directly test verifyPayment

    // create a fake razorpay ids and signature
    const fakeOrderId = 'order_test_123';
    const fakePaymentId = 'pay_test_123';
    const body = fakeOrderId + '|' + fakePaymentId;
    const signature = require('crypto').createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'dummy').update(body).digest('hex');

    const verifyRes = await request(app)
      .post('/api/payments/verify')
      .set('Authorization', `Bearer ${token}`)
      .send({ razorpay_order_id: fakeOrderId, razorpay_payment_id: fakePaymentId, razorpay_signature: signature, bookingId: booking._id })
      .expect(200);

    expect(verifyRes.body.booking.status).toBe('paid');
  });

  test('pending TTL index exists on Booking model', async () => {
    const BookingModel = Booking;
    const indexes = await BookingModel.collection.indexes();
    const ttlIndex = indexes.find(i => i.expireAfterSeconds !== undefined && i.partialFilterExpression && i.partialFilterExpression.status === 'pending');
    expect(ttlIndex).toBeDefined();
    const expected = Number(process.env.PENDING_BOOKING_TTL) || 900;
    expect(ttlIndex.expireAfterSeconds).toBe(expected);
  });

  test('admin can release pending booking and audit log created', async () => {
    // create admin user
    const admin = await User.create({ name: 'Admin', email: 'a@a.com', password: 'pass', role: 'admin' });
    const adminToken = jwt.sign({ id: admin._id, role: 'admin' }, process.env.JWT_SECRET || 'testsecret');

    // create a booking as normal user
    const bookingRes = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${token}`)
      .send({ turfId: turf._id, slot: turf.availableSlots[0], date: '2025-10-22' })
      .expect(201);

    const booking = bookingRes.body.booking;
    expect(booking.status).toBe('pending');

    // admin releases it
    const releaseRes = await request(app)
      .post(`/api/bookings/${booking._id}/release`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(releaseRes.body.booking.status).toBe('cancelled');

    // audit log created
    const AuditLog = require('../models/AuditLog.js').default;
    const logs = await AuditLog.find({ targetBooking: booking._id });
    expect(logs.length).toBeGreaterThan(0);
  });

  test('cleanup endpoint deletes old pending bookings', async () => {
    // create a pending booking with an old createdAt
    const old = new Date(Date.now() - (Number(process.env.PENDING_BOOKING_TTL) || 900) * 1000 - 5000);
    const oldBooking = await Booking.create({ user: user._id, turf: turf._id, slot: turf.availableSlots[0], date: '2025-11-01', price: 500, status: 'pending', createdAt: old });

    // create superadmin
    const superadmin = await User.create({ name: 'Super', email: 's@a.com', password: 'pass', role: 'superadmin' });
    const superToken = jwt.sign({ id: superadmin._id, role: 'superadmin' }, process.env.JWT_SECRET || 'testsecret');

    const res = await request(app).post('/api/bookings/cleanup-pending').set('Authorization', `Bearer ${superToken}`).expect(200);
    expect(res.body.deletedCount).toBeGreaterThan(0);

    const found = await Booking.findById(oldBooking._id);
    expect(found).toBeNull();
  });
});
