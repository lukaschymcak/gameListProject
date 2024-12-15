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
  editingInfo = false;
  newDescription = '';
  userNamrTest = '';
  searchForGame = '';
  addGameForm: FormGroup = new FormGroup({});
  foundGames$: Observable<ProfileGameModel[]> = new Observable();
  favoriteGames$: Observable<ProfileGameModel[]> = new Observable();
  dislikedGames$: Observable<ProfileGameModel[]> = new Observable();
  currentlyPlaying$: Observable<ProfileGameModel[]> = new Observable();
  finishedGames$: Observable<ProfileGameModel[]> = new Observable();
  planToPlay$: Observable<ProfileGameModel[]> = new Observable();
  updating: boolean = false;
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
      image: new FormControl(null),
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
    this.favoriteGames$ = this.gameService.getFavorites();
    this.dislikedGames$ = this.gameService.getDisliked();
  }
  updateGames() {
    console.log('updating games');
    this.currentlyPlaying$ = this.gameService.getPlaying();
    this.finishedGames$ = this.gameService.getCompleted();
    this.planToPlay$ = this.gameService.getPlanToPlay();
  }

  searchGame() {
    this.foundGames$ = this.gameService.searchForGame(this.searchForGame);
  }
}
