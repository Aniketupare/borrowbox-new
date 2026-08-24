import request from 'supertest';
import app from '../src/app';
import mongoose from 'mongoose';

describe('BorrowBox API Lifecycle', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/borrowbox_test');
  });

  afterAll(async () => {
    if (mongoose.connection.db) {
      await mongoose.connection.db.dropDatabase();
    }
    await mongoose.connection.close();
  });

  it('should run through the full lifecycle', async () => {
    // 1. Auth: Register two users
    const user1 = await request(app).post('/api/auth/register').send({
      name: 'User One',
      email: 'user1@example.com',
      password: 'password123',
      location: { coordinates: [0, 0] }
    });
    expect(user1.status).toBe(201);
    
    // Extract token from cookie (simplified for test)
    const cookie = user1.headers['set-cookie'];

    const user2 = await request(app).post('/api/auth/register').send({
      name: 'User Two',
      email: 'user2@example.com',
      password: 'password123',
      location: { coordinates: [0, 0] }
    });
    expect(user2.status).toBe(201);

    // 2. Items: List an item
    const item = await request(app).post('/api/items')
      .set('Cookie', cookie)
      .send({
        title: 'Drill',
        description: 'Power drill',
        category: 'Tools',
        images: ['url'],
        condition: 'Good',
        location: { coordinates: [0, 0] },
        borrowingFee: 10,
        securityDeposit: 50,
        availability: { startDate: new Date().toISOString(), endDate: new Date(Date.now() + 86400000).toISOString() }
      });
    expect(item.status).toBe(201);
    const itemId = item.body._id;

    // 3. Borrow Requests: Request the item (needs User 2 cookie)
    // Re-register or login for User 2 to get cookie
    const login2 = await request(app).post('/api/auth/login').send({ email: 'user2@example.com', password: 'password123' });
    const cookie2 = login2.headers['set-cookie'];

    const borrowRequest = await request(app).post('/api/borrow-requests')
      .set('Cookie', cookie2)
      .send({
        item: itemId,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 86400000).toISOString(),
        message: 'Can I borrow?'
      });
    expect(borrowRequest.status).toBe(201);
    const requestId = borrowRequest.body._id;

    // 4. Approval: Approve request (User 1)
    const approve = await request(app).put(`/api/borrow-requests/${requestId}/approve`).set('Cookie', cookie);
    expect(approve.status).toBe(200);

    // 5. Booking: Create booking (User 2)
    const booking = await request(app).post('/api/bookings')
      .set('Cookie', cookie2)
      .send({ borrowRequestId: requestId });
    expect(booking.status).toBe(201);
    const bookingId = booking.body._id;

    // 6. Return: Return item (User 1)
    const returned = await request(app).put(`/api/bookings/${bookingId}/return`).set('Cookie', cookie);
    expect(returned.status).toBe(200);

    // 7. Review: User 2 reviews User 1
    const review = await request(app).post('/api/reviews')
      .set('Cookie', cookie2)
      .send({
        bookingId,
        rating: 5,
        comment: 'Great!'
      });
    expect(review.status).toBe(201);
  });
});
