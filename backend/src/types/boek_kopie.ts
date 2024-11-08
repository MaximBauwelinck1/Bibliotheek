import type { Entity } from './common';
import type  {Boek} from './boek';
export interface BoekKopie extends Entity {            
  boek: Boek           
  status: string;      
  extra_informatie: string | undefined;            
  aangemaakt: Date;         
  upgedate: Date;           
}

export interface BoekkopieCreateInput {
  boek: Pick<Boek,'id' >           
  status: string;      
  extra_informatie: string;            
}
  
export interface BoekkopieUpdateInput extends BoekkopieCreateInput {}