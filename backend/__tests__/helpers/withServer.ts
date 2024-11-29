import supertest from 'supertest'; 
import type { Server } from '../../src/createServer'; 
import createServer from '../../src/createServer'; 
import { prisma } from '../../src/data'; 
import Role from '../../src/core/roles'; 

export default function withServer(setter: (s: supertest.Agent) => void): void {
  let server: Server; 

  beforeAll(async () => {
    server = await createServer(); 
   
    await prisma.gebruiker.createMany({
      data: [
        {
          id: '8a128b24-411e-4312-8618-e0c0c72bcb41',
          voornaam: 'John',
          achternaam: 'Doe',
          geboortedatum: new Date('1903-06-25T00:00:00.000Z'),
          email: 'john.doe@example.com',
          rol: JSON.stringify(Role.USER).replaceAll('"',''),
          actief:true,
          // eslint-disable-next-line @stylistic/max-len
          hashed_password: '$argon2id$v=19$m=131072,t=6,p=4$c4yGTzduMqVzDCGN2CzZEw$mCQCHpOSwNf2VNEB18UZ0owtIeBSj7h0k6wVx8WAmDw', // == gebruiker1
        },
        {
          id: 'f1a98976-2d4b-4e88-8a96-fc5d12b04564',
          voornaam: 'Jane',
          achternaam: 'Smith',
          geboortedatum: new Date('1903-06-25T00:00:00.000Z'),
          email: 'jane.smith@example.com',
          rol: JSON.stringify(Role.ADMIN).replaceAll('"',''),
          actief:true,
          // eslint-disable-next-line @stylistic/max-len
          hashed_password: '$argon2id$v=19$m=131072,t=6,p=4$sAKaUpr6557w4SLcuViw4g$Z4TE662mF5eEUXcNHgJSrywu8CDHdXUPm5m8ka0pK+w',// == admin1
        }],
    });
    
    setter(supertest(server.getApp().callback()));
  });

  afterAll(async () => {
    await prisma.gebruiker.deleteMany();
    await prisma.reservatie.deleteMany();
    await prisma.boekKopie.deleteMany();
    await prisma.boek.deleteMany();
    await prisma.auteur.deleteMany();
   
    await server.stop();
  });
}
