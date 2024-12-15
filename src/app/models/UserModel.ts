export interface UserModel {
  id: number | null;
  _id: number;
  username: string;
  description: string | null;
  password: string;
  favoriteGames: [];
  dislikedGames: [];
  currentlyPlaying: [];
  finishedGames: [];
  planOnPlaying: [];
}
