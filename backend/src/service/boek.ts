import { randomUUID } from 'crypto';
import { prisma } from '../data';
import {boeken} from './../data/mock_data.js';
import { Console } from 'console';

const BOEKEN_SELECT = {
  id: true,
  ISBN: true,
  titel: true,
  genre: true,
  publicatie_datum: true,
  taal: true,
  paginas:true,
  vrije_kopieen: true,
  totale_kopieen: true,
  beschrijving: true,
  cover_uri: true,
  aangemaakt: true,
  upgedate: true,
  auteur: {
    select: {
      id: true,
      voornaam: true,
      achternaam: true,
      geboortedatum: true,
      nationaliteit: true,
      biografie: true,
      aangemaakt: true,
      upgedate: true,
    },
  },
};

export const getAll = async () => {
  return prisma.boek.findMany({
    select: BOEKEN_SELECT,
  });
};

export const getById = async (id: string)  => {

  const boek = await prisma.boek.findUnique({
    where: {
      id,
    },
  });

  if (!boek) {
    throw new Error(`Boek met id:${id} bestaat niet.`);
  }

  return boek;

};

export const create = async ({ ISBN, titel, genre,publicatie_datum,taal,
  paginas,vrije_kopieën,totale_kopieën,beschrijving,
  cover_uri,aangemaakt,upgedate,auteur_id }: any) => {
  const opt_boek = await prisma.boek.findFirst({
    where: {
      OR:[
        { ISBN},
        {titel},
      ],
    },
  });

  if (opt_boek) {
    return new Error('boek met ISBN code of titel bestaat al!');
  }
  
  return prisma.boek.create({
    data: {
      id: randomUUID(),
      ISBN,
      titel,
      genre,
      publicatie_datum: new Date(publicatie_datum),
      taal,
      paginas,
      vrije_kopieen: vrije_kopieën,
      totale_kopieen: totale_kopieën,
      beschrijving,
      cover_uri,
      aangemaakt,
      upgedate,
      auteur_id,
    },
  });

};

export const updateById = (
  id: number,
  { amount, date, placeId, user }: any,
) => {
  throw new Error('Not implemented yet!');
};

export const deleteById = (id: string) => {
  const index = boeken.findIndex((item) => item.id === id);

  if (index !== -1) {
    boeken.splice(index, 1); 
    return id;
  } else {
    return new Error(`Boek met id:${id} bestaat niet.`);
  }
  
  ;
};
