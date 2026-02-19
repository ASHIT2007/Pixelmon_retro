import { Component, inject, OnInit, OnDestroy, computed } from '@angular/core';
import { GameService } from '../services/game.service';

@Component({
  selector: 'app-overworld',
  standalone: true,
  templateUrl: './overworld.component.html',
  styleUrl: './overworld.component.css'
})
export class OverworldComponent implements OnInit, OnDestroy {
  game = inject(GameService);

  // Tile map legend:
  // 0: Path/Dirt
  // 1: Bush/Tree (Impassable)
  // 2: Tall Grass (Encounters)
  // 3: Water (Impassable)
  // 4: Flowers (Passable, decorative)
  
  // A much larger 30x20 map
  mapLayout = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1, 0, 4, 0, 1, 1, 2, 2, 2, 2, 2, 2, 1, 1, 1, 3, 3, 3, 3, 3, 1, 1, 1, 1, 1, 1],
    [1, 0, 4, 0, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 3, 3, 3, 3, 3, 3, 3, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 0, 1, 3, 3, 3, 3, 3, 3, 3, 1, 1, 1, 1, 1],
    [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 3, 3, 1, 1, 1, 3, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 0, 0, 1, 1, 1, 1, 0, 0, 4, 4, 0, 0, 0, 1, 3, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 3, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 0, 0, 1, 1, 1, 1, 0, 0, 2, 2, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 0, 0, 4, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 2, 2, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 0, 0, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 0, 0, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 0, 0, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 4, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
  ];

  // Tile size in pixels for rendering
  tileSize = 40;

  // Calculate camera offset to keep player in the center of a roughly 600x450 container
  cameraOffsetX = computed(() => {
    return 300 - (this.game.playerPos().x * this.tileSize + (this.tileSize / 2));
  });

  cameraOffsetY = computed(() => {
    return 225 - (this.game.playerPos().y * this.tileSize + (this.tileSize / 2));
  });

  private keyHandler: (e: KeyboardEvent) => void;

  constructor() {
    this.keyHandler = (e: KeyboardEvent) => {
      if (this.game.view() !== 'overworld') return;
      
      switch (e.key) {
        case 'ArrowUp': case 'w': case 'W': this.move(0, -1); break;
        case 'ArrowDown': case 's': case 'S': this.move(0, 1); break;
        case 'ArrowLeft': case 'a': case 'A': this.move(-1, 0); break;
        case 'ArrowRight': case 'd': case 'D': this.move(1, 0); break;
        case 'Enter': case ' ': this.actionA(); break;
      }
    };
  }

  ngOnInit() {
    window.addEventListener('keydown', this.keyHandler);
    if (this.game.playerPos().x === 5 && this.game.playerPos().y === 5) {
      this.game.playerPos.set({x: 5, y: 3});
    }
  }

  ngOnDestroy() {
    window.removeEventListener('keydown', this.keyHandler);
  }

  // Backup Tailwind classes to completely avoid any black voids
  getTileFallbackClass(type: number): string {
    switch (type) {
      case 0: return 'bg-[#f0e0a8]'; // Path
      case 1: return 'bg-[#48a848]'; // Tree
      case 2: return 'bg-[#78c850]'; // Grass
      case 3: return 'bg-[#3890f8]'; // Water
      case 4: return 'bg-[#f0e0a8]'; // Flowers
      default: return 'bg-black';
    }
  }

  move(dx: number, dy: number) {
    this.game.movePlayer(dx, dy, this.mapLayout);
  }

  actionA() {
    if (this.game.messages().length === 0) {
      this.openTeam();
    }
  }

  actionB() {
    this.game.healTeam();
  }

  openTeam() {
    this.game.view.set('team');
  }
}