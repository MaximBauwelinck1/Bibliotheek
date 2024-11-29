import type supertest from 'supertest';

export const login = async (supertest: supertest.Agent): Promise<string> => {

  const response = await supertest.post('/api/sessions').send({
    email: 'john.doe@example.com',
    password: 'gebruiker1',
  });

  if (response.statusCode !== 200) {
    throw new Error(response.body.message || 'Unknown error occured');
  }
 
  return `Bearer ${response.body.token}`;
};
