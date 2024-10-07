import { randomUUID } from 'crypto';
import {gebruikers} from './../data/mock_data.js';
import {hashSync,genSaltSync} from 'bcrypt-ts';

export const getAll = () => {
  return gebruikers;
};

export const getById = (id: string)  => {
  const opt_gebruiker = gebruikers.find((g) => g.id === id);
  if(opt_gebruiker == null){
    return new Error(`Gebruiker met id:${id} bestaat niet.`);
  } else{
    return opt_gebruiker;
  }
};

export const create = ({ voornaam, achternaam, geboortedatum,email,rol,hashedpwd }: any) => {
  if(gebruikers.find((g) => g.voornaam === voornaam && g.achternaam === achternaam)){
    return new Error('gebruiker met voor-en achternaam bestaat al!');
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
