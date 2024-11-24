import type { Entity, ListResponse } from './common';

export interface Gebruiker extends Entity {
  voornaam: string;             
  achternaam: string;            
  geboortedatum: Date;            
  email: string;   
  rol: string;             
  hashed_password: string;                   
  aangemaakt: Date;         
  upgedate: Date;   
  actief: boolean        
}
export interface PublicGebruiker extends Omit<Gebruiker, 'hashed_password'> {}

export interface gebruikerCreateInput {
  voornaam: string;             
  achternaam: string;            
  geboortedatum: Date;            
  email: string;   
  rol: string;             
  password: string;                   
}
  
export interface LoginRequest {
  email: string;
  password: string;
}
export interface RegisterGebruikerRequest {
  voornaam: string;             
  achternaam: string;            
  geboortedatum: Date;            
  email: string;   
  rol: string;             
  password: string;   
}
export interface LoginResponse {
  token: string;
}
export interface GetGebruikerRequest {
  id: string | 'me'; 
}
export interface GebruikerUpdateInput extends gebruikerCreateInput {}

export interface CreateGebruikerRequest extends gebruikerCreateInput {}
export interface UpdateGebruikerRequest extends gebruikerCreateInput {}

export interface GetAllgebruikersResponse extends ListResponse<PublicGebruiker> {}
export interface GetGebruikerByIdResponse extends PublicGebruiker {}
export interface CreateGebruikerResponse extends GetGebruikerByIdResponse {}
export interface UpdateGebruikerResponse extends GetGebruikerByIdResponse {}