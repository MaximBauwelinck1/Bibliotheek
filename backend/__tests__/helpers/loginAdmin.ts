import type supertest from 'supertest';

export const loginAdmin = async (
  supertest: supertest.Agent,
): Promise<string> => {
  const response = await supertest.post('/api/sessions').send({
    email: 'jane.smith@example.com',
    password: 'admin1',
  });
  
  if (response.statusCode !== 200) {
    throw new Error(response.body.message || 'Unknown error occured');
  }
  
  return `Bearer ${response.body.token}`;
};
  