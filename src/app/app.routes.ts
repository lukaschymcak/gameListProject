import { Routes } from '@angular/router';
import { RegisterFormComponent } from './components/register-form/register-form.component';
import { ProfilePageComponent } from './components/profile-page/profile-page.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'register', component: RegisterFormComponent },
  { path: 'profile', component: ProfilePageComponent },
];
