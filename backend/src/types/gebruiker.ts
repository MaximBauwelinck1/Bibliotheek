import type { Entity, ListResponse } from './common';

export interface Gebruiker extends Entity {
  voornaam: string;             
  achternaam: string;            
  geboortedatum: Date;            
  email: string;   
  rol: string;             
  hashed_password: string;          
  salt: string;           
  aangemaakt: Date;         
  upgedate: Date;           
}

export interface gebruikerCreateInput {
  voornaam: string;             
  achternaam: string;            
  geboortedatum: Date;            
  email: string;   
  rol: string;             
  hashed_password: string;                   
}
  
export interface GebruikerUpdateInput extends gebruikerCreateInput {}

export interface CreateGebruikerRequest extends gebruikerCreateInput {}
export interface UpdateGebruikerRequest extends gebruikerCreateInput {}

export interface GetAllgebruikersResponse extends ListResponse<Gebruiker> {}
export interface GetGebruikerByIdResponse extends Gebruiker {}
export interface CreateGebruikerResponse extends GetGebruikerByIdResponse {}
export interface UpdateGebruikerResponse extends GetGebruikerByIdResponse {}