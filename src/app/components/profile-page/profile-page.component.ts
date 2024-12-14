import { Component, OnInit } from '@angular/core';
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
import { ToastService } from '../shared/toast/toast.service';
import { map } from 'rxjs';
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
  editingInfo = false;
  newDescription = '';
  userNamrTest = '';
  searchForGame = '';
  addGameForm: FormGroup = new FormGroup({});
  gameinfo: ProfileGameModel = {
    id: 1,
    image: 'test',
    title: 'test',
    state: 'test',
    rating: 1,
    platform: 'test',
  };
  userInfo: UserModel = {
    id: 1,
    username: '',
    password: '',
    favourites: [],
    description: '',
  };
  ngOnInit(): void {
    this.userService.getUserData().subscribe((res) => {
      this.userInfo = res;
    });
    this.addGameForm = new FormGroup({
      title: new FormControl(null, Validators.required),
      state: new FormControl(null, Validators.required),
      platform: new FormControl(null, Validators.required),
      image: new FormControl(null),
    });
  }
  constructor(
    private userService: UserDataService,
    private toast: ToastService
  ) {}

  editInfo() {
    this.editingInfo = true;
  }
  getInfo() {
    return this.userInfo;
  }
  saveInfo() {
    this.userService.updateUserDescription(this.newDescription).subscribe({
      next: (res) => {
        this.userInfo = res;
        this.editingInfo = false;
      },
      complete: () => {
        this.toast.successToast('Description updated', 'X', 2000);
      },
      error: (err) => {
        this.toast.errorToast('Error updating description', 'X', 2000);
        console.log(err);
      },
    });
  }

  searchGame() {
    this.userService.searchForGame(this.searchForGame).subscribe({
      next: (res) => {
        console.log(res);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
