import type { UUID } from 'crypto';
import { randomUUID } from 'crypto';
import { prisma } from '../data';
import ServiceError from '../core/serviceError'; 
import handleDBError from './_handleDBError';
import type { Boek, BoekCreateInput, BoekUpdateInput } from '../types/boek';
import type { Auteur, AuteurCreateInput } from '../types/auteur';
import type { BoekKopie } from '../types/boek_kopie';
import { Prisma } from '@prisma/client';

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
  actief:true,
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
const BOEK_KOPIE_SELECT = {
  id: true,
  status: true,
  extra_informatie: true,
  aangemaakt: true,
  actief:true,
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
};
export const getAll = async (genre?: string  | string[]): Promise<Boek[]> => {
  if(!genre){
    return await prisma.boek.findMany({
      select: BOEKEN_SELECT,
    });
  } else{
    return await prisma.boek.findMany({
      select: BOEKEN_SELECT,
      where: {  genre: Array.isArray(genre) ? { in: genre } : genre},
       
    });
  }
  
};

export const getAllBoekKopieen = async ():Promise<BoekKopie[]> =>{
  return await prisma.boekKopie.findMany({
    select:BOEK_KOPIE_SELECT,
  });
};

export const getAllBoekKopieenFromBoek = async (boek_id : string):Promise<BoekKopie[]> =>{
  return await prisma.boekKopie.findMany({
    select:BOEK_KOPIE_SELECT,
    where:{
      boek_id,
    },
  });
};

export const getBoekKopieById = async (boekId : string,boekKopieId : string) : Promise<BoekKopie> =>{
  const opt_res = await prisma.boekKopie.findUnique({
    select:BOEK_KOPIE_SELECT,
    where:{
      id:boekKopieId,
      boek_id:boekId,
    },
  });
  if (!opt_res) {
    throw ServiceError.notFound(`Boek kopie met id:${boekKopieId} van boek:${boekId} bestaat niet.`);
  }

  return opt_res;
};

export const getById = async (id: UUID): Promise<Boek>  => {

  const boek = await prisma.boek.findUnique({
    select: BOEKEN_SELECT,
    where: {
      id,
    },
  });

  if (!boek) {
    throw ServiceError.notFound(`Boek met id:${id} bestaat niet.`);
  }

  return boek;

};

const createAuteurIndienNietBestaat = async (auteur: AuteurCreateInput) : Promise<Auteur> =>{
  const opt_auteur = await prisma.auteur.findFirst({
    where: {
      voornaam: auteur.voornaam,
      achternaam: auteur.achternaam,
    },
  });
 
  if (!opt_auteur) {
    return auteur = await prisma.auteur.create({
      data: {
        id: randomUUID(),
        voornaam: auteur.voornaam,
        achternaam: auteur.achternaam,
        geboortedatum: auteur.geboortedatum,
        nationaliteit:auteur.nationaliteit,
        biografie: auteur.biografie,
        aangemaakt: new Date(),
        upgedate: new Date(),
      },
    });
  } else{
    return auteur = await prisma.auteur.update({
      where:{
        auteurID:{
          voornaam: auteur.voornaam,
          achternaam: auteur.achternaam,
        },
      },
      data: {
        biografie: auteur.biografie,
        upgedate: new Date(),
      },
    });
  }
};

const deleteAuteurIndienNietGebruikt = async(auteurId : string) :Promise<void> =>{
  const opt_auteur = await prisma.auteur.findUnique({
    where:{
      id: auteurId,
    },
  });
  if(opt_auteur){
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
  }
};

