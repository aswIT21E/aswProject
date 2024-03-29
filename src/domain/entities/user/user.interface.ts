import type { MongoId } from '~/types/types';

export interface IUser {
  id: MongoId;
  email: string;
  name: string;
  username: string;
  password: string;
  bio: string;
  profilePicture?: string;

  updateProfilePic?: (link: string) => void;
}
