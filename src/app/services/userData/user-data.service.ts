import { Injectable } from '@angular/core';
import { AuthServiceService } from '../auth/auth-service.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, map, Observable, of, tap } from 'rxjs';
import { UserModel } from '../../models/UserModel';
import { ProfileGameModel } from '../../models/ProfileGameModel';

@Injectable({
  providedIn: 'root',
})
export class UserDataService {
  baseUrl = 'http://localhost:3000/api';
  currentUserSubject: UserModel | null = null;

  constructor(private auth: AuthServiceService, private http: HttpClient) {}

  registerUser(newUser: UserModel) {
    return this.http.post<UserModel>(`${this.baseUrl}/register`, newUser).pipe(
      tap((user) => {
        this.currentUserSubject = user;
      })
    );
  }
  getUserData() {
    return this.http.get<UserModel>(`${this.baseUrl}/user`).pipe(
      tap((user) => {
        this.currentUserSubject = user;
      })
    );
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
}
