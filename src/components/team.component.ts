import { Component, inject } from '@angular/core';
import { GameService } from '../services/game.service';
import { DbService } from '../services/db.service';

@Component({
  selector: 'app-team',
  standalone: true,
  templateUrl: './team.component.html'
})
export class TeamComponent {
  game = inject(GameService);
  db = inject(DbService);

  getSprite(baseId: number) {
    return this.db.POKEMON[baseId]?.frontSprite;
  }

  close() {
    this.game.view.set('overworld');
  }
}
