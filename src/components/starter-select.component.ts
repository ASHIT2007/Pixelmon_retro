import { Component, inject } from '@angular/core';
import { GameService } from '../services/game.service';
import { DbService } from '../services/db.service';

@Component({
  selector: 'app-starter-select',
  standalone: true,
  templateUrl: './starter-select.component.html'
})
export class StarterSelectComponent {
  game = inject(GameService);
  db = inject(DbService);

  starters = [
    { id: 1, name: 'Bulbasaur', color: 'bg-green-500' },
    { id: 4, name: 'Charmander', color: 'bg-red-500' },
    { id: 7, name: 'Squirtle', color: 'bg-blue-500' }
  ];

  getSprite(id: number) {
    return this.db.POKEMON[id].frontSprite;
  }

  choose(id: number) {
    this.game.chooseStarter(id);
  }
}
