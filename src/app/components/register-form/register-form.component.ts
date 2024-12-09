import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOption } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-register-form',
  imports: [MatFormFieldModule, MatOption, MatSelectModule],
  templateUrl: './register-form.component.html',
  styleUrl: './register-form.component.css',
})
export class RegisterFormComponent implements OnInit {
  registerForm: FormGroup = new FormGroup({});
  constructor() {}

  ngOnInit(): void {
    this.registerForm = new FormGroup({
      username: new FormControl('username', [Validators.required]),
      email: new FormControl('email', [Validators.required, Validators.email]), // email validation
      password: new FormControl('password', [
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
