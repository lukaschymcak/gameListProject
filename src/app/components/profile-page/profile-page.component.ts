import { Component, OnInit } from '@angular/core';
import { UserModel } from '../../models/UserModel';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { GameCardComponent } from '../shared/game-card/game-card.component';
import { UserDataService } from '../../services/userData/user-data.service';
import { ToastService } from '../shared/toast/toast.service';
import { map } from 'rxjs';
import { NgModel } from '@angular/forms';
@Component({
  selector: 'app-profile-page',
  imports: [CommonModule, FormsModule, GameCardComponent],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.css',
})
export class ProfilePageComponent implements OnInit {
  editingInfo = false;
  newDescription = '';
  userNamrTest = '';
  searchForGame = '';
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
