import type { Entity } from './common';
import type  {Boek} from './boek';
export interface BoekKopie extends Entity {            
  boek: Boek           
  status: string;      
  extra_informatie: string | null;            
  aangemaakt: Date;         
  upgedate: Date;           
}

export interface BoekkopieCreateInput {
  boek_id: string          
  status: string;      
  extra_informatie: string;            
}
  
export interface BoekkopieUpdateInput extends BoekkopieCreateInput {}