import { randomUUID } from 'crypto';
import {gebruikers} from './../data/mock_data.js';
import {hashSync,genSaltSync} from 'bcrypt-ts';
import { getLogger } from '../core/logging.js';

export const getAll = () => {
  return gebruikers;
};

export const getById = (id: string)  => {
  return gebruikers.find((g) => g.id === id);
};

export const create = ({ voornaam, achternaam, geboortedatum,email,rol,hashedpwd }: any) => {
  if(gebruikers.find((g) => g.voornaam === voornaam && g.achternaam === achternaam)){
    return new Error('gebruiker bestaat al!');
  }
  const salt = genSaltSync(10);
  const hashed_password = hashSync(hashedpwd,salt);
  const nieuwegebruiker = {
    id: randomUUID(),
    voornaam,
    achternaam,
    geboortedatum,
    email,
    rol,
    hashed_password,
    salt,
  };
  gebruikers.push(nieuwegebruiker); 
  getLogger().info(`Gebruiker met id:${nieuwegebruiker.id} is aangemaakt.`);
  return nieuwegebruiker.id; 
};

export const updateById = (
  id: number,
  { amount, date, placeId, user }: any,
) => {
  throw new Error('Not implemented yet!');
};

export const deleteById = (id: number) => {
  throw new Error('Not implemented yet!');
};
