import { randomUUID } from 'crypto';
import {prisma} from '../data';
import type {UUID} from 'crypto';
import ServiceError from '../core/serviceError';
import handleDBError from './_handleDBError';
import type { BoekKopie, BoekkopieCreateInput, BoekkopieUpdateInput } from '../types/boek_kopie';
import { Prisma } from '@prisma/client';

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
      actief:true,
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
  actief:true,
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

    const res = await prisma.$transaction(async (tx) => {
      const [gemaakteKopie] = await Promise.all([
        await tx.boekKopie.create({
          data: {
            id: randomUUID(),
            status: new_kopie.status,
            extra_informatie: new_kopie.extra_informatie,
            aangemaakt:new Date(),
            upgedate:new Date(),
            actief:true,
            boek_id: new_kopie.boek_id,
          },
          select:KOPIE_SELECT,
        }),
        await tx.boek.update({
          where:{
            id:new_kopie.boek_id,
          },
          data:{
            vrije_kopieen:{
              increment:1,
            },
            totale_kopieen:{
              increment:1,
            },
          },
        }),
      ]);
      return gemaakteKopie;
    }, {
      isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted,
    });
    return res;
    /*
    return await prisma.boekKopie.create({
      data: {
        id: randomUUID(),
        status: new_kopie.status,
        extra_informatie: new_kopie.extra_informatie,
        aangemaakt:new Date(),
        upgedate:new Date(),
        actief:true,
        boek_id: new_kopie.boek_id,
      },
      select:KOPIE_SELECT,
    });
    */
  }catch (error: any) {
    throw handleDBError(error);
  }

};

export const deleteById = async (id: UUID): Promise<void> => {
  const opt_kopie = await getById(id);
  if (opt_kopie) {

    await prisma.$transaction(async (tx) => {
      await Promise.all([
        await tx.boekKopie.update({
          where:{
            id,
          },
          data:{
            actief:false,
          },
        }),
        await tx.boek.update({
          where:{
            id:opt_kopie.boek.id,
          },
          data:{
            vrije_kopieen:{
              decrement:1,
            },
            totale_kopieen:{
              decrement:1,
            },
          },
        }),
      ]);
     
    }, {
      isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted,
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

    const res = await prisma.$transaction(async (tx) => {
      const updatedKopie = await Promise.all([
        await prisma.boekKopie.update({
          where: {
            id,
          },
          data: {
            status: new_kopie.status,
            extra_informatie: new_kopie.extra_informatie,
            upgedate:new Date(),
          },
          select: KOPIE_SELECT,
        })]);

      if(new_kopie.status === 'gereserveerd' || new_kopie.status === 'niet-beschikbaar'){
        await tx.boek.update({
          where:{
            id:opt_kopie.boek.id,
          },
          data:{
            vrije_kopieen:{
              decrement:1,
            },
          },
        });
      } else{
        await tx.boek.update({
          where:{
            id:opt_kopie.boek.id,
          },
          data:{
            vrije_kopieen:{
              increment:1,
            },
          },
        });
      }
      return updatedKopie;
    }, {
      isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted,
    });
    return res[0];
  }
  
};