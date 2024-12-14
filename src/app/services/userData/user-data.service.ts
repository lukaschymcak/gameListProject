import { Injectable } from '@angular/core';
import { AuthServiceService } from '../auth/auth-service.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { UserModel } from '../../models/UserModel';
import { ProfileGameModel } from '../../models/ProfileGameModel';

@Injectable({
  providedIn: 'root',
})
export class UserDataService {
  baseUrl = 'http://localhost:3000/api';
  userName = '';
  headers = new HttpHeaders().set(
    'Authorization',
    `Bearer ${localStorage.getItem('token')}`
  );

  constructor(private auth: AuthServiceService, private http: HttpClient) {}
  getUserData() {
    return this.http.get<UserModel>(`${this.baseUrl}/user`);
  }

  updateUserDescription(description: string) {
    return this.http.put<UserModel>(`${this.baseUrl}/updateUserDescription`, {
      description: description,
    });
  }

  searchForGame(gameName: string) {
    return this.http.post<ProfileGameModel>(`${this.baseUrl}/search`, {
      title: gameName,
    });
  }
}
