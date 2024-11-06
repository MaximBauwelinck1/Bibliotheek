import supertest from 'supertest'; 
import createServer from '../../src/createServer'; 
import type { Server } from '../../src/createServer'; 
import { prisma } from '../../src/data';

const data = {
  auteurs : [
    {
      id: '1ff66c9c-a567-4ca2-8e07-9199e550e64d',
      voornaam: 'J.K.',
      achternaam: 'Rowling',
      geboortedatum: new Date('1965-07-31T00:00:00.000Z'),
      nationaliteit: 'British',
      biografie: 'Author of the Harry Potter series.',
      upgedate: new Date(), 
    },
    {
      id: 'd2c114ad-9c09-4ecb-9d24-aeb4015bddb8',
      voornaam: 'George',
      achternaam: 'Orwell',
      geboortedatum: new Date('1903-06-25T00:00:00.000Z'),
      nationaliteit: 'British',
      biografie: 'Known for 1984 and Animal Farm.',
      upgedate: new Date(),
    },
    {
      id: 'ba24ae71-c4e1-45fb-a7d3-13ef3d225af6',
      voornaam: 'Harper',
      achternaam: 'Lee',
      geboortedatum: new Date('1926-04-28T00:00:00.000Z'),
      nationaliteit: 'American',
      biografie: 'Author of To Kill a Mockingbird.',
      upgedate: new Date(),
    },
    {
      id: '6221987c-17b4-433d-a23a-836c82524217',
      voornaam: 'Mark',
      achternaam: 'Twain',
      geboortedatum: new Date('1835-11-30T00:00:00.000Z'),
      nationaliteit: 'American',
      biografie: 'Famous for The Adventures of Tom Sawyer.',
      upgedate: new Date(),
    },
    {
      id: 'a4a746b4-5cc4-41b6-bc32-78f79c86b4f1',
      voornaam: 'Gabriel',
      achternaam: 'Garcia Marquez',
      geboortedatum: new Date('1927-03-06T00:00:00.000Z'),
      nationaliteit: 'Colombian',
      biografie: 'Known for One Hundred Years of Solitude.',
      upgedate: new Date(),
    },
  ],
  
  boeken : [
    {
      id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      ISBN: '9780141036137',
      titel: '1984',
      genre: 'Dystopian',
      publicatie_datum: new Date('1903-06-25T00:00:00.000Z'),
      taal: 'English',
      paginas: 328,
      vrije_kopieen: 3,
      totale_kopieen: 5,
      beschrijving: 'A novel that portrays a terrifying vision of a controlled and monitored society.',
      cover_uri: 'https://example.com/cover/1984.jpg',
      aangemaakt: '2024-01-01T12:00:00Z',
      upgedate: '2024-01-01T12:00:00Z',
      auteur_id: 'a4a746b4-5cc4-41b6-bc32-78f79c86b4f1',
    },
    {
      id: '5e846780-937b-471d-96e3-d567b86a95bb',
      ISBN: '9780141439518',
      titel: 'Pride and Prejudice',
      genre: 'Romance',
      publicatie_datum: new Date('1903-06-25T00:00:00.000Z'),
      taal: 'English',
      paginas: 279,
      vrije_kopieen: 2,
      totale_kopieen: 4,
      beschrijving: 'The novel follows the character development of Elizabeth Bennet.',
      cover_uri: 'https://example.com/cover/pride-and-prejudice.jpg',
      aangemaakt: '2024-01-01T12:00:00Z',
      upgedate: '2024-01-01T12:00:00Z',
      auteur_id: '6221987c-17b4-433d-a23a-836c82524217',
    },
  ],
};

