import { randomUUID } from 'crypto';
import {gebruikers} from './../data/mock_data.js';
import {hashSync,genSaltSync} from 'bcrypt-ts';

export const getAll = () => {
  return gebruikers;
};

export const getById = (id: string)  => {
  console.log('test'+id);
  return gebruikers.find((g) => g.id === id);
};

export const create = ({ voornaam, achternaam, geboortedatum,email,rol,hashedpwd }: any) => {
  const salt = genSaltSync(10);
  const salted_pwd = hashSync(hashedpwd,salt);
  const nieuwegebruiker = {
    id: randomUUID(),
    voornaam,
    achternaam,
    geboortedatum,
    email,
    rol,
    salted_pwd,
    salt,
  };
  gebruikers.push(nieuwegebruiker); 
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
