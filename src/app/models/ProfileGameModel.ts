export interface ProfileGameModel {
  id: number;
  image: string;
  title: string;
  state: string;
  platform: string;
}

export const mockProfileGameModel: ProfileGameModel[] = [
  {
    id: 1,
    image:
      'https://www.gamereactor.es/media/61/assassinscreedvalhalla_3173669b.jpg',
    title: "Assassin's Creed Valhalla",
    state: 'Playing',
    platform: 'PS5',
  },
  {
    id: 2,
    image:
      'https://www.gamereactor.es/media/61/assassinscreedvalhalla_3173669b.jpg',
    title: "Assassin's Creed Valhalla",
    state: 'Playing',
    platform: 'PS5',
  },
  {
    id: 3,
    image:
      'https://www.gamereactor.es/media/61/assassinscreedvalhalla_3173669b.jpg',
    title: "Assassin's Creed Valhalla",
    state: 'Playing',
    platform: 'PS5',
  },
];
