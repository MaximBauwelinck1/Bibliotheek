import type { UUID } from 'crypto';
import { randomUUID } from 'crypto';
import { prisma } from '../data';
import {boeken} from './../data/mock_data.js';
import { getLogger } from 'bibliotheek_app/src/core/logging';

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

export const getById = async (id: UUID)  => {

  const boek = await prisma.boek.findUnique({
    select: BOEKEN_SELECT,
    where: {
      id,
    },
  });

  if (!boek) {
    throw new Error(`Boek met id:${id} bestaat niet.`);
  }

  return boek;

};

const createAuteurIndienNietBestaat = async (
  voornaam, achternaam, geboortedatum,nationaliteit, biografie,
) =>{
  let auteur = await prisma.auteur.findFirst({
    where: {
      voornaam,
      achternaam,
    },
  });

  if (!auteur) {
    return auteur = await prisma.auteur.create({
      data: {
        id: randomUUID(),
        voornaam,
        achternaam,
        geboortedatum,
        nationaliteit,
        biografie,
        aangemaakt: new Date(),
        upgedate: new Date(),
      },
    });
  } else{
    return auteur;
  }
};

const deleteAuteurIndienNietGebruikt = async(auteurId : string) =>{
  const boeken = await prisma.boek.findMany({
    where: {
      auteur_id: auteurId,
    },
  });
  if(boeken.length == 0){
    await prisma.auteur.delete({
      where:{
        id: auteurId,
      },
    });
  }
};

export const create = async ({ ISBN, titel, genre,publicatie_datum,taal,
  paginas,vrije_kopieën,totale_kopieën,beschrijving,
  cover_uri,auteur }: any) => {
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

  const auteurId = (await createAuteurIndienNietBestaat(
    auteur.voornaam,auteur.achternaam,auteur.geboortedatum,auteur.nationaliteit,auteur.biografie)).id;
  
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
      aangemaakt:new Date(),
      upgedate:new Date(),
      auteur_id: auteurId,
    },
    select:BOEKEN_SELECT,
  });

};

export const deleteById = async (id: UUID) => {
  
  const opt_boek = await getById(id);

  if (opt_boek) {
    await prisma.boek.delete({
      where:{
        id,
      },
    });
    getLogger().info(opt_boek.auteur.id);
    deleteAuteurIndienNietGebruikt(opt_boek.auteur.id);
    return opt_boek.id;
  } else {
    return new Error(`Boek met id:${id} bestaat niet.`);
  }
  
  ;
};

export const updateById = async (id: UUID, { ISBN, titel, genre,publicatie_datum,taal,
  paginas,vrije_kopieën,totale_kopieën,beschrijving,
  cover_uri,auteur }: any) => {
  const opt_boek = await getById(id);
  if(opt_boek instanceof Error){
    return opt_boek;
  } else{
    const auteurId = (await createAuteurIndienNietBestaat(
      auteur.voornaam,auteur.achternaam,auteur.geboortedatum,auteur.nationaliteit,auteur.biografie)).id;
        
    const upgedate_boek = await prisma.boek.update({
      where: {
        id,
      },
      data: {
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
        upgedate:new Date(),
        auteur_id: auteurId,
      },
      select: BOEKEN_SELECT,
    });
    deleteAuteurIndienNietGebruikt(opt_boek.auteur.id);
    return upgedate_boek;
  }
  
};
