import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UserModel } from '../../models/UserModel';
import {
  FormControl,
  FormGroup,
  FormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { GameCardComponent } from '../shared/game-card/game-card.component';
import { UserDataService } from '../../services/userData/user-data.service';
import { GameDataService } from '../../services/gameData/game-data.service';
import { ToastService } from '../shared/toast/toast.service';
import { map, Observable } from 'rxjs';
import { NgModel } from '@angular/forms';
import { ProfileGameModel } from '../../models/ProfileGameModel';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { GameState } from '../../utils/gameState';
import { AuthServiceService } from '../../services/auth/auth-service.service';

@Component({
  selector: 'app-profile-page',
  imports: [
    CommonModule,
    FormsModule,
    GameCardComponent,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCardModule,
  ],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.css',
})
export class ProfilePageComponent implements OnInit {
  @ViewChild('closeModal') closeModal!: ElementRef;
  @ViewChild('finishedGames') finishedGames!: ElementRef;
  editingInfo = false;
  newDescription = '';
  userNamrTest = '';
  searchForGame = '';
  buttonImage: string = '../../../../assets/icons/arrowdown.png';
  addGameForm = new FormGroup({
    title: new FormControl(null, Validators.required),
    state: new FormControl(null, Validators.required),
    platform: new FormControl(null, Validators.required),
    image: new FormControl(''),
  });
  foundGames$: Observable<ProfileGameModel[]> = new Observable();
  favoriteGames: number[] = [];
  dislikedGames: number[] = [];
  currentlyPlaying: number[] = [];
  allFinishedGames: number[] = [];
  planToPlay: number[] = [];
  updating: boolean = false;
  gameState = GameState;
  gameinfo: ProfileGameModel = {
    id: 1,
    _id: 1,
    image: 'test',
    title: 'test',
    state: 'test',
    rating: 1,
    platform: 'test',
    cover: 0,
  };
  userInfo: UserModel | null = null;
  ngOnInit(): void {
    this.getUser();
  }
  constructor(
    private userService: UserDataService,
    private toast: ToastService,
    private gameService: GameDataService,
    private authService: AuthServiceService
  ) {}

  getUser() {
    this.userService.getUserData().subscribe((user) => {
      this.userInfo = user;
      this.allFinishedGames = user.finishedGames;
      this.favoriteGames = user.favoriteGames;
      this.dislikedGames = user.dislikedGames;
      this.currentlyPlaying = user.currentlyPlaying;
      this.planToPlay = user.planOnPlaying;
    });
  }
  addAGame() {
    const newGame: ProfileGameModel = {
      id: new Date().getTime(),
      title: this.addGameForm.get('title')?.value ?? '',
      state: this.addGameForm.get('state')?.value ?? '',
      rating: 0,
      platform: this.addGameForm.get('platform')?.value ?? '',
      cover: 0,
      image: this.addGameForm.get('image')?.value ?? '',
    };
    this.gameService.addGame(newGame).subscribe({
      next: (game) => {
        this.updateOnSearch();
      },
      complete: () => {
        this.updateOnSearch();
        this.toast.successToast('Game added successfully');
      },
    });
  }

  editInfo() {
    this.editingInfo = true;
  }
  saveInfo() {
    this.userService.updateUserDescription(this.userInfo!).subscribe((user) => {
      this.userInfo = user;
      this.editingInfo = false;
    });
  }
  updateOnSearch() {
    this.closeModal.nativeElement.click();
    this.getUser();
  }
  updateGames() {
    console.log('updating games');
    this.getUser();
  }

  searchGame() {
    this.foundGames$ = this.gameService.searchForGame(this.searchForGame);
  }
  dropDown(ref: HTMLDivElement) {
    if (ref.classList.contains('showDropdown')) {
      this.buttonImage = '../../../../assets/icons/arrowdown.png';
      ref.classList.remove('showDropdown');
    } else {
      this.buttonImage = '../../../../assets/icons/arrowup.png';
      ref.classList.add('showDropdown');
    }
  }
}
