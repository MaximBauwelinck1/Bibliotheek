import { randomUUID } from 'crypto';
import {prisma} from '../data';
import type {UUID} from 'crypto';
import ServiceError from '../core/serviceError';
import handleDBError from './_handleDBError';
import type { BoekKopie, BoekkopieCreateInput, BoekkopieUpdateInput } from '../types/boek_kopie';

const KOPIE_SELECT = {
  id: true,
  boek: {
    select: { 
      id: true,
      ISBN: true,
      titel: true,
      genre: true,
      publicatie_datum: true,
      taal: true,
      paginas: true,
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
    },
  },
  status: true,
  extra_informatie: true,
  aangemaakt: true,
  upgedate: true,
};

export const getAll = async (): Promise<BoekKopie[]> => {
  return await prisma.boekKopie.findMany({
    select:KOPIE_SELECT,
  });
};

export const getById = async (id: UUID): Promise<BoekKopie>  => {

  const kopie = await prisma.boekKopie.findUnique({
    select:KOPIE_SELECT,
    where: {
      id,
    },
  });

  if (!kopie) {
    throw ServiceError.notFound(`Kopie met id:${id} bestaat niet.`);
  }

  return kopie;

};

export const create = async (new_kopie: BoekkopieCreateInput): Promise<BoekKopie> => {

  try {
    return await prisma.boekKopie.create({
      data: {
        id: randomUUID(),
        status: new_kopie.status,
        extra_informatie: new_kopie.extra_informatie,
        aangemaakt:new Date(),
        upgedate:new Date(),
        boek_id: new_kopie.boek_id,
      },
      select:KOPIE_SELECT,
    });
  }catch (error: any) {
    throw handleDBError(error);
  }

};

export const deleteById = async (id: UUID): Promise<void> => {
  const opt_kopie = await getById(id);
  if (opt_kopie) {
    await prisma.boekKopie.delete({
      where:{
        id,
      },
    });
  } else {
    throw ServiceError.conflict(`Kopie met id:${id} bestaat niet.`);
  }

};

export const updateById = async (id: UUID, new_kopie: BoekkopieUpdateInput): Promise<BoekKopie> => {
  const opt_kopie = await getById(id);
  if(opt_kopie instanceof Error){
    return opt_kopie;
  } else{
    const upgedate_kopie = await prisma.boekKopie.update({
      where: {
        id,
      },
      data: {
        status: new_kopie.status,
        extra_informatie: new_kopie.extra_informatie,
        upgedate:new Date(),
      },
      select: KOPIE_SELECT,
    });
    return upgedate_kopie;
  }
  
};