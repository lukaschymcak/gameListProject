import { Component, OnInit } from '@angular/core';
import { UserDataService } from '../../services/userData/user-data.service';
import { UserModel } from '../../models/UserModel';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-users-page',
  imports: [RouterLink],
  templateUrl: './users-page.component.html',
  styleUrl: './users-page.component.css'
})
export class UsersPageComponent implements OnInit {

  constructor(private userService: UserDataService) {

  
    
   }
  user : UserModel | undefined;
  users: UserModel[] = [];
  ngOnInit(): void {
    this.userService.getUsers().subscribe(users => {
      this.users = users;
    });
  }
}
 