const dataToDelete = {
  boeken: ['3fa85f64-5717-4562-b3fc-2c963f66afa6', '5e846780-937b-471d-96e3-d567b86a95bb'],
  // eslint-disable-next-line @stylistic/max-len
  auteurs: ['1ff66c9c-a567-4ca2-8e07-9199e550e64d','d2c114ad-9c09-4ecb-9d24-aeb4015bddb8','ba24ae71-c4e1-45fb-a7d3-13ef3d225af6','6221987c-17b4-433d-a23a-836c82524217','a4a746b4-5cc4-41b6-bc32-78f79c86b4f1'],
};
describe('boeken', () => {
  
  let server: Server;
  let request: supertest.Agent;
  
  beforeAll(async () => {
    server = await createServer(); 
    request = supertest(server.getApp().callback()); 
  });
  
  afterAll(async () => {
    await prisma.boek.deleteMany({
      where: { id: { in: dataToDelete.boeken } },
    });
    await prisma.auteur.deleteMany({
      where: { id: { in: dataToDelete.auteurs } },
    });
    await server.stop();
  });

  const url = '/api/boeken'; 

  describe('GET /api/boeken', () => {
    beforeAll(async () => {
      await prisma.auteur.createMany({ data: data.auteurs });
      await prisma.boek.createMany({ data: data.boeken });
    });
    it('should 200 and return all books', async () => {
      const response = await request.get(url); 
      expect(response.status).toBe(200); 
      expect(response.body.items.length).toBe(data.boeken.length);
      expect(response.body.items).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            ISBN: '9780141036137',
            titel: '1984',
            genre: 'Dystopian',
          }),
          expect.objectContaining({
            ISBN: '9780141439518',
            titel: 'Pride and Prejudice',
            genre: 'Romance',
          }),
        ]),
      );
    });
    afterAll(async () => {
      await prisma.boek.deleteMany();
      await prisma.auteur.deleteMany();
    });
  });

  describe('GET /api/boeken/:id', () => {
    beforeAll(async () => {
      await prisma.auteur.createMany({ data: data.auteurs });
      await prisma.boek.createMany({ data: data.boeken });
    });
    it('should 200 and return book with id 5e846780-937b-471d-96e3-d567b86a95bb', async () => {
      const response = await request.get(url+'/5e846780-937b-471d-96e3-d567b86a95bb'); 
      expect(response.status).toBe(200); 
      expect(response.body).toEqual(
        expect.objectContaining({
          ISBN: '9780141439518',
          titel: 'Pride and Prejudice',
          genre: 'Romance',
          publicatie_datum: '1903-06-25T00:00:00.000Z',
          taal: 'English',
          paginas: 279,
          vrije_kopieen: 2,
          totale_kopieen: 4,
          beschrijving: 'The novel follows the character development of Elizabeth Bennet.',
          cover_uri: 'https://example.com/cover/pride-and-prejudice.jpg',
        }), 
      );
    });
    afterAll(async () => {
      await prisma.boek.deleteMany();
      await prisma.auteur.deleteMany();
    });
  });

  describe('POST /api/boeken', () => {
  
    beforeAll(async () => {
      await prisma.auteur.createMany({ data: data.auteurs });
    });

    it('should be 201 and return the created book', async () => {
      const response = await request.post(url).send({
        ISBN: '9780141439518',
        titel: 'Pride and Prejudice',
        genre: 'Romantiek',
        publicatie_datum: new Date('1903-06-25T00:00:00.000Z'),
        taal: 'Engels',
        paginas: 279,
        vrije_kopieen: 2,
        totale_kopieen: 4,
        beschrijving: 'The novel follows the character development of Elizabeth Bennet.',
        cover_uri: 'https://example.com/cover/pride-and-prejudice.jpg',
        auteur: {
          voornaam: 'Gabriel',
          achternaam: 'Garcia Marquez',
          geboortedatum: new Date('1927-03-06T00:00:00.000Z'),
          nationaliteit: 'Colombian',
          biografie: 'Known for One Hundred Years of Solitude.',
        },
      });
      
      expect(response.status).toBe(200); 
      expect(response.body.id).toBeTruthy(); 
      expect(response.body.titel).toBe('Pride and Prejudice'); 
      expect(response.body.cover_uri).toBe('https://example.com/cover/pride-and-prejudice.jpg'); 
      expect(response.body.auteur).toEqual(expect.objectContaining({
        voornaam: 'Gabriel',
        achternaam: 'Garcia Marquez',
        geboortedatum:'1927-03-06T00:00:00.000Z',
        nationaliteit: 'Colombian',
        biografie: 'Known for One Hundred Years of Solitude.',
      }));
    });
  
    afterAll(async () => {
      await prisma.boek.deleteMany();
      await prisma.auteur.deleteMany();
    });
  });
  
});
