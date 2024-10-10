// src/data/seed.ts
import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient(); 

async function main() {
  await prisma.auteur.createMany({
    data: [
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
  });
    
  await prisma.boek.createMany({
    data: [
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
  });

  await prisma.boekKopie.createMany({
    data: [
      {
        id: '7f2a1a83-81b0-4032-a7a6-05468723f34a',
        boek_id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        status: 'available',
        extra_informatie: 'Slight wear on the cover',
        aangemaakt: '2024-01-01T12:00:00Z',
        upgedate: '2024-01-01T12:00:00Z',
      },
      {
        id: '5ed8769d-745b-485b-82af-25b25e13fe5a',
        boek_id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        status: 'reserved',
        extra_informatie: 'Like new',
        aangemaakt: '2024-01-01T12:00:00Z',
        upgedate: '2024-01-01T12:00:00Z',
      },
      {
        id: 'bba4f05c-219a-4390-aec0-0b4474712ffb',
        boek_id: '5e846780-937b-471d-96e3-d567b86a95bb',
        status: 'available',
        extra_informatie: 'Light markings on pages',
        aangemaakt: '2024-01-01T12:00:00Z',
        upgedate: '2024-01-01T12:00:00Z',
      }],
  });

  await prisma.gebruiker.createMany({
    data: [
      {
        id: '8a128b24-411e-4312-8618-e0c0c72bcb41',
        voornaam: 'John',
        achternaam: 'Doe',
        geboortedatum: new Date('1903-06-25T00:00:00.000Z'),
        email: 'john.doe@example.com',
        rol: 'user',
        hashed_password: 'hashedpassword123',
        salt: 'randomsaltvalue',
      },
      {
        id: 'f1a98976-2d4b-4e88-8a96-fc5d12b04564',
        voornaam: 'Jane',
        achternaam: 'Smith',
        geboortedatum: new Date('1903-06-25T00:00:00.000Z'),
        email: 'jane.smith@example.com',
        rol: 'admin',
        hashed_password: 'hashedpassword456',
        salt: 'anotherrandomsaltvalue',
      }],
  });

  await prisma.reservatie.createMany({
    data: [
      {
        id: 'f3f74691-274c-40f6-9e8e-19d59371c8da',
        boek_kopie_id: '5ed8769d-745b-485b-82af-25b25e13fe5a',
        gebruiker_id: '8a128b24-411e-4312-8618-e0c0c72bcb41',
        startdatum: '2024-02-01T12:00:00Z',
        einddatum: '2024-02-15T12:00:00Z',
        status: 'active',
      },
      {
        id: 'b4a746b4-5cc4-41b6-bc32-78f79c86b4f1',
        boek_kopie_id: 'bba4f05c-219a-4390-aec0-0b4474712ffb',
        gebruiker_id: 'f1a98976-2d4b-4e88-8a96-fc5d12b04564',
        startdatum: '2024-02-10T12:00:00Z',
        einddatum: '2024-02-20T12:00:00Z',
        status: 'pending',
      }],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
