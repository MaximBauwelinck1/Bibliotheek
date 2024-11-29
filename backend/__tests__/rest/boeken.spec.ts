import type supertest from 'supertest'; 
import { prisma } from '../../src/data';
import withServer from '../helpers/withServer';
import { login } from '../helpers/login'; 
import { loginAdmin } from '../helpers/loginAdmin';
import testAuthHeader from '../helpers/testAuthHeader';
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
      actief:true,
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
      actief:true,
    },
  ],
  kopieen:[
    {
      id:'5e846780-937b-471d-96e3-d567b86a95ba',
      boek_id:'5e846780-937b-471d-96e3-d567b86a95bb',
      status:'beschikbaar',
      extra_informatie: '',
      actief: true,
      aangemaakt: new Date(),
      upgedate: new Date(),
    },
    {
      id:'3e846780-937b-471d-96e3-d567b86a95ba',
      boek_id:'5e846780-937b-471d-96e3-d567b86a95bb',
      status:'beschikbaar',
      extra_informatie: '',
      actief: true,
      aangemaakt: new Date(),
      upgedate: new Date(),
    },
  ],
};

describe('boeken', () => {
  
  let request: supertest.Agent;
  let authHeader: string;
  let adminAuthHeader: string;
  withServer((r) => (request = r));

  beforeAll(async () => {
    authHeader = await login(request);
    adminAuthHeader = await loginAdmin(request);
  });

  const url = '/api/boeken'; 

  describe('GET /api/boeken', () => {
    beforeAll(async () => {
      await prisma.auteur.createMany({ data: data.auteurs });
      await prisma.boek.createMany({ data: data.boeken });
    });
    it('should 200 and return all books', async () => {
      const response = await request.get(url).set('Authorization', authHeader); 
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
    it('should be 400 when sending an request with an body', async () => {
      const response = await request.get(url).set('Authorization', authHeader).send({
        test: 'test',
      });
      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
    });
    it('should be 400 when sending an request with an query parameter', async () => {
      const response = await request.get(url+'?test=test').set('Authorization', authHeader);
      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
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
    it('should be 200 and return book with id 5e846780-937b-471d-96e3-d567b86a95bb', async () => {
      const response = await request.get(url+'/5e846780-937b-471d-96e3-d567b86a95bb').set('Authorization', authHeader); 
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

    it('should be 404 when requesting an not existing book', async () => {
      const response = await request.get(`${url}/5e846780-937b-471d-96e3-d567b86a95ba`)
        .set('Authorization', authHeader);
      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        code: 'NOT_FOUND',
        message: 'Boek met id:5e846780-937b-471d-96e3-d567b86a95ba bestaat niet.',
      });
    });

    it('should be 400 with an invalid UUID as id', async () => {
      const response = await request.get(`${url}/invalid`).set('Authorization', authHeader);
      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.params).toHaveProperty('id');
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
    testAuthHeader(() => request.post(url));
    it('should be 201 and return the created book', async () => { //met isbn 13 code
      const response = await request.post(url).set('Authorization', adminAuthHeader).send({
        ISBN: '9780141439518',
        titel: 'Pride and Prejudice',
        genre: 'Romantiek',
        publicatie_datum: new Date('1903-06-25T00:00:00.000Z'),
        taal: 'Engels',
        paginas: 279,
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
      
      expect(response.status).toBe(201); 
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
    // testAuthHeader(() => request.get(url));
    it('should be 201 and return the created book', async () => { // met isbn 10 code
      const response = await request.post(url).set('Authorization', adminAuthHeader).send({
        ISBN: '0306406152',
        titel: 'ISBN10',
        genre: 'Romantiek',
        publicatie_datum: new Date('1903-06-25T00:00:00.000Z'),
        taal: 'Engels',
        paginas: 279,
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
      expect(response.status).toBe(201); 
      expect(response.body.id).toBeTruthy(); 
      expect(response.body.titel).toBe('ISBN10'); 
      expect(response.body.cover_uri).toBe('https://example.com/cover/pride-and-prejudice.jpg'); 
      expect(response.body.auteur).toEqual(expect.objectContaining({
        voornaam: 'Gabriel',
        achternaam: 'Garcia Marquez',
        geboortedatum:'1927-03-06T00:00:00.000Z',
        nationaliteit: 'Colombian',
        biografie: 'Known for One Hundred Years of Solitude.',
      }));
    });
    it('should be 400 when sending an negative amount as pages', async () => {
      const response = await request.post(url).set('Authorization', adminAuthHeader).send({
        ISBN: '9780141439518',
        titel: 'Pride and Prejudice',
        genre: 'Romantiek',
        publicatie_datum: new Date('1903-06-25T00:00:00.000Z'),
        taal: 'Engels',
        paginas: -1000,
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
      expect(response.status).toBe(400); 
      expect(response.body.code).toBe('VALIDATION_FAILED');
    });
    it('should be 400 when sending an wrong ISBN', async () => {
      const response = await request.post(url).set('Authorization', adminAuthHeader).send({
        ISBN: '20',
        titel: 'Pride and Prejudice',
        genre: 'Romantiek',
        publicatie_datum: new Date('1903-06-25T00:00:00.000Z'),
        taal: 'Engels',
        paginas: 50,
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
      
      expect(response.status).toBe(400); 
      expect(response.body.code).toBe('VALIDATION_FAILED');
    });
    it('should be 400 when not sending the language', async () => {
      const response = await request.post(url).set('Authorization', adminAuthHeader).send({
        ISBN: '9780141439518',
        titel: 'Pride and Prejudice',
        genre: 'Romantiek',
        publicatie_datum: new Date('1903-06-25T00:00:00.000Z'),
        paginas: 50,
      
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
      expect(response.status).toBe(400); 
      expect(response.body.code).toBe('VALIDATION_FAILED');
    });
    it('should be 409 when creating a book with existing ISBN and titel', async () => {
      const response = await request.post(url).set('Authorization', adminAuthHeader).send({
        ISBN: '9780141439518',
        titel: 'Pride and Prejudice',
        genre: 'Romantiek',
        publicatie_datum: new Date('1903-06-25T00:00:00.000Z'),
        taal: 'Engels',
        paginas: 279,
      
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
      
      expect(response.status).toBe(409); 
      expect(response.body).toMatchObject({
        code: 'CONFLICT',
        message: 'boek met ISBN code of titel bestaat al!',
      });
    });
    afterAll(async () => {
      await prisma.boekKopie.deleteMany();
      await prisma.boek.deleteMany();
      await prisma.auteur.deleteMany();
    });
  });
  describe('DEL /api/boeken/:id', () => {
  
    beforeAll(async () => {
      await prisma.auteur.createMany({ data: data.auteurs });
      await prisma.boek.createMany({ data: data.boeken });
    });
    testAuthHeader(() => request.post(url));
    it('should be 204 and deleted the book', async () => {
      const response = await request.del(url+'/3fa85f64-5717-4562-b3fc-2c963f66afa6')
        .set('Authorization', adminAuthHeader);
      expect(response.status).toBe(204); 
      expect(response.body).toEqual({});
    });
    it('should be 209 when passing an non existant book', async () => {
      const response = await request.del(url+'/3fa85f64-5717-4562-b3fc-2c963f66afa5')
        .set('Authorization', adminAuthHeader);
      expect(response.status).toBe(404); 
      expect(response.body).toMatchObject({
        code: 'NOT_FOUND',
        message: 'Boek met id:3fa85f64-5717-4562-b3fc-2c963f66afa5 bestaat niet.',
      });
    });
  
    afterAll(async () => {
      await prisma.boek.deleteMany();
      await prisma.auteur.deleteMany();
    });
  });
  describe('PUT /api/boeken/:id', () => {
  
    beforeAll(async () => {
      await prisma.auteur.createMany({ data: data.auteurs });
      await prisma.boek.createMany({ data: data.boeken });
    });
    testAuthHeader(() => request.post(url));
    it('should be 200 and return the updated book', async () => { // met isbn 13
      const response = await request.put(url+'/3fa85f64-5717-4562-b3fc-2c963f66afa6')
        .set('Authorization', adminAuthHeader).send({
          ISBN: '9783127323207',
          titel: 'test',
          genre: 'Romantiek',
          publicatie_datum: new Date('1903-06-25T00:00:00.000Z'),
          taal: 'Engels',
          paginas: 279,
         
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
      expect(response.body.titel).toBe('1984'); //titel kan niet geupdate worden
      expect(response.body.cover_uri).toBe('https://example.com/cover/pride-and-prejudice.jpg'); 
      expect(response.body.ISBN).toBe('9780141036137');
      expect(response.body.auteur).toEqual(expect.objectContaining({
        voornaam: 'Gabriel',
        achternaam: 'Garcia Marquez',
        geboortedatum:'1927-03-06T00:00:00.000Z',
        nationaliteit: 'Colombian',
        biografie: 'Known for One Hundred Years of Solitude.',
      }));
    });
    it('should be 200 and return the updated book', async () => { // met isbn 10 
      const response = await request.put(url+'/5e846780-937b-471d-96e3-d567b86a95bb')
        .set('Authorization', adminAuthHeader).send({
          ISBN: '0306406152',
          titel: 'ISBN10',
          genre: 'Romantiek',
          publicatie_datum: new Date('1903-06-25T00:00:00.000Z'),
          taal: 'Engels',
          paginas: 279,
         
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
      expect(response.body.ISBN).toBe('9780141439518');
      expect(response.body.auteur).toEqual(expect.objectContaining({
        voornaam: 'Gabriel',
        achternaam: 'Garcia Marquez',
        geboortedatum:'1927-03-06T00:00:00.000Z',
        nationaliteit: 'Colombian',
        biografie: 'Known for One Hundred Years of Solitude.',
      }));
    });
    it('should be 400 when sending an wrong ISBN', async () => {
      const response = await request.put(url+'/5e846780-937b-471d-96e3-d567b86a95bb')
        .set('Authorization', adminAuthHeader).send({
          ISBN: '20',
          titel: 'tttttttt',
          genre: 'Romantiek',
          publicatie_datum: new Date('1903-06-25T00:00:00.000Z'),
          taal: 'Engels',
          paginas: 50,
         
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
      
      expect(response.status).toBe(400); 
      expect(response.body.code).toBe('VALIDATION_FAILED');
    });
    it('should be 404 when updating an non existant book', async () => {
      const response = await request.put(url+'/3fa85f64-5717-4562-b3fc-2c963f66afa5')
        .set('Authorization', adminAuthHeader).send({
          ISBN: '9783127323207',
          titel: 'test',
          genre: 'Romantiek',
          publicatie_datum: new Date('1903-06-25T00:00:00.000Z'),
          taal: 'Engels',
          paginas: 279,
         
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
      
      expect(response.status).toBe(404); 
      expect(response.body).toMatchObject({
        code: 'NOT_FOUND',
        message: 'Boek met id:3fa85f64-5717-4562-b3fc-2c963f66afa5 bestaat niet.',
      });
    });
    it('should be 400 when updating with an negative pages amount', async () => {
      const response = await request.put(url+'/3fa85f64-5717-4562-b3fc-2c963f66afa6')
        .set('Authorization', adminAuthHeader).send({
          titel: 'test',
          genre: 'Romantiek',
          publicatie_datum: new Date('1903-06-25T00:00:00.000Z'),
          taal: 'Engels',
          paginas: -5,
         
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
      
      expect(response.status).toBe(400); 
      expect(response.body.code).toBe('VALIDATION_FAILED');
    });
    it('should be 400 when passing not a valid UUID', async () => {
      const response = await request.put(url+'/fff').set('Authorization', adminAuthHeader).send({
        titel: 'test',
        genre: 'Romantiek',
        publicatie_datum: new Date('1903-06-25T00:00:00.000Z'),
        taal: 'Engels',
        paginas: 5,
       
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
      
      expect(response.status).toBe(400); 
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.params).toHaveProperty('id');
    });
    afterAll(async () => {
      await prisma.boek.deleteMany();
      await prisma.auteur.deleteMany();
    });
  });
  describe('GET /api/boeken/kopieen',()=>{
    
    beforeAll(async () => {
      await prisma.auteur.createMany({ data: data.auteurs });
      await prisma.boek.createMany({ data: data.boeken });
      await prisma.boekKopie.createMany({data: data.kopieen});
    });
    testAuthHeader(() => request.get(url+'/kopieen'));
    it('should 200 and return all book copies', async () => {
      const response = await request.get(url+'/kopieen').set('Authorization', authHeader);
    
      expect(response.status).toBe(200); 
      expect(response.body.items.length).toBe(2); 
      expect(response.body.items).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: '5e846780-937b-471d-96e3-d567b86a95ba',
            status: 'beschikbaar',
            extra_informatie: '',
            actief: true,
            
          }),
          expect.objectContaining({
            id: '3e846780-937b-471d-96e3-d567b86a95ba',
            status: 'beschikbaar',
            extra_informatie: '',
            actief: true,
          }),
        ]),
      );  
    });
    it('should be 400 when sending an request with an body', async () => {
      const response = await request.get(url+'/kopieen').set('Authorization', authHeader).send({
        test: 'test',
      });
      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
    });
    it('should be 400 when sending an request with an query parameter', async () => {
      const response = await request.get(url+'/kopieen?test=test').set('Authorization', authHeader);
      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
    });
    afterAll(async () => {
      await prisma.boekKopie.deleteMany();
      await prisma.boek.deleteMany();
      await prisma.auteur.deleteMany();
    });
  });
  describe('GET /api/boeken/:id/kopieen',()=>{
    
    beforeAll(async () => {
      await prisma.auteur.createMany({ data: data.auteurs });
      await prisma.boek.createMany({ data: data.boeken });
      await prisma.boekKopie.createMany({data: data.kopieen});
    });
    testAuthHeader(() => request.get(url+'/5e846780-937b-471d-96e3-d567b86a95bb/kopieen'));
    it('should 200 and return all book copies from 1 book', async () => {
      const response = await request.get(url+'/5e846780-937b-471d-96e3-d567b86a95bb/kopieen')
        .set('Authorization', authHeader);
    
      expect(response.status).toBe(200); 
      expect(response.body.items.length).toBe(2); 
      expect(response.body.items).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: '5e846780-937b-471d-96e3-d567b86a95ba',
            status: 'beschikbaar',
            extra_informatie: '',
            actief: true,
            
          }),
          expect.objectContaining({
            id: '3e846780-937b-471d-96e3-d567b86a95ba',
            status: 'beschikbaar',
            extra_informatie: '',
            actief: true,
          }),
        ]),
      );  
    });
    it('should be 400 when sending an request with an body', async () => {
      const response = await request.get(url+'/5e846780-937b-471d-96e3-d567b86a95bb/kopieen')
        .set('Authorization', authHeader).send({
          test: 'test',
        });
      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
    });
    it('should be 400 when sending an request with an query parameter', async () => {
      const response = await request.get(url+'/5e846780-937b-471d-96e3-d567b86a95bb/kopieen?test=test')
        .set('Authorization', authHeader);
      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
    });
    afterAll(async () => {
      await prisma.boekKopie.deleteMany();
      await prisma.boek.deleteMany();
      await prisma.auteur.deleteMany();
    });
  });
  describe('GET /api/boeken/:boekId/kopieen/:id',()=>{
    
    beforeAll(async () => {
      await prisma.auteur.createMany({ data: data.auteurs });
      await prisma.boek.createMany({ data: data.boeken });
      await prisma.boekKopie.createMany({data: data.kopieen});
    });
    testAuthHeader(() => request
      .get(url+'/5e846780-937b-471d-96e3-d567b86a95bb/kopieen/5e846780-937b-471d-96e3-d567b86a95ba'));
    it('should 200 and return 1 copy', async () => {
      const response = await request
        .get(url+'/5e846780-937b-471d-96e3-d567b86a95bb/kopieen/5e846780-937b-471d-96e3-d567b86a95ba')
        .set('Authorization', authHeader);
    
      expect(response.status).toBe(200); 
      expect(response.body).toEqual(   
        expect.objectContaining({
          id: '5e846780-937b-471d-96e3-d567b86a95ba',
          status: 'beschikbaar',
          extra_informatie: '',
          actief: true,
            
        }),
      );  
    });
    it('should be 400 when sending an request with an body', async () => {
      const response = await request
        .get(url+'/5e846780-937b-471d-96e3-d567b86a95bb/kopieen/5e846780-937b-471d-96e3-d567b86a95ba')
        .set('Authorization', authHeader).send({
          test: 'test',
        });
      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
    });
    it('should be 400 when sending an request with an query parameter', async () => {
      const response = await request
        .get(url+'/5e846780-937b-471d-96e3-d567b86a95bb/kopieen/5e846780-937b-471d-96e3-d567b86a95ba?test=test')
        .set('Authorization', authHeader);
      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
    });
    afterAll(async () => {
      await prisma.boekKopie.deleteMany();
      await prisma.boek.deleteMany();
      await prisma.auteur.deleteMany();
    });
  });
  describe('DEL /api/boeken/:id/deletebeschikbaarkopie',()=>{
    
    beforeAll(async () => {
      await prisma.auteur.createMany({ data: data.auteurs });
      await prisma.boek.createMany({ data: data.boeken });
      await prisma.boekKopie.createMany({data: data.kopieen});
    });
    testAuthHeader(() => request.del(url+'/5e846780-937b-471d-96e3-d567b86a95bb/deletebeschikbaarkopie'));
    it('should 200 and deleted a copy', async () => {
      const response = await request
        .del(url+'/5e846780-937b-471d-96e3-d567b86a95bb/deletebeschikbaarkopie')
        .set('Authorization', adminAuthHeader);
    
      expect(response.status).toBe(204); 
      expect(response.body).toEqual({});
    });
    it('should be 400 when sending an request with an body', async () => {
      const response = await request
        .del(url+'/5e846780-937b-471d-96e3-d567b86a95bb/deletebeschikbaarkopie')
        .set('Authorization', adminAuthHeader).send({
          test: 'test',
        });
      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
    });
    it('should be 400 when sending an request with an query parameter', async () => {
      const response = await request
        .del(url+'/5e846780-937b-471d-96e3-d567b86a95bb/deletebeschikbaarkopie?test=test')
        .set('Authorization', adminAuthHeader);
      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
    });
    it('should be 409 when deleting an copy of an non existant book', async () => {
      const response = await request.del(url+'/1e846780-937b-471d-96e3-d567b86a95bb/deletebeschikbaarkopie')
        .set('Authorization', adminAuthHeader);
      expect(response.status).toBe(409); 
      expect(response.body).toMatchObject({
        code: 'CONFLICT',
        message: 'Er zijn geen beschikbare exemplaren meer om te verwijderen.',
      });
    });
    afterAll(async () => {
      await prisma.boekKopie.deleteMany();
      await prisma.boek.deleteMany();
      await prisma.auteur.deleteMany();
    });
  });
});
