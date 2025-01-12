
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
import { Router , ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-public-user-profile-page',
  imports: [   CommonModule,
    FormsModule,
    GameCardComponent,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCardModule,],
  templateUrl: './public-user-profile-page.component.html',
  styleUrl: './public-user-profile-page.component.css'
})
export class PublicUserProfilePageComponent {
  @ViewChild('closeModal') closeModal!: ElementRef;
  @ViewChild('finishedGames') finishedGames!: ElementRef;




  buttonImage: string = '../../../../assets/icons/arrowdown.png';

  foundGames$: Observable<ProfileGameModel[]> = new Observable();
  favoriteGames: number[] = [];
  dislikedGames: number[] = [];
  currentlyPlaying: number[] = [];
  allFinishedGames: number[] = [];
  planToPlay: number[] = [];
  updating: boolean = false;
  gameState = GameState;
  userId: string | null = null;
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

    this.userId = this.route.snapshot.paramMap.get('id');
    this.getUser(this.userId);
  }
  constructor(
    private userService: UserDataService,
    private router: Router,
    private route: ActivatedRoute

  ) {}

  getUser(id: string| null) {
    if (id === null) {
      return;
    }
    this.userService.getUserById(id).subscribe((user) => {
      this.userInfo = user;
      this.allFinishedGames = user.finishedGames;
      this.favoriteGames = user.favoriteGames;
      this.dislikedGames = user.dislikedGames;
      this.currentlyPlaying = user.currentlyPlaying;
      this.planToPlay = user.planOnPlaying;
    });
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


