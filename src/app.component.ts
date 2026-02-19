import { Component, inject } from '@angular/core';
import { GameService } from './services/game.service';
import { OverworldComponent } from './components/overworld.component';
import { BattleComponent } from './components/battle.component';
import { TeamComponent } from './components/team.component';
import { StarterSelectComponent } from './components/starter-select.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [OverworldComponent, BattleComponent, TeamComponent, StarterSelectComponent],
  templateUrl: './app.component.html'
})
export class AppComponent {
  game = inject(GameService);
}
