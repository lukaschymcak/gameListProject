export interface ProfileGameModel {
  id: number;
  _id: number;
  title: string;
  state: string;
  rating: number;
  platform: string;
  cover: number;
  image: string;
  isFavorite?: boolean;
  isDisliked?: boolean;
  isCompleted?: boolean;
  isPlaying?: boolean;
  isPlanToPlay?: boolean;
}
