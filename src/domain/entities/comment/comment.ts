import type { IComment } from "./comment.interface";

export class Comment implements IComment {
  public id: string;
  public numberIssue: number;
  public content: string;
  public author: string;
  public date: string;

  constructor(
    id: string,
    numberIssue: number,
    content: string,
    author: string,
  ) {
    this.id = id;
    this.numberIssue = numberIssue;
    this.content = content;
    this.author = author;
  }
}
