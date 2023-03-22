import type { IIssue } from "./issue.interface";

export class Issue implements IIssue {
  public id: string;
  public subject: string;
  public description: string;
  public creator: string; // FK a IUser

  constructor(
    id: string,
    subject: string,
    description: string,
    creator: string
  ) {
    this.id = id;
    this.subject = subject;
    this.description = description;
    this.creator = creator;
  }
}
