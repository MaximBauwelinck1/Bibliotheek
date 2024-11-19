import type { Entity, ListResponse } from './common';
import type { Auteur } from './auteur';

export interface Boek extends Entity {
  ISBN: string;             
  titel: string;            
  genre: string;            
  publicatie_datum: Date;   
  taal: string;             
  paginas: number;          
  vrije_kopieen: number;    
  totale_kopieen: number;   
  beschrijving: string ;     
  cover_uri: string | null;       
  aangemaakt: Date;         
  upgedate: Date;          
  auteur: Auteur;
  actief: boolean     
}

export interface BoekCreateInput {
  ISBN: string;             
  titel: string;            
  genre: string;            
  publicatie_datum: Date;   
  taal: string;             
  paginas: number;          
  vrije_kopieen: number;    
  totale_kopieen: number;   
  beschrijving: string ;     
  cover_uri: string | null;                
  auteur: Pick<Auteur, 'voornaam'|'achternaam'|'geboortedatum'|'nationaliteit'|'biografie'>;  
}
  
export interface BoekUpdateInput extends BoekCreateInput {}

export interface CreateBoekRequest extends BoekCreateInput {}
export interface UpdateBoekRequest extends BoekUpdateInput {}

export interface GetAllBoekenResponse extends ListResponse<Boek> {}
export interface GetBoekByIdResponse extends Boek {}
export interface CreateBoekResponse extends GetBoekByIdResponse {}
export interface UpdateBoekResponse extends GetBoekByIdResponse {}