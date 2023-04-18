import type { IUser } from '../user';

export interface IComment {
  _id: string;
  author: IUser;
  content: string;
  date: string;
}
