import request from 'supertest';
import app from '../app';

describe('Health Check API', () => {
  it('GET /health - should return 200 and a status message', async () => {
    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'success');
    expect(response.body).toHaveProperty('message', 'System is healthy');
  });
});
