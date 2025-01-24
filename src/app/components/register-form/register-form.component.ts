import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { AuthServiceService } from '../../services/auth/auth-service.service';
import { UserDataService } from '../../services/userData/user-data.service';
import { UserModel } from '../../models/UserModel';
@Component({
  selector: 'app-register-form',
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatCardModule,
    MatInput,
    MatButton,
  ],
  templateUrl: './register-form.component.html',
  styleUrl: './register-form.component.css',
})
export class RegisterFormComponent implements OnInit {
  registerForm: FormGroup = new FormGroup({});
  newUser: UserModel = {
    id: null,
    _id: 0,
    username: 'aaa',
    description: null,
    password: 'aaa',
    favoriteGames: [],
    dislikedGames: [],
    currentlyPlaying: [],
    finishedGames: [],
    planOnPlaying: [],
  };
  constructor(
    private authService: AuthServiceService,
    private userService: UserDataService
  ) {}

  ngOnInit(): void {
    this.registerForm = new FormGroup({
      username: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(6),
      ]), // password validation
    });
  }

  register() {
    const newUser: UserModel = {
      id: null,
      _id: 0,
      username: this.registerForm.get('username')?.value,
      description: null,
      password: this.registerForm.get('password')?.value,
      favoriteGames: [],
      dislikedGames: [],
      currentlyPlaying: [],
      finishedGames: [],
      planOnPlaying: [],
    };

    this.userService.registerUser(newUser);
  }
}
