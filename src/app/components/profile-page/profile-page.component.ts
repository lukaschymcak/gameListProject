import { Component } from '@angular/core';
import { UserModel } from '../../models/UserModel';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile-page',
  imports: [CommonModule, FormsModule],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.css',
})
export class ProfilePageComponent {
  editingInfo = false;
  newDescription = '';
  userInfo: UserModel = {
    id: 1,
    username: 'test_user',
    password: '',
    favourites: [],
    description: '',
  };
  constructor() {}

  editInfo() {
    this.editingInfo = true;
  }

  saveInfo() {
    this.editingInfo = false;
    this.userInfo.description = this.newDescription;
  }
}
