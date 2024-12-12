import { Component, TemplateRef, ViewChild } from '@angular/core';
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
import { UserModel } from '../../models/UserModel';
import { Router } from '@angular/router';

const successMessage = 'User logged in';
const errorMessage = 'User not logged in';

@Component({
  selector: 'app-login-form',
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatCardModule,
    MatInput,
    MatButton,
  ],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.css',
})
export class LoginFormComponent {
  @ViewChild('responseMessageTemplate')
  responseMessageTemplate!: TemplateRef<any>;
  loginForm: FormGroup = new FormGroup({});

  credentials = { username: '', password: '' };

  constructor(
    private authService: AuthServiceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      username: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required]),
    });
  }

  logIn() {
    const credentials = {
      username: this.loginForm.get('username')?.value,
      password: this.loginForm.get('password')?.value,
    };

    this.authService.logUserIn(credentials).subscribe({
      complete: () => {
        console.log('User logged in');
        this.router.navigate(['/profile']);
      },
      error: () => {},
    });
  }
}
