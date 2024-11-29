import { randomUUID } from 'crypto';
import {prisma} from '../data';
// eslint-disable-next-line @stylistic/max-len
import type { Gebruiker, GebruikerUpdateInput,PublicGebruiker, RegisterGebruikerRequest, ResetPasswordRequest } from '../types/gebruiker.js';
import { hashPassword,verifyPassword  } from '../core/password';
import type {UUID} from 'crypto';
import ServiceError from '../core/serviceError';
import handleDBError from './_handleDBError';
import { generateJWT,verifyJWT } from '../core/jwt';
import jwt from 'jsonwebtoken'; 
import { getLogger } from '../core/logging';
import type { SessionInfo } from '../types/auth';
import * as emailservice from './emailService';
import moment from 'moment';
import cryto from 'crypto';

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

export const sendPasswordResetEmail = async (userEmail:string) => {
  const user = await prisma.gebruiker.findUnique({
    where:{
      email:userEmail,
    },
  });
  if (!user) return;// niet exposen dat gebruiker niet bestaat
  const  opt_reset = await prisma.passwordReset.findUnique({
    where:{
      gebruiker_id: user.id,
    },
  });
  if(opt_reset&& opt_reset.vervalt_binnen > new Date()){
    throw ServiceError.conflict('Er is nog een geldige herstel wachtwoord link actief. Bekijk je laatste mail');
  } else if (opt_reset && new Date() > opt_reset.vervalt_binnen){
    await prisma.passwordReset.delete({
      where:{
        gebruiker_id:user.id,
      },
    });
  }

  const resetToken = await generateJWT(user); 
  await prisma.passwordReset.create({
    data:{
      gebruiker_id:user.id,
      hashed_token: cryto.createHash('sha256').update(resetToken).digest('hex'),
      vervalt_binnen: moment(new Date()).add(1,'h').toDate(),
    },
  });

  await emailservice.sendEmail(userEmail, 'Wachtwoord reset', 'passwordReset', {
    voornaam: user.voornaam,
    achternaam: user.achternaam,
    link: `http://localhost:5173/reset-password?token=${resetToken}`,
  });

  return resetToken;
};

export const resetPassword = async (resetpwdReq:ResetPasswordRequest) => {
  try {
    const {  sub } = await verifyJWT(resetpwdReq.token);
    if (!sub) {
      throw ServiceError.unauthorized('UserID is leeg');
    }
    const password_request = await prisma.passwordReset.findUnique({
      where:{
        gebruiker_id:sub,
      },
    });
    if(!password_request) throw ServiceError.conflict('De token is niet correct');
    if(new Date()> password_request.vervalt_binnen){
      throw ServiceError.unauthorized('Het wachtwoord reset verzoek is automatisch verlopen na 1 uur.');
    }
    if(password_request.hashed_token != cryto.createHash('sha256').update(resetpwdReq.token).digest('hex')){
      throw ServiceError.unauthorized('De token is niet correct.');
    }
    await prisma.gebruiker.update({
      where:{
        id:sub,
      },
      data:{
        hashed_password: await hashPassword(resetpwdReq.password),
      },
    });
    await prisma.passwordReset.delete({
      where:{
        gebruiker_id:sub,
      },
    });
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

export const deleteById = async (id: UUID | string): Promise<void> => {
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

export const updateById = async (id: UUID | string, new_gebruiker: GebruikerUpdateInput): Promise<PublicGebruiker> => {
  const opt_gebruiker = await getById(id);
  if(opt_gebruiker instanceof Error){
    return opt_gebruiker;
  } else{
    if(new_gebruiker.email){
      const uniekEmail = await prisma.gebruiker.findFirst({
        where:{
          email:new_gebruiker.email,
          voornaam:{
            not:new_gebruiker.voornaam,
          },
          achternaam:{
            not:new_gebruiker.achternaam,
          },
        },
      });
      if(uniekEmail){
        throw ServiceError.conflict('Gebruiker met email addres bestaat al.');
      }
    }
  
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