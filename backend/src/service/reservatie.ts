import type { UUID } from 'crypto';
import { randomUUID } from 'crypto';
import { prisma } from '../data';
import ServiceError from '../core/serviceError'; 
import handleDBError from './_handleDBError';
import type { Reservatie, ReservatieCreateInput, ReservatieUpdateInput } from '../types/reservatie';
import { Prisma } from '@prisma/client';

const RESERVATIES_SELECT = {
  id: true,
  boek_kopie: {
    select: {
      id: true,
      status: true,
      extra_informatie: true,
      aangemaakt: true,
      upgedate: true,
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
    },
  },
  gebruiker: {
    select: {
      id: true,
      voornaam: true,
      achternaam: true,
      geboortedatum: true,
      email: true,
      rol: true,
      hashed_password: true,
      salt: true,
      aangemaakt: true,
      upgedate: true,
    },
  },
  startdatum: true,
  einddatum: true,
  status: true,
  aangemaakt: true,
  upgedate: true,
};

export const getAll = async (): Promise<Reservatie[]> => {
 
  return prisma.reservatie.findMany({
    select: RESERVATIES_SELECT,    
  });
  
};

export const getById = async (id: UUID): Promise<Reservatie>  => {
  const reservatie = await prisma.reservatie.findUnique({
    select: RESERVATIES_SELECT,
    where: {
      id,
    },
  });

  if (!reservatie) {
    throw ServiceError.notFound(`Reservatie met id:${id} bestaat niet.`);
  }
  return reservatie;
};

export const create = async (new_reservatie: ReservatieCreateInput): Promise<Reservatie> => {
  const opt_boekkopie = await prisma.boekKopie.findFirst({
    where: {
      id: new_reservatie.boek_kopie_id,
    }, 
  });

  const opt_gebruiker = await prisma.gebruiker.findFirst({
    where: {
      id: new_reservatie.gebruiker_id,
    }, 
  });

  if(opt_boekkopie == null || opt_gebruiker == null){
    throw ServiceError.notFound('Gebruiker of Boek kopie bestaat niet!');
  }
  const opt_boek = await prisma.boek.findFirst({
    where: {
      id: opt_boekkopie?.boek_id,
    }, 
  });
  if (opt_boekkopie && opt_boek) {
    if(opt_boekkopie.status != 'beschikbaar' || opt_boek.vrije_kopieen==0){
      throw ServiceError.conflict('Boek Kopie is niet beschikbaar!');
    }
  }

  try { //TODO dit zou een transactie moeten zijn!
    const reservatie = await prisma.$transaction(
      [
        prisma.reservatie.create({
          data: {
            id: randomUUID(),
            boek_kopie_id: new_reservatie.boek_kopie_id,
            gebruiker_id: new_reservatie.gebruiker_id,
            startdatum:new Date(),
            einddatum: new_reservatie.einddatum,
            status:  new_reservatie.status,
          },
          select:RESERVATIES_SELECT,
        }),
        prisma.boekKopie.update({ 
          where:{id: new_reservatie.boek_kopie_id},
          data :{
            status: 'gereserveerd',
          },
        }),
        prisma.boek.update({ 
          where:{id: new_reservatie.boek_kopie_id},
          data :{
            vrije_kopieen: {
              decrement: 1,
            },
          },
        }),
      ],
      {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
      },
    );
    return reservatie[0];
  }catch (error: any) {
    throw handleDBError(error);
  }

};

export const deleteById = async (id: UUID): Promise<void> => {
  const opt_reservatie = await getById(id);
  if (opt_reservatie) {
    await prisma.reservatie.delete({
      where:{
        id,
      },
    });
  } else {
    throw ServiceError.conflict(`Reservatie met id:${id} bestaat niet.`);
  }

};

export const updateById = async (id: UUID, new_reservatie: ReservatieUpdateInput): Promise<Reservatie> => {
  const opt_reservatie = await getById(id);
  if(opt_reservatie instanceof Error){
    return opt_reservatie;
  } else{
    if(new_reservatie.status == 'actief'){
      const updated_reservatie = await prisma.$transaction(
        [
          prisma.reservatie.update({
            where: {
              id,
            },
            data: {
              boek_kopie_id: new_reservatie.boek_kopie_id,
              gebruiker_id: new_reservatie.gebruiker_id,
              einddatum: new_reservatie.einddatum,
              status:  new_reservatie.status,
            },
            select: RESERVATIES_SELECT,
          }),
          prisma.boekKopie.update({ 
            where:{id: new_reservatie.boek_kopie_id},
            data :{
              status: 'gereserveerd',
            },
          }),
          prisma.boek.update({ 
            where:{id: new_reservatie.boek_kopie_id},
            data :{
              vrije_kopieen: {
                decrement: 1,
              },
            },
          }),
        ],
        {
          isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
        },
      );
      return updated_reservatie[0];
    } else if( new_reservatie.status == 'niet-actief'){
      const updated_reservatie = await prisma.$transaction(
        [
          prisma.reservatie.update({
            where: {
              id,
            },
            data: {
              boek_kopie_id: new_reservatie.boek_kopie_id,
              gebruiker_id: new_reservatie.gebruiker_id,
              einddatum: new_reservatie.einddatum,
              status:  new_reservatie.status,
            },
            select: RESERVATIES_SELECT,
          }),
          prisma.boekKopie.update({ 
            where:{id: new_reservatie.boek_kopie_id},
            data :{
              status: 'beschikbaar',
            },
          }),
          prisma.boek.update({ 
            where:{id: new_reservatie.boek_kopie_id},
            data :{
              vrije_kopieen: {
                increment: 1,
              },
            },
          }),
        ],
        {
          isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
        },
      );
      return updated_reservatie[0];
    } else{
      throw ServiceError.validationFailed('Reservatie mag enkel status actief of niet-actief hebben.');
    }
    
  }
};
