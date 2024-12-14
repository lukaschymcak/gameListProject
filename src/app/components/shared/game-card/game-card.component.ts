import { Component } from '@angular/core';
import { Input } from '@angular/core';
import { ProfileGameModel } from '../../../models/ProfileGameModel';

@Component({
  selector: 'app-game-card',
  imports: [],
  templateUrl: './game-card.component.html',
  styleUrl: './game-card.component.css',
})
export class GameCardComponent {
  @Input() profileGames?: ProfileGameModel[];
  @Input() profile?: Boolean;
  constructor() {}

  ngOnInit(): void {}
}
