import type { IComment } from './comment.interface';

export class Comment implements IComment {
  public _id: string;
  public numberIssue: string;
  public content: string;
  public author: string;
  public date: string;

  constructor(
    _id: string,
    numberIssue: string,
    content: string,
    author: string,
    date: string,
  ) {
    this._id = _id;
    this.numberIssue = numberIssue;
    this.content = content;
    this.author = author;
    this.date = date;
  }
}