export const create = async (new_boek: BoekCreateInput): Promise<Boek> => {
  const opt_boek = await prisma.boek.findFirst({
    where: {
      OR:[
        { ISBN: new_boek.ISBN},
        {titel: new_boek.titel},
      ],
    }, 
  });

  if (opt_boek) {
    throw ServiceError.conflict('boek met ISBN code of titel bestaat al!');
  }

  const auteurId = (await createAuteurIndienNietBestaat(new_boek.auteur)).id;

  try {
    const boekId = randomUUID();

    const maak_boek = async (new_boek: any) => {
      const result = await prisma.$transaction(async (tx) => {
        const [createdboek] = await Promise.all([
          tx.boek.create({
            data: {
              id: boekId,
              ISBN: new_boek.ISBN,
              titel: new_boek.titel,
              genre: new_boek.genre,
              publicatie_datum: new Date(new_boek.publicatie_datum),
              taal: new_boek.taal,
              paginas: new_boek.paginas,
              vrije_kopieen: new_boek.totale_kopieen,
              totale_kopieen: new_boek.totale_kopieen,
              beschrijving: new_boek.beschrijving,
              actief:true,
              cover_uri: new_boek.cover_uri,
              aangemaakt: new Date(),
              upgedate: new Date(),
              auteur_id: auteurId,
            },
            select: BOEKEN_SELECT,
          })]);

        const lijst =[];
        for (let i = 0; i < new_boek.totale_kopieen; i++) {
          lijst.push( await tx.boekKopie.create({
            data: {
              id: randomUUID(),
              boek_id: boekId,
              status: 'Beschikbaar', 
              extra_informatie: null,
              actief:true,
              aangemaakt: new Date(),
              upgedate: new Date(),
            },
          }));
            
        }
        return createdboek;
      }, {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
      });

      return result;
    };
    return await maak_boek(new_boek);
  }catch (error: any) {
    throw handleDBError(error);
  }

};

export const deleteRandomBeschikbareKopie = async(boekId:UUID): Promise<void> =>{
  const delete_random_kopie = async (id: any) => {
    await prisma.$transaction(async (tx) => {
      const eersteKopie = await tx.boekKopie.findFirst({
        where:{
          boek_id:boekId,
          status:'beschikbaar',
          actief:true,
        },
      });
      if(!eersteKopie){
        throw ServiceError.conflict('Er zijn geen beschikbare exemplaren meer om te verwijderen.');
      }
      await Promise.all([
        await tx.boekKopie.update({
          where:{
            id:eersteKopie.id,
          },
          data: {
            actief:false,
          },
        })]);

      await tx.boek.update({
        where:{
          id,
        },
        data:{
          totale_kopieen:{
            decrement:1,
          },
          vrije_kopieen:{
            decrement:1,
          },
        },
      });
     
    }, {
      isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted,
    });
   
  };
  await delete_random_kopie(boekId);
};

export const deleteById = async (id: UUID): Promise<void> => {
  const opt_boek = await getById(id);

  const delete_boek = async (id: any) => {
    const result = await prisma.$transaction(async (tx) => {
      const [createdboek] = await Promise.all([
        tx.boek.update({
          where:{
            id,
          },
          data: {
            actief:false,
          },
          select: BOEKEN_SELECT,
        })]);

      await tx.boekKopie.updateMany({
        where:{
          boek_id:id,
        },
        data:{
          actief:false,
        },
      });

      await tx.reservatie.updateMany({
        where:{
          boek_kopie:{
            boek_id:id,
          },
        },
        data:{
          status:'niet-actief',
        },
      });
      return createdboek;
    }, {
      isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
    });

    return result;
  };
  await  delete_boek(id);
  await deleteAuteurIndienNietGebruikt(opt_boek.auteur.id);

};

export const updateById = async (id: UUID, updated_boek: BoekUpdateInput): Promise<Boek> => {
  const opt_boek = await getById(id);
  if(opt_boek instanceof Error){
    return opt_boek;
  } else{
    const auteurId = (await createAuteurIndienNietBestaat(updated_boek.auteur)).id;
    const update_boek = async (id: any) => {
      const result = await prisma.$transaction(async (tx) => {
        const [updatedBoek] = await Promise.all([
          tx.boek.update({
            where: {
              id,
            },
            data: {
              beschrijving: updated_boek.beschrijving,
              cover_uri: updated_boek.cover_uri,
              upgedate:new Date(),
              auteur_id: auteurId,
            },
            select: BOEKEN_SELECT,
          })]);
        return updatedBoek;
      }, {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
      });

      return result;
    };
    return await update_boek(id);
  }
  
};
