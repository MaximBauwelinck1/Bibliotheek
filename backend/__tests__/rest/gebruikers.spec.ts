import type supertest from 'supertest'; 
import { prisma } from '../../src/data';
import withServer from '../helpers/withServer';
import { login } from '../helpers/login'; 
import { loginAdmin } from '../helpers/loginAdmin';
import testAuthHeader from '../helpers/testAuthHeader';

describe('Gebruikers', () => {

  let request: supertest.Agent;
  let authHeader: string;
  let adminAuthHeader: string;

  withServer((r) => (request = r));

  beforeAll(async () => {
    authHeader = await login(request);
    adminAuthHeader = await loginAdmin(request);
  });

  const url = '/api/gebruikers';

  describe('GET /api/gebruikers', () => {

    it('Should be 200 and returns all users', async () => {
      const response = await request.get(url).set('Authorization', adminAuthHeader);

      expect(response.statusCode).toBe(200);
      expect(response.body.items.length).toBe(2);
      expect(response.body.items).toEqual(
        expect.arrayContaining([ 
          expect.objectContaining({
            id: '8a128b24-411e-4312-8618-e0c0c72bcb41',
            voornaam: 'John',
            achternaam: 'Doe',
            geboortedatum: '1903-06-25T00:00:00.000Z',
            email: 'john.doe@example.com',
            rol: 'user',
            actief:true,
          }),
          expect.objectContaining({
            id: 'f1a98976-2d4b-4e88-8a96-fc5d12b04564',
            voornaam: 'Jane',
            achternaam: 'Smith',
            geboortedatum: '1903-06-25T00:00:00.000Z',
            email: 'jane.smith@example.com',
            rol: 'admin',
            actief:true,
          }),
        ]));
    });

    it('should 400 when passing an query param', async () => {
      const response = await request.get(`${url}?actief=true`).set('Authorization', adminAuthHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.query).toHaveProperty('actief');
    });

    it('should 403 when not an admin', async () => {
      const response = await request.get(url).set('Authorization', authHeader);

      expect(response.statusCode).toBe(403);
      expect(response.body).toMatchObject({
        code: 'FORBIDDEN',
        message: 'U mag dit deel van de applicatie niet bekijken',
      });
    });

    testAuthHeader(() => request.get(url));
  });

  describe('GET /api/gebruikers/:id', () => {

    it('should 200 and return the requested user', async () => {
      const response = await request.get(`${url}/8a128b24-411e-4312-8618-e0c0c72bcb41`)
        .set('Authorization', authHeader);

      expect(response.statusCode).toBe(200);
      expect(response.body).toMatchObject({
        id: '8a128b24-411e-4312-8618-e0c0c72bcb41',
        email: 'john.doe@example.com',
      });
    });

    it('should 200 and return my user info when passing \'me\' as id', async () => {
      const response = await request.get(`${url}/me`).set('Authorization', authHeader);

      expect(response.statusCode).toBe(200);
      expect(response.body).toMatchObject({
        id: '8a128b24-411e-4312-8618-e0c0c72bcb41',
        email: 'john.doe@example.com',
      });
    });

    it('should 404 with not existing user (and admin user requesting)', async () => {
      const response = await request.get(`${url}/1a128b24-411e-4312-8618-e0c0c72bcb41`)
        .set('Authorization', adminAuthHeader);

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        code: 'NOT_FOUND',
        message: 'gebruiker met id:1a128b24-411e-4312-8618-e0c0c72bcb41 bestaat niet.',
      });
      expect(response.body.stack).toBeTruthy();
    });

    it('should 400 with invalid user id (and admin user requesting)', async () => {
      const response = await request.get(`${url}/invalid`).set('Authorization', adminAuthHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.params).toHaveProperty('id');
    });

    it('should 403 when not an admin and not own user id', async () => {
      const response = await request.get(`${url}/f1a98976-2d4b-4e88-8a96-fc5d12b04564`)
        .set('Authorization', authHeader);

      expect(response.statusCode).toBe(403);
      expect(response.body).toMatchObject({
        code: 'FORBIDDEN',
        message: 'Je mag de informatie van deze gebruiker niet bekijken.',
      });
    });

    testAuthHeader(() => request.get(`${url}/1`));
  });

  describe('POST /api/gebruikers', () => {

    afterAll(async () => {
      await prisma.gebruiker.deleteMany({
        where: {
          email: 'testgebruiker@test.be',
        },
      });
    });
    it('should 200 and return the registered user', async () => {
      const response = await request.post(url)
        .send({
          voornaam: 'Test',
          achternaam: 'TEST',
          geboortedatum: '1903-06-25T00:00:00.000Z',
          email: 'testgebruiker@test.be',
          password: 'testtest',
        })
        .set('Authorization', authHeader);
      expect(response.statusCode).toBe(201);
      expect(response.body.token).toBeDefined();
    });
    it('should be 409 with existing name', async () => {
      const response = await request.post(url)
        .send({
          voornaam: 'Test',
          achternaam: 'TEST',
          geboortedatum: '1903-06-25T00:00:00.000Z',
          email: 'testgebruiker@test.be',
          password: 'testtest',
        })
        .set('Authorization', authHeader);
      expect(response.statusCode).toBe(409);
      expect(response.body).toMatchObject({
        code: 'CONFLICT',
        message: 'gebruiker met voor en achternaam bestaat al!',
      });
    });
  });
  describe('PUT /api/gebruikers/:id', () => {

    it('should 200 and return the updated user', async () => {
      const response = await request.put(`${url}/me`)
        .send({
          email: 'nieuwetestgebruiker@test.be',
        })
        .set('Authorization', authHeader);

      expect(response.statusCode).toBe(200);
      expect(response.body).toMatchObject({
        id: '8a128b24-411e-4312-8618-e0c0c72bcb41',
        email: 'nieuwetestgebruiker@test.be',
      });
    });
    it('should be 409 when updating user with an email addres already in use', async () => {
      const response = await request.put(`${url}/me`)
        .send({
          email: 'jane.smith@example.com',
        })
        .set('Authorization', authHeader);

      expect(response.statusCode).toBe(409);
      expect(response.body).toMatchObject({
        code: 'CONFLICT',
        message: 'Gebruiker met email addres bestaat al.',
      });
    });

    it('should 403 when not an admin and not own user id', async () => {
      const response = await request.put(`${url}/8a128b24-411e-4312-8618-e0c0c72bcb42`)
        .send({
          email: 'new.user@hogent.be',
        })
        .set('Authorization', authHeader);

      expect(response.statusCode).toBe(403);
      expect(response.body).toMatchObject({
        code: 'FORBIDDEN',
        message: 'Je mag de informatie van deze gebruiker niet bekijken.',
      });
    });

    testAuthHeader(() => request.put(`${url}/1`));
  });

  describe('DELETE /api/gebruikers/:id', () => {

    it('should 204 and return nothing', async () => {
      const response = await request.delete(`${url}/8a128b24-411e-4312-8618-e0c0c72bcb41`)
        .set('Authorization', authHeader);

      expect(response.statusCode).toBe(204);
      expect(response.body).toEqual({});
    });

    it('should 404 with not existing user', async () => {
      const response = await request.delete(`${url}/1a128b24-411e-4312-8618-e0c0c72bcb41`)
        .set('Authorization', adminAuthHeader);

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        code: 'NOT_FOUND',
        message: 'gebruiker met id:1a128b24-411e-4312-8618-e0c0c72bcb41 bestaat niet.',
      });
      expect(response.body.stack).toBeTruthy();
    });

    it('should 403 when not an admin and not own user id', async () => {
      const response = await request.delete(`${url}/8a128b24-411e-4312-8618-e0c0c72bcb42`)
        .set('Authorization', authHeader);

      expect(response.statusCode).toBe(403);
      expect(response.body).toMatchObject({
        code: 'FORBIDDEN',
        message: 'Je mag de informatie van deze gebruiker niet bekijken.',
      });
    });

    testAuthHeader(() => request.delete(`${url}/1`));
  });
  describe('POST /api/gebruikers/passwordForgot', () => {
    beforeAll(async () => {
      await prisma.gebruiker.create({ data: {
        id: '8a128b24-411e-4312-8618-e0c0c72bcb11',
        voornaam: 'fff',
        achternaam: 'Doffffe',
        geboortedatum: new Date('1903-06-25T00:00:00.000Z'),
        email: 'test@example.com',
        rol: 'user',
        actief:true,
        // eslint-disable-next-line @stylistic/max-len
        hashed_password:'$argon2id$v=19$m=131072,t=6,p=4$c4yGTzduMqVzDCGN2CzZEw$mCQCHpOSwNf2VNEB18UZ0owtIeBSj7h0k6wVx8WAmDw',
      } });
    });

    it('should 200 and sended the mail', async () => {
      const response = await request.post(url+'/passwordForgot')
        .send({
          email: 'test@example.com',
        });
      expect(response.statusCode).toBe(201);
      expect(response.body).toEqual({});
    });

    it('should be 409 when asking twice for an email verification within an hour', async () => {
      const response = await request.post(url+'/passwordForgot')
        .send({
          email: 'test@example.com',
        });
      expect(response.statusCode).toBe(409);
      expect(response.body).toMatchObject({
        code: 'CONFLICT',
        message: 'Er is nog een geldige herstel wachtwoord link actief. Bekijk je laatste mail',
      });
    });

    it('should be 400 with query parameters', async () => {
      const response = await request.post(`${url}/passwordForgot?test=test`);
      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.query).toHaveProperty('test');
    });

    it('should be 400 when sending an body', async () => {
      const response = await request.post(url+'/passwordForgot').send({
        test: 's',
      });
      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
    });
    afterAll(async () => {
      await prisma.passwordReset.deleteMany();
      await prisma.gebruiker.delete({ where:{
        email:'test@example.com',
      }});
    });
  });

  describe('POST /api/gebruikers/passwordReset', () => {
    beforeAll(async () => {
      await prisma.gebruiker.create({ data: {
        id: '8a128b24-411e-4312-8618-e0c0c72bcb11',
        voornaam: 'fff',
        achternaam: 'Doffffe',
        geboortedatum: new Date('1903-06-25T00:00:00.000Z'),
        email: 'test@example.com',
        rol: 'user',
        actief:true,
        // eslint-disable-next-line @stylistic/max-len
        hashed_password:'$argon2id$v=19$m=131072,t=6,p=4$c4yGTzduMqVzDCGN2CzZEw$mCQCHpOSwNf2VNEB18UZ0owtIeBSj7h0k6wVx8WAmDw',
      } });
    });

    it('should be 401 with invalid token', async () => {
      const response = await request.post(url+'/passwordReset')
        .send({
          token: 'invalidtoken',
          password: 'testtest',
        });
      expect(response.statusCode).toBe(401);
      expect(response.body).toMatchObject({
        code: 'UNAUTHORIZED',
        message: 'Ongeldige authenticatie token: jwt malformed',
      });
    });

    it('should be 400 with query parameters', async () => {
      const response = await request.post(`${url}/passwordReset?test=test`);
      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.query).toHaveProperty('test');
    });

    it('should be 400 when sending an body', async () => {
      const response = await request.post(url+'/passwordReset').send({
        test: 's',
      });
      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
    });
    afterAll(async () => {
      await prisma.passwordReset.deleteMany();
      await prisma.gebruiker.delete({ where:{
        email:'test@example.com',
      }});
    });
  });
});