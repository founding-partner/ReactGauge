export type UserProfile = {
  mode: 'github' | 'guest';
  login: string;
  name?: string;
  avatarUrl?: string;
  answered: number;
  correct: number;
  streak: number;
  completion: number;
};
