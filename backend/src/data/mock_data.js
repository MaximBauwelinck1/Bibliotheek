
export const auteurs = [
    {
      id: '1c6f4b8d-233b-4b72-900e-7d474b8768fe',
      voornaam: 'George',
      achternaam: 'Orwell',
      geboortedatum: '1903-06-25',
      nationaliteit: 'British',
      biografie: 'George Orwell was an English novelist, essayist, journalist, and critic.',
      aangemaakt: '2024-01-01T12:00:00Z',
      upgedate: '2024-01-01T12:00:00Z'
    },
    {
      id: '2d4a51d4-334a-4b8d-8a8f-6d5a7d3278af',
      voornaam: 'Jane',
      achternaam: 'Austen',
      geboortedatum: '1775-12-16',
      nationaliteit: 'British',
      biografie: 'Jane Austen was an English novelist known primarily for her six major novels.',
      aangemaakt: '2024-01-01T12:00:00Z',
      upgedate: '2024-01-01T12:00:00Z'
    }
  ];
  
 export const boeken = [
    {
      id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      ISBN: '9780141036137',
      titel: '1984',
      genre: 'Dystopian',
      publicatie_datum: '1949-06-08',
      taal: 'English',
      paginas: 328,
      vrije_kopieën: 3,
      totale_kopieën: 5,
      beschrijving: 'A novel that portrays a terrifying vision of a controlled and monitored society.',
      cover_uri: 'https://example.com/cover/1984.jpg',
      aangemaakt: '2024-01-01T12:00:00Z',
      upgedate: '2024-01-01T12:00:00Z',
      auteur_id: '1c6f4b8d-233b-4b72-900e-7d474b8768fe'
    },
    {
      id: '5e846780-937b-471d-96e3-d567b86a95bb',
      ISBN: '9780141439518',
      titel: 'Pride and Prejudice',
      genre: 'Romance',
      publicatie_datum: '1813-01-28',
      taal: 'English',
      paginas: 279,
      vrije_kopieën: 2,
      totale_kopieën: 4,
      beschrijving: 'The novel follows the character development of Elizabeth Bennet.',
      cover_uri: 'https://example.com/cover/pride-and-prejudice.jpg',
      aangemaakt: '2024-01-01T12:00:00Z',
      upgedate: '2024-01-01T12:00:00Z',
      auteur_id: '2d4a51d4-334a-4b8d-8a8f-6d5a7d3278af'
    }
  ];
  

  export const boek_kopie = [
    {
      id: '7f2a1a83-81b0-4032-a7a6-05468723f34a',
      boek_id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      status: 'available',
      extra_informatie: 'Slight wear on the cover',
      aangemaakt: '2024-01-01T12:00:00Z',
      upgedate: '2024-01-01T12:00:00Z'
    },
    {
      id: '5ed8769d-745b-485b-82af-25b25e13fe5a',
      boek_id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      status: 'reserved',
      extra_informatie: 'Like new',
      aangemaakt: '2024-01-01T12:00:00Z',
      upgedate: '2024-01-01T12:00:00Z'
    },
    {
      id: 'bba4f05c-219a-4390-aec0-0b4474712ffb',
      boek_id: '5e846780-937b-471d-96e3-d567b86a95bb',
      status: 'available',
      extra_informatie: 'Light markings on pages',
      aangemaakt: '2024-01-01T12:00:00Z',
      upgedate: '2024-01-01T12:00:00Z'
    }
  ];
  
  export const gebruikers = [
    {
      id: '8a128b24-411e-4312-8618-e0c0c72bcb41',
      voornaam: 'John',
      achternaam: 'Doe',
      geboortedatum: '1990-04-15',
      email: 'john.doe@example.com',
      rol: 'user',
      hashed_password: 'hashedpassword123',
      salt: 'randomsaltvalue',
    },
    {
      id: 'f1a98976-2d4b-4e88-8a96-fc5d12b04564',
      voornaam: 'Jane',
      achternaam: 'Smith',
      geboortedatum: '1985-11-22',
      email: 'jane.smith@example.com',
      rol: 'admin',
      hashed_password: 'hashedpassword456',
      salt: 'anotherrandomsaltvalue',
    }
  ];
  
  
 export const reserveraties = [
    {
      id: 'f3f74691-274c-40f6-9e8e-19d59371c8da',
      boek_kopie_id: '5ed8769d-745b-485b-82af-25b25e13fe5a',
      gebruiker_id: '8a128b24-411e-4312-8618-e0c0c72bcb41',
      startdatum: '2024-02-01T12:00:00Z',
      einddatum: '2024-02-15T12:00:00Z',
      status: 'active'
    },
    {
      id: 'b4a746b4-5cc4-41b6-bc32-78f79c86b4f1',
      boek_kopie_id: 'bba4f05c-219a-4390-aec0-0b4474712ffb',
      gebruiker_id: 'f1a98976-2d4b-4e88-8a96-fc5d12b04564',
      startdatum: '2024-02-10T12:00:00Z',
      einddatum: '2024-02-20T12:00:00Z',
      status: 'pending'
    }
  ];
  
  