import { Injectable } from '@angular/core';
import { Move, PokemonBase, PokemonInstance } from '../models/types';

@Injectable({ providedIn: 'root' })
export class DbService {
  
  public readonly MOVES: Record<string, Move> = {
    'tackle': { id: 'tackle', name: 'Tackle', type: 'Normal', power: 40, accuracy: 100 },
    'scratch': { id: 'scratch', name: 'Scratch', type: 'Normal', power: 40, accuracy: 100 },
    'ember': { id: 'ember', name: 'Ember', type: 'Fire', power: 40, accuracy: 100 },
    'watergun': { id: 'watergun', name: 'Water Gun', type: 'Water', power: 40, accuracy: 100 },
    'vinewhip': { id: 'vinewhip', name: 'Vine Whip', type: 'Grass', power: 45, accuracy: 100 },
    'razorleaf': { id: 'razorleaf', name: 'Razor Leaf', type: 'Grass', power: 55, accuracy: 95 },
    'thundershock': { id: 'thundershock', name: 'Thunder Shock', type: 'Normal', power: 40, accuracy: 100 }, // Simplified type for now
    'stringshot': { id: 'stringshot', name: 'String Shot', type: 'Normal', power: 0, accuracy: 95 }, // Dummy move
    'bugbite': { id: 'bugbite', name: 'Bug Bite', type: 'Normal', power: 60, accuracy: 100 },
  };

  public readonly POKEMON: Record<number, PokemonBase> = {
    1: {
      id: 1, name: 'Bulbasaur', type1: 'Grass', baseHp: 45, baseAtk: 49, baseDef: 49, baseSpd: 45,
      moves: ['tackle', 'vinewhip'],
      frontSprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png',
      backSprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/1.png'
    },
    4: {
      id: 4, name: 'Charmander', type1: 'Fire', baseHp: 39, baseAtk: 52, baseDef: 43, baseSpd: 65,
      moves: ['scratch', 'ember'],
      frontSprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png',
      backSprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/4.png'
    },
    7: {
      id: 7, name: 'Squirtle', type1: 'Water', baseHp: 44, baseAtk: 48, baseDef: 65, baseSpd: 43,
      moves: ['tackle', 'watergun'],
      frontSprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png',
      backSprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/7.png'
    },
    10: {
      id: 10, name: 'Caterpie', type1: 'Normal', baseHp: 45, baseAtk: 30, baseDef: 35, baseSpd: 45,
      moves: ['tackle', 'stringshot'],
      frontSprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10.png',
      backSprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/10.png'
    },
    13: {
      id: 13, name: 'Weedle', type1: 'Normal', baseHp: 40, baseAtk: 35, baseDef: 30, baseSpd: 50,
      moves: ['bugbite', 'stringshot'],
      frontSprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/13.png',
      backSprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/13.png'
    },
    16: {
      id: 16, name: 'Pidgey', type1: 'Normal', baseHp: 40, baseAtk: 45, baseDef: 40, baseSpd: 56,
      moves: ['tackle'],
      frontSprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/16.png',
      backSprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/16.png'
    },
    19: {
      id: 19, name: 'Rattata', type1: 'Normal', baseHp: 30, baseAtk: 56, baseDef: 35, baseSpd: 72,
      moves: ['tackle'],
      frontSprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/19.png',
      backSprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/19.png'
    },
    25: {
      id: 25, name: 'Pikachu', type1: 'Normal', baseHp: 35, baseAtk: 55, baseDef: 40, baseSpd: 90,
      moves: ['thundershock', 'tackle'],
      frontSprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
      backSprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/25.png'
    }
  };

  public getTypeEffectiveness(attackType: string, defendType: string): number {
    if (attackType === 'Fire' && defendType === 'Grass') return 2;
    if (attackType === 'Fire' && defendType === 'Water') return 0.5;
    if (attackType === 'Water' && defendType === 'Fire') return 2;
    if (attackType === 'Water' && defendType === 'Grass') return 0.5;
    if (attackType === 'Grass' && defendType === 'Water') return 2;
    if (attackType === 'Grass' && defendType === 'Fire') return 0.5;
    return 1;
  }

  public generateInstance(baseId: number, level: number): PokemonInstance {
    const base = this.POKEMON[baseId];
    const maxHp = Math.floor((base.baseHp * 2 * level) / 100) + level + 10;
    
    return {
      uid: Math.random().toString(36).substring(2, 9),
      baseId: base.id,
      name: base.name,
      level: level,
      maxHp: maxHp,
      currentHp: maxHp,
      moves: base.moves.map(m => this.MOVES[m]).filter(Boolean)
    };
  }
}