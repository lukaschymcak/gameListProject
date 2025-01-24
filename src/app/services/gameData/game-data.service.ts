import { Injectable } from '@angular/core';
import { ProfileGameModel } from '../../models/ProfileGameModel';
import { CoverModel } from '../../models/CoverModel';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserModel } from '../../models/UserModel';

@Injectable({
  providedIn: 'root',
})
export class GameDataService {
  baseUrl = 'http://localhost:3000/api';
  constructor(private http: HttpClient) {}

  searchForGame(gameName: string): Observable<ProfileGameModel[]> {
    return this.http.post<ProfileGameModel[]>(`${this.baseUrl}/search`, {
      title: gameName,
    });
  }
  removeGame(game: ProfileGameModel) {
    return this.http.put<ProfileGameModel>(`${this.baseUrl}/removeGame`, game);
  }
  getCoverImage(gameId: number) {
    return this.http.post<CoverModel>(`${this.baseUrl}/getCover`, {
      id: gameId,
    });
  }

  addGame(game: ProfileGameModel) {
    return this.http.put<ProfileGameModel>(`${this.baseUrl}/addGame`, game);
  }

  addToFavorites(game: ProfileGameModel) {
    return this.http.put<UserModel>(`${this.baseUrl}/addToFavorites`, game);
  }

  addToDisliked(game: ProfileGameModel) {
    return this.http.put<UserModel>(`${this.baseUrl}/addToDisliked`, game);
  }
  getGameById(gameId: number) {
    return this.http.post<ProfileGameModel>(`${this.baseUrl}/getGameById`, {
      id: gameId,
    });
  }
  getProfileGameById(gameId: number) {
    return this.http.post<ProfileGameModel>(
      `${this.baseUrl}/getProfileGameById`,
      {
        id: gameId,
      }
    );
  }

  getFavorites(): Observable<number[]> {
    return this.http.get<number[]>(`${this.baseUrl}/getFavoriteGames`);
  }

  getDisliked(): Observable<number[]> {
    return this.http.get<number[]>(`${this.baseUrl}/getDislikedGames`);
  }

  getCompleted(): Observable<number[]> {
    return this.http.get<number[]>(`${this.baseUrl}/getFinishedGames`);
  }

  getPlaying(): Observable<number[]> {
    return this.http.get<number[]>(`${this.baseUrl}/getPlayingGames`);
  }

  getPlanToPlay(): Observable<number[]> {
    return this.http.get<number[]>(`${this.baseUrl}/getPlanOnPlayingGames`);
  }

  getFinishedGames(): Observable<number[]> {
    return this.http.get<number[]>(`${this.baseUrl}/getFinishedGames`);
  }

  updateGame(game: ProfileGameModel) {
    return this.http.put<ProfileGameModel>(`${this.baseUrl}/updateGame`, game);
  }

  moveGame(game: ProfileGameModel) {
    return this.http.put<ProfileGameModel>(`${this.baseUrl}/moveGame`, game);
  }
}
