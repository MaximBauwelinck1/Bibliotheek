import { randomUUID } from 'crypto';
import {prisma} from '../data';
import type { Gebruiker, gebruikerCreateInput, GebruikerUpdateInput } from '../types/gebruiker.js';
import type {UUID} from 'crypto';
import ServiceError from '../core/serviceError';
import handleDBError from './_handleDBError';

const GEBRUIKER_SELECT = { //moet nog veranderen
  id:true,
  voornaam:true,
  achternaam:true,
  geboortedatum:true,
  email:true,
  rol:true,
  salt:true,
  hashed_password:true,
  aangemaakt:true,
  upgedate:true,
};

export const getAll = async (): Promise<Gebruiker[]> => {
  return await prisma.gebruiker.findMany();
};

export const getById = async (id: UUID): Promise<Gebruiker>  => {

  const gebruiker = await prisma.gebruiker.findUnique({
    select: GEBRUIKER_SELECT,
    where: {
      id,
    },
  });

  if (!gebruiker) {
    throw ServiceError.notFound(`gebruiker met id:${id} bestaat niet.`);
  }

  return gebruiker;

};

export const create = async (new_gebruiker: gebruikerCreateInput): Promise<Gebruiker> => {
  const opt_boek = await prisma.gebruiker.findFirst({
    where: {
      AND:[
        { voornaam: new_gebruiker.voornaam},
        {achternaam: new_gebruiker.achternaam},
      ],
    }, 
  });

  if (opt_boek) {
    throw ServiceError.conflict('gebruiker met voor en achternaam bestaat al!');
  }

  try {
    return await prisma.gebruiker.create({
      data: {
        id: randomUUID(),
        voornaam: new_gebruiker.voornaam,
        achternaam: new_gebruiker.achternaam,
        geboortedatum: new_gebruiker.geboortedatum,
        email: new_gebruiker.email,
        rol: new_gebruiker.rol,
        hashed_password:new_gebruiker.hashed_password,//TODO HASHING
        salt:'TODOOOOOO',
        aangemaakt:new Date(),
        upgedate:new Date(),
      },
      select:GEBRUIKER_SELECT,
    });
  }catch (error: any) {
    throw handleDBError(error);
  }

};

export const deleteById = async (id: UUID): Promise<void> => {
  const opt_gebruiker = await getById(id);
  if (opt_gebruiker) {
    await prisma.gebruiker.delete({
      where:{
        id,
      },
    });
  } else {
    throw ServiceError.conflict(`gebruiker met id:${id} bestaat niet.`);
  }

};

export const updateById = async (id: UUID, new_gebruiker: GebruikerUpdateInput): Promise<Gebruiker> => {
  const opt_gebruiker = await getById(id);
  if(opt_gebruiker instanceof Error){
    return opt_gebruiker;
  } else{
        
    const upgedate_gebruiker = await prisma.gebruiker.update({
      where: {
        id,
      },
      data: {
        email: new_gebruiker.email,
        rol: new_gebruiker.rol,
        hashed_password:new_gebruiker.hashed_password,//TODO HASHING
        salt:'TODOOOOOO',
        upgedate:new Date(),
      },
      select: GEBRUIKER_SELECT,
    });
    return upgedate_gebruiker;
  }
  
};