import { IUser } from '../user';
import type { IComment } from './comment.interface';

export class Comment implements IComment {
  public _id: string;
  public content: string;
  public author: IUser;
  public date: string;

  constructor(_id: string, content: string, author: IUser, date: string) {
    this._id = _id;
    this.content = content;
    this.author = author;
    this.date = date;
  }
}
