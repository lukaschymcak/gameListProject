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
  constructor() {}

  ngOnInit(): void {
    this.registerForm = new FormGroup({
      username: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.required, Validators.email]), // email validation
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(6),
      ]), // password validation
    });
  }

  passwordValidator(control: AbstractControl): null | ValidationErrors {
    const password = control.value;
    const analysis = zxcvbn(password);
    if (password?.pristine) {
      return null;
    }
    return null;
  }
}
function zxcvbn(password: any) {
  throw new Error('Function not implemented.');
}
