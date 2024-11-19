import type { Entity, ListResponse } from './common';
import type {Boek} from './boek';
export interface BoekKopie extends Entity {            
  boek: Boek         
  status: string;      
  extra_informatie: string | null;            
  aangemaakt: Date;         
  upgedate: Date; 
  actief: boolean            
}

export interface BoekkopieCreateInput {
  boek_id: string          
  status: string;      
  extra_informatie: string;            
}
  
export interface BoekkopieUpdateInput extends BoekkopieCreateInput {}
export interface GetAllBoekkopieennResponse extends ListResponse<BoekKopie> {}
export interface GetBoekkopieByIdResponse extends BoekKopie {}

export interface CreateBoekKopieRequest extends BoekkopieCreateInput {}
export interface UpdateBoekKopieRequest extends BoekkopieUpdateInput {}

export interface CreateBoekKopieResponse extends GetBoekkopieByIdResponse {}
export interface UpdateBoekKopieResponse extends GetBoekkopieByIdResponse {}