import { Routes } from '@angular/router';
import { RegisterFormComponent } from './components/register-form/register-form.component';
import { ProfilePageComponent } from './components/profile-page/profile-page.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { AuthGuard } from './services/authGuard/auth-guard.service';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'register', component: RegisterFormComponent },
  { path: 'login', component: LoginFormComponent },
  {
    path: 'profile',
    component: ProfilePageComponent,
    canActivate: [AuthGuard],
  },
];
