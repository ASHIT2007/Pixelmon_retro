import { Injectable, signal, inject } from '@angular/core';
import { PokemonInstance } from '../models/types';
import { DbService } from './db.service';

export type GameView = 'starter-select' | 'overworld' | 'battle' | 'team';

@Injectable({ providedIn: 'root' })
export class GameService {
  private db = inject(DbService);

  // Global State
  view = signal<GameView>('starter-select');
  messages = signal<string[]>([]);
  inventory = signal({ pokeballs: 5, potions: 3 });
  
  // Overworld State
  playerPos = signal({ x: 5, y: 5 });
  // Map dimensions are now handled dynamically by the component, but we keep limits here for safety
  mapWidth = 30;
  mapHeight = 30;

  // Team State
  playerTeam = signal<PokemonInstance[]>([]);
  
  // Battle State
  currentEnemy = signal<PokemonInstance | null>(null);
  activePlayerPokemonIndex = signal<number>(0);

  constructor() {
    this.addMessage("Welcome to PixelMon!");
  }

  addMessage(msg: string) {
    this.messages.update(msgs => [...msgs, msg]);
    if (this.view() === 'overworld') {
      setTimeout(() => {
        this.messages.update(msgs => msgs.filter(m => m !== msg));
      }, 3000);
    }
  }

  clearMessages() {
    this.messages.set([]);
  }

  chooseStarter(id: number) {
    const starter = this.db.generateInstance(id, 5);
    this.playerTeam.set([starter]);
    this.view.set('overworld');
    this.addMessage(`You chose ${starter.name}! Use D-Pad or WASD.`);
  }

  getActivePokemon(): PokemonInstance | null {
    const team = this.playerTeam();
    const idx = this.activePlayerPokemonIndex();
    return team.length > idx ? team[idx] : null;
  }

  healTeam() {
    this.playerTeam.update(team => {
      return team.map(p => ({ ...p, currentHp: p.maxHp }));
    });
    this.addMessage("Your team was fully healed!");
  }

  movePlayer(dx: number, dy: number, map: number[][]) {
    if (this.view() !== 'overworld') return;

    const current = this.playerPos();
    const nx = current.x + dx;
    const ny = current.y + dy;

    // Bounds check based on the actual map passed in
    if (ny < 0 || ny >= map.length || nx < 0 || nx >= map[0].length) return;

    // Collision check: 1=Bush/Wall, 3=Water
    if (map[ny][nx] === 1 || map[ny][nx] === 3) return;

    this.playerPos.set({ x: nx, y: ny });

    // Grass encounter check (2 is grass)
    if (map[ny][nx] === 2) {
      if (Math.random() < 0.15) { 
        this.triggerEncounter();
      }
    }
  }

  triggerEncounter() {
    // Expanded encounter list
    const encounters = [16, 19, 10, 13, 25]; // Pidgey, Rattata, Caterpie, Weedle, Pikachu
    const baseId = encounters[Math.floor(Math.random() * encounters.length)];
    const level = Math.floor(Math.random() * 4) + 2; // Level 2-5
    
    const enemy = this.db.generateInstance(baseId, level);
    
    const firstAliveIdx = this.playerTeam().findIndex(p => p.currentHp > 0);
    if (firstAliveIdx === -1) {
      this.addMessage("You have no usable Pokemon!");
      this.healTeam(); 
      return;
    }

    this.activePlayerPokemonIndex.set(firstAliveIdx);
    this.currentEnemy.set(enemy);
    this.view.set('battle');
    this.clearMessages();
  }

  endBattle(win: boolean) {
    this.currentEnemy.set(null);
    this.view.set('overworld');
    this.clearMessages();
    if (win) {
      this.addMessage("You won the battle!");
    } else {
      this.addMessage("You whited out...");
      this.healTeam(); 
    }
  }

  catchPokemon() {
    const enemy = this.currentEnemy();
    if (!enemy) return false;

    if (this.inventory().pokeballs <= 0) return false;

    this.inventory.update(inv => ({ ...inv, pokeballs: inv.pokeballs - 1 }));

    const hpPercent = enemy.currentHp / enemy.maxHp;
    const catchRate = 1 - hpPercent + 0.2; 
    
    if (Math.random() < catchRate) {
      if (this.playerTeam().length < 6) {
        this.playerTeam.update(team => [...team, enemy]);
      }
      return true;
    }
    return false;
  }
}