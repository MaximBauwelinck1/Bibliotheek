import { randomUUID } from 'crypto';
import { prisma } from '../data';
import {boeken} from './../data/mock_data.js';

export const getAll = async () => {
  return prisma.boek.findMany();
};

export const getById = (id: string)  => {
  const opt_boek = boeken.find((b) => b.id === id);
  if(opt_boek == null){
    return new Error(`Boek met id:${id} bestaat niet.`);
  } else{
    return opt_boek;
  }
};

export const create = ({ ISBN, titel, genre,publicatie_datum,taal,paginas,vrije_kopieën,totale_kopieën,beschrijving,
  cover_uri,aangemaakt,upgedate,auteur_id }: any) => {
  if(boeken.find((b) => b.ISBN === ISBN || b.titel === titel)){
    return new Error('boek met ISBN code of titel bestaat al!');
  }
  const nieuwBoek = {
    id: randomUUID(),
    ISBN,
    titel,
    genre,
    publicatie_datum,
    taal,
    paginas,
    vrije_kopieën,
    totale_kopieën,
    beschrijving,
    cover_uri,
    aangemaakt,
    upgedate,
    auteur_id,
  };
  boeken.push(nieuwBoek); 
  return nieuwBoek.id; 
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
