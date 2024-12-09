import { Routes } from '@angular/router';
import { RegisterFormComponent } from './components/register-form/register-form.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'register', component: RegisterFormComponent },
];
