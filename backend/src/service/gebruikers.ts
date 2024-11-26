import { randomUUID } from 'crypto';
import {prisma} from '../data';
import type { Gebruiker, GebruikerUpdateInput,PublicGebruiker, RegisterGebruikerRequest } from '../types/gebruiker.js';
import { hashPassword,verifyPassword  } from '../core/password';
import type {UUID} from 'crypto';
import ServiceError from '../core/serviceError';
import handleDBError from './_handleDBError';
import { generateJWT,verifyJWT } from '../core/jwt';
import jwt from 'jsonwebtoken'; 
import { getLogger } from '../core/logging';
import type { SessionInfo } from '../types/auth';

const GEBRUIKER_SELECT = { //moet nog veranderen
  id:true,
  voornaam:true,
  achternaam:true,
  geboortedatum:true,
  email:true,
  rol:true,
  actief:true,
  hashed_password:true,
  aangemaakt:true,                                
  upgedate:true,
};

const makeExposedUser = (gebruiker: Gebruiker ): PublicGebruiker => ({
  id:gebruiker.id, 
  voornaam: gebruiker.voornaam,
  achternaam: gebruiker.achternaam, 
  email: gebruiker.email,
  geboortedatum: gebruiker.geboortedatum,
  aangemaakt: gebruiker.aangemaakt,
  upgedate: gebruiker.upgedate,
  actief: gebruiker.actief,
  rol: gebruiker.rol,
});

export const checkAndParseSession = async (
  authHeader?: string,
): Promise<SessionInfo> => {
  if (!authHeader) {
    throw ServiceError.unauthorized('Gebruiker is niet ingelogd');
  }

  if (!authHeader.startsWith('Bearer ')) {
    throw ServiceError.unauthorized('ongeldige authenticatie token');
  }

  const authToken = authHeader.substring(7);

  try {
    const { role, sub } = await verifyJWT(authToken);
    if (!sub) {
      throw ServiceError.unauthorized('UserID is leeg');
    }
    return {
      userId: sub,
      role,
    };
  } catch (error: any) {
    getLogger().error(error.message, { error });

    if (error instanceof jwt.TokenExpiredError) {
      throw ServiceError.unauthorized('De token is vervallen');
    } else if (error instanceof jwt.JsonWebTokenError) {
      throw ServiceError.unauthorized(
        `Ongeldige authenticatie token: ${error.message}`,
      );
    } else {
      throw ServiceError.unauthorized(error.message);
    }
  }
};

export const checkRole = (nodigeRole: string, gebruikerRole: string): void => {
  if (nodigeRole != gebruikerRole) {
    throw ServiceError.forbidden(
      'U mag dit deel van de applicatie niet bekijken',
    );
  }
};

export const getAll = async (): Promise<PublicGebruiker[]> => {
  const users = await prisma.gebruiker.findMany();
  return users.map((user) =>makeExposedUser(user));
};

export const getById = async (id: UUID | string): Promise<PublicGebruiker>  => {

  const gebruiker = await prisma.gebruiker.findUnique({
    select: GEBRUIKER_SELECT,
    where: {
      id,
    },
  });

  if (!gebruiker) {
    throw ServiceError.notFound(`gebruiker met id:${id} bestaat niet.`);
  }

  return makeExposedUser(gebruiker);

};

export const login = async (
  email: string,
  password: string,
): Promise<string> => {
  const user = await prisma.gebruiker.findUnique({ where: { email } });

  if (!user) {
    throw ServiceError.unauthorized(
      'Het gegeven wachtwoord en email kloppen niet.',
    );
  }
  const passwordValid = await verifyPassword(password, user.hashed_password);

  if (!passwordValid) {
    throw ServiceError.unauthorized(
      'Het gegeven wachtwoord en email kloppen niet.',
    );
  }

  return await generateJWT(user); 
};

export const register = async (new_gebruiker: RegisterGebruikerRequest): Promise<string> => {
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
    const passwordHash = await hashPassword(new_gebruiker.password);
    const user = await prisma.gebruiker.create({
      data: {
        id: randomUUID(),
        voornaam: new_gebruiker.voornaam,
        achternaam: new_gebruiker.achternaam,
        geboortedatum: new_gebruiker.geboortedatum,
        email: new_gebruiker.email,
        rol: new_gebruiker.rol?new_gebruiker.rol:'user',
        actief:true,
        hashed_password:passwordHash,
        aangemaakt:new Date(),
        upgedate:new Date(),
      },
      select:GEBRUIKER_SELECT,
    });
    if (!user) {
      throw ServiceError.internalServerError(
        'Er is een fout opgetreden bij het aanmaken van de gebruiker',
      );
    }
    return  await generateJWT(user);
  }catch (error: any) {
    throw handleDBError(error);
  }

};

export const deleteById = async (id: UUID): Promise<void> => {
  const opt_gebruiker = await getById(id);
  if (opt_gebruiker) {
    await prisma.gebruiker.update({
      where:{
        id,
      },
      data:{
        actief:false,
      },
    });
  } else {
    throw ServiceError.conflict(`gebruiker met id:${id} bestaat niet.`);
  }

};

export const updateById = async (id: UUID, new_gebruiker: GebruikerUpdateInput): Promise<PublicGebruiker> => {
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
        ...(new_gebruiker.password && {
          hashed_password: await hashPassword(new_gebruiker.password),
        }),
        upgedate:new Date(),
      },
      select: GEBRUIKER_SELECT,
    });
    return makeExposedUser(upgedate_gebruiker);
  }
  
};