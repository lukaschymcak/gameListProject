import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserModel } from '../../models/UserModel';
import { BehaviorSubject, map } from 'rxjs';
import { Router } from '@angular/router';
import { ToastService } from '../../components/shared/toast/toast.service';

@Injectable({
  providedIn: 'root',
})
export class AuthServiceService {
  private baseUrl = 'http://localhost:5001';
  isLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    this.hasToken()
  );

  isLogged$ = this.isLoggedIn.asObservable();
  constructor(
    private httpService: HttpClient,
    private router: Router,
    private toast: ToastService
  ) {}

  registerUser(newUser: UserModel) {
    return this.httpService.post(`${this.baseUrl}/register`, newUser);
  }

  logUserIn(credentials: { username: string; password: string }) {
    return this.httpService.post(`${this.baseUrl}/login`, credentials).pipe(
      map((res: any) => {
        this.isLoggedIn.next(true);
        localStorage.setItem('token', res.token);
        this.router.navigate(['/profile']);
        this.toast.successToast('You are now logged in', 'X', 100000);
      })
    );
  }

  private hasToken() {
    return !!localStorage.getItem('token');
  }

  logUserOut() {
    this.isLoggedIn.next(false);
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
    alert('You are now logged out');
  }
}