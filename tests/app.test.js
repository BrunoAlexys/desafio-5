const request = require('supertest');
const app = require('../src/app');

describe('API Routes', () => {
  it('GET /api/status should return 200 and status ok', async () => {
    const response = await request(app).get('/api/status');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: 'ok',
      message: 'API is running',
    });
  });
});
