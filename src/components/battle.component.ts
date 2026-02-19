import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { GameService } from '../services/game.service';
import { DbService } from '../services/db.service';
import { Move, PokemonBase, PokemonInstance } from '../models/types';

type BattleMenuState = 'main' | 'fight' | 'bag' | 'message';

@Component({
  selector: 'app-battle',
  standalone: true,
  templateUrl: './battle.component.html'
})
export class BattleComponent implements OnInit {
  game = inject(GameService);
  db = inject(DbService);

  menuState = signal<BattleMenuState>('message');
  battleMessage = signal<string>('');
  
  // Manage attack visual effects
  activeEffect = signal<{ type: string, isPlayer: boolean } | null>(null);

  playerPkmn = computed(() => this.game.getActivePokemon());
  enemyPkmn = computed(() => this.game.currentEnemy());

  playerBase = computed(() => {
    const p = this.playerPkmn();
    return p ? this.db.POKEMON[p.baseId] : null;
  });
  
  enemyBase = computed(() => {
    const e = this.enemyPkmn();
    return e ? this.db.POKEMON[e.baseId] : null;
  });

  playerHpPercent = computed(() => {
    const p = this.playerPkmn();
    if (!p) return 0;
    return Math.max(0, (p.currentHp / p.maxHp) * 100);
  });

  enemyHpPercent = computed(() => {
    const e = this.enemyPkmn();
    if (!e) return 0;
    return Math.max(0, (e.currentHp / e.maxHp) * 100);
  });

  isAnimatingPlayer = signal(false);
  isAnimatingEnemy = signal(false);

  ngOnInit() {
    this.startWildEncounter();
  }

  async startWildEncounter() {
    const enemy = this.enemyPkmn();
    if (!enemy) return;
    
    await this.showMessage(`Wild ${enemy.name} appeared!`);
    
    const player = this.playerPkmn();
    if (player) {
      await this.showMessage(`Go! ${player.name}!`);
      this.menuState.set('main');
    } else {
      this.game.endBattle(false);
    }
  }

  async showMessage(msg: string, delayMs = 1500): Promise<void> {
    this.menuState.set('message');
    this.battleMessage.set(msg);
    return new Promise(resolve => setTimeout(resolve, delayMs));
  }

  setMenu(state: BattleMenuState) {
    this.menuState.set(state);
  }

  async useMove(move: Move) {
    this.menuState.set('message');
    const player = this.playerPkmn();
    const enemy = this.enemyPkmn();
    
    if (!player || !enemy) return;

    // Player Turn
    await this.showMessage(`${player.name} used ${move.name}!`, 800);
    
    // Animate Player Attack Effect
    this.activeEffect.set({ type: move.type, isPlayer: true });
    await new Promise(r => setTimeout(r, 400));
    this.activeEffect.set(null);

    // Hit Enemy
    this.isAnimatingEnemy.set(true);
    setTimeout(() => this.isAnimatingEnemy.set(false), 500);
    
    const enemyBaseData = this.db.POKEMON[enemy.baseId];
    const effectiveness = this.db.getTypeEffectiveness(move.type, enemyBaseData.type1);
    
    let damage = Math.floor((player.level * 2 * move.power) / 100) + 2;
    damage = Math.floor(damage * effectiveness);
    
    if (effectiveness > 1) await this.showMessage("It's super effective!", 1000);
    else if (effectiveness < 1) await this.showMessage("It's not very effective...", 1000);

    this.game.currentEnemy.update(e => {
      if (!e) return e;
      return { ...e, currentHp: Math.max(0, e.currentHp - damage) };
    });

    // Check Enemy Faint
    if (this.game.currentEnemy()?.currentHp === 0) {
      this.isAnimatingEnemy.set(true); // Death blink
      await this.showMessage(`Wild ${enemy.name} fainted!`);
      this.game.endBattle(true);
      return;
    }

    // Enemy Turn
    const enemyMoves = enemy.moves;
    const randomMove = enemyMoves[Math.floor(Math.random() * enemyMoves.length)];
    
    await this.showMessage(`Wild ${enemy.name} used ${randomMove.name}!`, 800);

    // Animate Enemy Attack Effect
    this.activeEffect.set({ type: randomMove.type, isPlayer: false });
    await new Promise(r => setTimeout(r, 400));
    this.activeEffect.set(null);

    // Hit Player
    this.isAnimatingPlayer.set(true);
    setTimeout(() => this.isAnimatingPlayer.set(false), 500);

    const playerBaseData = this.db.POKEMON[player.baseId];
    const eEffectiveness = this.db.getTypeEffectiveness(randomMove.type, playerBaseData.type1);
    
    let eDamage = Math.floor((enemy.level * 2 * randomMove.power) / 100) + 2;
    eDamage = Math.floor(eDamage * eEffectiveness);

    if (eEffectiveness > 1) await this.showMessage("It's super effective!", 1000);
    else if (eEffectiveness < 1) await this.showMessage("It's not very effective...", 1000);

    this.game.playerTeam.update(team => {
      const newTeam = [...team];
      const idx = this.game.activePlayerPokemonIndex();
      newTeam[idx] = { ...newTeam[idx], currentHp: Math.max(0, newTeam[idx].currentHp - eDamage) };
      return newTeam;
    });

    // Check Player Faint
    if (this.game.getActivePokemon()?.currentHp === 0) {
      await this.showMessage(`${player.name} fainted!`);
      this.game.endBattle(false);
      return;
    }

    this.menuState.set('main');
  }

  async tryCatch() {
    this.menuState.set('message');
    if (this.game.inventory().pokeballs <= 0) {
      await this.showMessage("You don't have any Poke Balls!");
      this.menuState.set('main');
      return;
    }

    await this.showMessage("You threw a Poke Ball!");
    
    this.isAnimatingEnemy.set(true);
    await new Promise(r => setTimeout(r, 1000));
    this.isAnimatingEnemy.set(false);

    const success = this.game.catchPokemon();
    if (success) {
      await this.showMessage(`Gotcha! ${this.enemyPkmn()?.name} was caught!`);
      this.game.endBattle(true);
    } else {
      await this.showMessage("Oh no! The Pokemon broke free!");
      this.enemyTurnSimple();
    }
  }

  async enemyTurnSimple() {
    const enemy = this.enemyPkmn();
    const player = this.playerPkmn();
    if (!enemy || !player) {
      this.menuState.set('main');
      return;
    }

    const randomMove = enemy.moves[0];
    await this.showMessage(`Wild ${enemy.name} used ${randomMove.name}!`, 800);
    
    // Enemy Attack Effect
    this.activeEffect.set({ type: randomMove.type, isPlayer: false });
    await new Promise(r => setTimeout(r, 400));
    this.activeEffect.set(null);

    // Hit Player
    this.isAnimatingPlayer.set(true);
    setTimeout(() => this.isAnimatingPlayer.set(false), 500);

    let damage = Math.floor((enemy.level * 2 * randomMove.power) / 100) + 2;
    
    this.game.playerTeam.update(team => {
      const newTeam = [...team];
      const idx = this.game.activePlayerPokemonIndex();
      newTeam[idx] = { ...newTeam[idx], currentHp: Math.max(0, newTeam[idx].currentHp - damage) };
      return newTeam;
    });

    if (this.game.getActivePokemon()?.currentHp === 0) {
      await this.showMessage(`${player.name} fainted!`);
      this.game.endBattle(false);
    } else {
      this.menuState.set('main');
    }
  }

  async tryRun() {
    this.menuState.set('message');
    await this.showMessage("Got away safely!");
    this.game.endBattle(false);
  }
}