export type PkmnType = 'Normal' | 'Fire' | 'Water' | 'Grass';

export interface Move {
  id: string;
  name: string;
  type: PkmnType;
  power: number;
  accuracy: number;
}

export interface PokemonBase {
  id: number;
  name: string;
  type1: PkmnType;
  type2?: PkmnType;
  baseHp: number;
  baseAtk: number;
  baseDef: number;
  baseSpd: number;
  moves: string[]; // Move IDs
  frontSprite: string;
  backSprite: string;
}

export interface PokemonInstance {
  uid: string;
  baseId: number;
  name: string;
  level: number;
  maxHp: number;
  currentHp: number;
  moves: Move[];
}

export interface MapTile {
  type: 'wall' | 'grass' | 'path' | 'water';
  x: number;
  y: number;
}
