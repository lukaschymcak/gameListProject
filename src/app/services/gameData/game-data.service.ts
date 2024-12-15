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

  getCoverImage(gameId: number) {
    return this.http.post<CoverModel>(`${this.baseUrl}/getCover`, {
      id: gameId,
    });
  }

  addToFavorites(game: ProfileGameModel) {
    return this.http.put<UserModel>(`${this.baseUrl}/addToFavorites`, game);
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

  getFavorites(): Observable<ProfileGameModel[]> {
    return this.http.get<ProfileGameModel[]>(
      `${this.baseUrl}/getFavoriteGames`
    );
  }

  getDisliked(): Observable<ProfileGameModel[]> {
    return this.http.get<ProfileGameModel[]>(
      `${this.baseUrl}/getDislikedGames`
    );
  }

  getCompleted(): Observable<ProfileGameModel[]> {
    return this.http.get<ProfileGameModel[]>(
      `${this.baseUrl}/getFinishedGames`
    );
  }

  getPlaying(): Observable<ProfileGameModel[]> {
    return this.http.get<ProfileGameModel[]>(
      `${this.baseUrl}/getCurrentlyPlayingGames`
    );
  }

  getPlanToPlay(): Observable<ProfileGameModel[]> {
    return this.http.get<ProfileGameModel[]>(
      `${this.baseUrl}/getPlanToPlayGames`
    );
  }

  updateGame(game: ProfileGameModel) {
    return this.http.put<ProfileGameModel>(`${this.baseUrl}/updateGame`, game);
  }
}
