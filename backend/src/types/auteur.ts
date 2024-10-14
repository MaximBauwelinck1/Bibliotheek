import type { Entity } from './common';
export interface Auteur extends Entity {            
  voornaam: string;         
  achternaam: string;      
  geboortedatum: Date;      
  nationaliteit: string;    
  biografie: string | null;        
  aangemaakt: Date;         
  upgedate: Date;           
}

export interface AuteurCreateInput {
  voornaam: string;         
  achternaam: string;      
  geboortedatum: Date;      
  nationaliteit: string;    
  biografie: string | null; 
}
  
export interface AuteurUpdateInput extends AuteurCreateInput {}