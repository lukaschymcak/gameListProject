import { Injectable } from '@angular/core';
import { AuthServiceService } from '../auth/auth-service.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, map, Observable, of, tap } from 'rxjs';
import { UserModel } from '../../models/UserModel';
import { ProfileGameModel } from '../../models/ProfileGameModel';
import { ToastService } from '../../components/shared/toast/toast.service';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root',
})
export class UserDataService {
  baseUrl = 'http://localhost:3000/api';
  currentUserSubject: UserModel | null = null;

  constructor(
    private auth: AuthServiceService,
    private http: HttpClient,
    private toast: ToastService,
    private router: Router
  ) {}

  registerUser(newUser: UserModel) {
    return this.http
      .post<UserModel>(`${this.baseUrl}/register`, newUser)
      .subscribe({
        next: (res) => {
          this.currentUserSubject = res;
        },
        error: (err) => {
          switch (err.status) {
            case 409:
              this.toast.errorToast('Username already exists', 'X', 5000);
              break;
            default:
              this.toast.errorToast('An error occurred', 'X', 5000);
              break;
          }
        },
        complete: () => {
          this.toast.successToast('User registered', 'X', 5000);
          this.router.navigate(['/login']);
        },
      });
  }
  getUserData() {
    return this.http.get<UserModel>(`${this.baseUrl}/user`);
  }

  getUserById(id: string): Observable<UserModel> {
    return this.http.post<UserModel>(`${this.baseUrl}/getUserById`, { id });
  }

  updateUserDescription(user: UserModel): Observable<UserModel> {
    return this.http.put<UserModel>(`${this.baseUrl}/updateUser`, user).pipe(
      tap((user) => {
        this.currentUserSubject = user;
      })
    );
  }

  refreshUser(): Observable<UserModel> {
    return this.http.get<UserModel>(`${this.baseUrl}/user`).pipe(
      tap((user) => {
        this.currentUserSubject = user;
      })
    );
  }

  getUsers(): Observable<UserModel[]> {
    return this.http.get<UserModel[]>(`${this.baseUrl}/users`);
  }
}
