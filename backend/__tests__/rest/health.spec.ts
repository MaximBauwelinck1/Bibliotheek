import supertest from 'supertest';
import createServer from '../../src/createServer';
import type { Server } from '../../src/createServer';
import packageJson from '../../package.json';

describe('Health', () => {

  let server: Server;
  let request: supertest.Agent;
  const url = '/api/health';
  beforeAll(async () => {
    server = await createServer();
    request = supertest(server.getApp().callback());
  });

  afterAll(async () => {
    await server.stop();
  });

  describe('GET /api/health/ping', () => {

    it('should return pong', async () => {
      const response = await request.get(url+'/ping');
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({ pong: true });
    });

    it('should be 400 with query parameters', async () => {
      const response = await request.get(`${url}/ping?test=test`);
      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.query).toHaveProperty('test');
    });

    it('should be 400 when sending an body', async () => {
      const response = await request.get(url+'/ping').send({
        test: 's',
      });
      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
    });
  });

  describe('GET /api/health/details', () => {
    it('should return details', async () => {
      const response = await request.get(url+'/details');

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
        env: 'testing',
        version: packageJson.version,
        name: packageJson.name,
        description: packageJson.description,
      });
    });

    it('should be 400 with query parameters', async () => {
      const response = await request.get(`${url}/details?test=test`);
      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.query).toHaveProperty('test');
    });
  });
});

describe('General', () => {
  const url = '/invalid';

  let server: Server;
  let request: supertest.Agent;

  beforeAll(async () => {
    server = await createServer();
    request = supertest(server.getApp().callback());
  });

  afterAll(async () => {
    await server.stop();
  });

  it('should return 404 when accessing invalid url', async () => {
    const response = await request.get(url);

    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual({
      code: 'NOT_FOUND',
      message: `Unknown resource: ${url}`,
    });
  });
});