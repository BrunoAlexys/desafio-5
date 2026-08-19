const request = require('supertest');
const app = require('../src/app');
const userController = require('../src/controllers/user.controller');

describe('User CRUD API', () => {
  beforeEach(() => {
    // Reset state before each test
    userController._resetState();
  });

  it('should return empty array when no users exist', async () => {
    const response = await request(app).get('/api/users');
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it('should create a new user', async () => {
    const newUser = { name: 'John Doe', email: 'john@example.com' };
    const response = await request(app).post('/api/users').send(newUser);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id', 1);
    expect(response.body.name).toBe(newUser.name);
    expect(response.body.email).toBe(newUser.email);
  });

  it('should fail to create user without name or email', async () => {
    const response = await request(app)
      .post('/api/users')
      .send({ name: 'John' });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Name and email are required');
  });

  it('should retrieve a user by ID', async () => {
    // Create first
    const created = await request(app)
      .post('/api/users')
      .send({ name: 'Jane Doe', email: 'jane@example.com' });
    const userId = created.body.id;

    const response = await request(app).get(`/api/users/${userId}`);
    expect(response.status).toBe(200);
    expect(response.body.id).toBe(userId);
    expect(response.body.name).toBe('Jane Doe');
  });

  it('should return 404 when getting non-existent user', async () => {
    const response = await request(app).get('/api/users/999');
    expect(response.status).toBe(404);
  });

  it('should update an existing user', async () => {
    const created = await request(app)
      .post('/api/users')
      .send({ name: 'Old Name', email: 'old@example.com' });
    const userId = created.body.id;

    const response = await request(app)
      .put(`/api/users/${userId}`)
      .send({ name: 'New Name' });
    expect(response.status).toBe(200);
    expect(response.body.name).toBe('New Name');
    expect(response.body.email).toBe('old@example.com');
  });

  it('should delete a user', async () => {
    const created = await request(app)
      .post('/api/users')
      .send({ name: 'To Delete', email: 'delete@example.com' });
    const userId = created.body.id;

    const deleteResponse = await request(app).delete(`/api/users/${userId}`);
    expect(deleteResponse.status).toBe(204);

    const getResponse = await request(app).get(`/api/users/${userId}`);
    expect(getResponse.status).toBe(404);
  });
});
