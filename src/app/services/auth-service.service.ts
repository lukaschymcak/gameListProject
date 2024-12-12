import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserModel } from '../models/UserModel';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
  private baseUrl = 'http://localhost:5000';
  constructor(private httpService: HttpClient) { }


  registerUser(newUser: UserModel) {
    return this.httpService.post(`${this.baseUrl}/register`, newUser);
  }
}
