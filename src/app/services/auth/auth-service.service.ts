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
  private baseUrl = 'http://localhost:3000/api';
  isLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    this.hasToken()
  );

  isLogged$ = this.isLoggedIn.asObservable();
  constructor(
    private httpService: HttpClient,
    private router: Router,
    private toast: ToastService
  ) {}

  logUserIn(credentials: { username: string; password: string }) {
    return this.httpService.post(`${this.baseUrl}/login`, credentials).pipe(
      map((res: any) => {
        console.log("logging in ", res);
        this.isLoggedIn.next(true);
        localStorage.setItem('token', res.token);
        this.router.navigate(['/profile']);
        this.toast.successToast('You are now logged in', 'X', 5000);
      })
    );
  }

  private hasToken() {
    return !!localStorage.getItem('token');
  }
  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('No token found');
      return false;
    }

    try {
      this.httpService.get(`${this.baseUrl}/verifyToken`).subscribe({
        next: (res) => {
          return res;
        },
        error: (err) => {
          console.log(err);
          this.logUserOut();
          this.router.navigate(['/login']);
          console.log('Token expired');
        },
      });
      return true;
    } catch (error) {
      console.log('Error decoding token');
      this.logUserOut();
      this.router.navigate(['/login']);
      return false;
    }
  }

  logUserOut() {
    this.isLoggedIn.next(false);
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
    alert('You are now logged out');
  }
}
function jwt_decode(token: string): any {
  throw new Error('Function not implemented.');
}
