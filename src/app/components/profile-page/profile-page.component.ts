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
    MatInput,
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
  addGameForm: FormGroup = new FormGroup({});
  foundGames$: Observable<ProfileGameModel[]> = new Observable();
  favoriteGames$: Observable<number[]> = new Observable();
  dislikedGames$: Observable<number[]> = new Observable();
  currentlyPlaying$: Observable<number[]> = new Observable();
  finishedGames$: Observable<number[]> = new Observable();
  planToPlay$: Observable<number[]> = new Observable();
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
    this.favoriteGames$ = this.gameService.getFavorites();
    this.dislikedGames$ = this.gameService.getDisliked();
    this.currentlyPlaying$ = this.gameService.getPlaying();
    this.finishedGames$ = this.gameService.getCompleted();
    this.planToPlay$ = this.gameService.getPlanToPlay();
    this.addGameForm = new FormGroup({
      title: new FormControl(null, Validators.required),
      state: new FormControl(null, Validators.required),
      platform: new FormControl(null, Validators.required),
      image: new FormControl(''),
    });
  }
  constructor(
    private userService: UserDataService,
    private toast: ToastService,
    private gameService: GameDataService
  ) {}

  getUser() {
    console.log('getting user');
    this.userService.getUserData().subscribe((user) => {
      this.userInfo = user;
    });
  }
  addAGame() {
    const newGame: ProfileGameModel = {
      id: new Date().getTime(),
      title: this.addGameForm.get('title')?.value,
      state: this.addGameForm.get('state')?.value,
      rating: 0,
      platform: this.addGameForm.get('platform')?.value,
      cover: 0,
      image: this.addGameForm.get('image')?.value ?? '',
    };
    this.gameService.addGame(newGame).subscribe({
      next: (game) => {},
      complete: () => {
        this.updateOnSearch();
        this.toast.successToast('Game added successfully');
      },
    });
  }

  editInfo() {
    this.editingInfo = true;
  }
  refreshUser() {
    this.userService.refreshUser().subscribe((user) => {
      this.userInfo = user;
    });
  }
  saveInfo() {
    this.userService.updateUserDescription(this.userInfo!).subscribe((user) => {
      this.userInfo = user;
      this.editingInfo = false;
    });
  }
  updateOnSearch() {
    this.closeModal.nativeElement.click();
    this.searchForGame = '';
    this.favoriteGames$ = this.gameService.getFavorites();
    this.dislikedGames$ = this.gameService.getDisliked();
    this.currentlyPlaying$ = this.gameService.getPlaying();
    this.finishedGames$ = this.gameService.getCompleted();
    this.planToPlay$ = this.gameService.getPlanToPlay();
  }
  updateGames() {
    this.currentlyPlaying$ = this.gameService.getPlaying();
    this.finishedGames$ = this.gameService.getCompleted();
    this.planToPlay$ = this.gameService.getPlanToPlay();
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
