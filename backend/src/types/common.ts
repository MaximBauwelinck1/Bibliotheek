import type { UUID } from 'crypto';

export interface Entity {
  id: string;
}

export interface ListResponse<T> {
  items: T[];
}

export interface IdParams {
  id: UUID;
}