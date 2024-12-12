export interface UserModel {
  id: number | null;
  username: string;
  description: string | null;
  password: string;
  favourites: [];
}
