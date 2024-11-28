import type { Entity,ListResponse } from './common';
import type { BoekKopie } from './boek_kopie';
import type {Gebruiker} from './gebruiker';

export interface Reservatie extends Entity {
  boek_kopie: BoekKopie;             
  gebruiker: Gebruiker;            
  startdatum: Date;            
  einddatum: Date;   
  status: string;               
}
  
export interface ReservatieCreateInput {
  boek_kopie_id: string | null; 
  boek_id: string | null;                         
  gebruiker_id: string;                       
  einddatum: Date;   
  status: string;  
}
    
export interface ReservatieUpdateInput extends ReservatieCreateInput {}
  
export interface CreateReservatieRequest extends ReservatieCreateInput {}
export interface UpdateReservatieRequest extends ReservatieUpdateInput {}
  
export interface GetAllReservatiesResponse extends ListResponse<Reservatie> {}
export interface GetReservatieByIdResponse extends Reservatie {}
export interface CreateReservatieResponse extends GetReservatieByIdResponse {}
export interface UpdateReservatieResponse extends GetReservatieByIdResponse {}