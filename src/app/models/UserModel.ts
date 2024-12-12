export interface UserModel {
  id: number | null;
  username: string;
  email: string;
  description: string | null;
  password: string;
  favourites: [];
}
