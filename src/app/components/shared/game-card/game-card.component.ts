import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Input } from '@angular/core';
import { ProfileGameModel } from '../../../models/ProfileGameModel';
import { CoverModel } from '../../../models/CoverModel';
import { GameDataService } from '../../../services/gameData/game-data.service';
import { MatIconButton } from '@angular/material/button';
import { GameState } from '../../../utils/gameState';
import { ProfilePageComponent } from '../../profile-page/profile-page.component';
import { UserModel } from '../../../models/UserModel';
import { UserDataService } from '../../../services/userData/user-data.service';
import { ToastService } from '../toast/toast.service';
import { Event } from '@angular/router';
@Component({
  selector: 'app-game-card',
  imports: [CommonModule],
  templateUrl: './game-card.component.html',
  styleUrl: './game-card.component.css',
})
export class GameCardComponent {
  @Input() profile?: Boolean;
  @Input() cover?: number;
  @Output() updateOnSearch: EventEmitter<any> = new EventEmitter();
  @Output() updateGames: EventEmitter<any> = new EventEmitter();
  @Input() gameID?: number;
  gameCover: string = 'https://images.igdb.com/igdb/image/upload/t_cover_big/';
  profileGame: ProfileGameModel | null = null;
  constructor(
    private gameService: GameDataService,
    private userService: UserDataService,
    private toastService: ToastService
  ) {}
  gameState = GameState;

  ngOnInit(): void {
    if (this.profile) {
      this.getProfileGameById();
    } else {
      this.getGameById();
    }
  }
  getGameById() {
    if (this.gameID) {
      this.gameService.getGameById(this.gameID).subscribe({
        next: (game) => {
          this.profileGame = game;
          this.gameService.getCoverImage(game.cover).subscribe({
            next: (cover) => {
              this.gameCover += cover.image_id + '.jpg';
            },
            error: (err) => {
              console.log(err);
            },
          });
        },
        error: (err) => {
          console.log(err);
        },
      });
    }
  }
  getProfileGameById() {
    if (this.gameID) {
      this.gameService.getProfileGameById(this.gameID).subscribe({
        next: (game) => {
          this.profileGame = game;
          this.gameService.getCoverImage(game.cover).subscribe({
            next: (cover) => {
              this.gameCover += cover.image_id + '.jpg';
            },
            error: (err) => {
              console.log(err);
            },
          });
        },
        error: (err) => {
          console.log(err);
        },
      });
    }
  }
  removeGame() {
    if (this.profileGame) {
      this.gameService.removeGame(this.profileGame).subscribe({
        next: (res) => {
          this.updateOnSearch.emit();
        },
        error: (err) => {
          console.log(err);
          switch (err.status) {
            case 401:
              this.toastService.errorToast(
                'You need to be logged in to remove games',
                'X',
                2000
              );
              break;
            default:
              this.toastService.errorToast('An error occurred', 'X', 2000);
              break;
          }
        },
        complete: () => {
          this.toastService.successToast('Game removed', 'X', 2000);
          this.updateOnSearch.emit();
        },
      });
    }
  }
  addToFavorites() {
    if (this.profileGame) {
      this.profileGame.isFavorite = true;
      this.profileGame.isDisliked = false;
      this.gameService.addToFavorites(this.profileGame).subscribe({
        next: (res) => {
          this.updateOnSearch.emit();
        },
        error: (err) => {
          console.log(err);
          switch (err.status) {
            case 401:
              this.toastService.errorToast(
                'You need to be logged in to add games to favorites',
                'X',
                2000
              );
              break;
            case 409:
              this.toastService.errorToast(
                'Game already in favorites',
                'X',
                2000
              );
              break;
            default:
              this.toastService.errorToast('An error occurred', 'X', 2000);
              break;
          }
        },
        complete: () => {
          this.toastService.successToast('Game added to favorites', 'X', 2000);
          this.updateOnSearch.emit();
        },
      });
    }
  }

  addToDisliked() {
    if (this.profileGame) {
      this.profileGame.isDisliked = true;
      this.profileGame.isFavorite = false;
      this.gameService.addToDisliked(this.profileGame).subscribe({
        next: (res) => {
          this.updateOnSearch.emit();
        },
        error: (err) => {
          console.log(err);
          switch (err.status) {
            case 401:
              this.toastService.errorToast(
                'You need to be logged in to add games to disliked',
                'X',
                2000
              );
              break;
            case 409:
              this.toastService.errorToast(
                'Game already in disliked',
                'X',
                2000
              );
              break;
            default:
              this.toastService.errorToast('An error occurred', 'X', 2000);
              break;
          }
        },
        complete: () => {
          this.toastService.successToast('Game added to disliked', 'X', 2000);
          this.updateOnSearch.emit();
        },
      });
    }
  }

  updateState(state: string) {
    if (this.profile) {
      if (this.profileGame) {
        this.profileGame.state = state;
        console.log(state);
        switch (state) {
          case 'Playing':
            this.profileGame.isPlaying = true;
            this.profileGame.isPlanToPlay = false;
            this.profileGame.isCompleted = false;
            break;
          case 'Plan to play':
            this.profileGame.isPlaying = false;
            this.profileGame.isPlanToPlay = true;
            this.profileGame.isCompleted = false;
            break;
          case 'Finished':
            this.profileGame.isPlaying = false;
            this.profileGame.isPlanToPlay = false;
            this.profileGame.isCompleted = true;
            break;
        }
        this.gameService.updateGame(this.profileGame).subscribe({
          next: (res) => {
            this.gameService.moveGame(res).subscribe({
              next: (res) => {
                this.updateGames.emit();
                console.log(res);
              },
              complete: () => {
                this.updateGames.emit();
              },
            });
          },
          complete: () => {
            this.updateGames.emit();
          },
        });
      }
    } else {
      if (this.profileGame) {
        this.profileGame.state = state;
        switch (state) {
          case 'Playing':
            this.profileGame.isPlaying = true;
            this.profileGame.isPlanToPlay = false;
            this.profileGame.isCompleted = false;
            break;
          case 'Plan to play':
            this.profileGame.isPlaying = false;
            this.profileGame.isPlanToPlay = true;
            this.profileGame.isCompleted = false;
            break;
          case 'Finished':
            this.profileGame.isPlaying = false;
            this.profileGame.isPlanToPlay = false;
            this.profileGame.isCompleted = true;
            break;
        }
        this.gameService.moveGame(this.profileGame!).subscribe({
          next: (res) => {
            this.updateOnSearch.emit();
          },
          complete: () => {
            this.updateOnSearch.emit();
          },
        });
      }
    }
  }
}
