import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { PlayerComponent } from './components/player/player.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, PlayerComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {}
