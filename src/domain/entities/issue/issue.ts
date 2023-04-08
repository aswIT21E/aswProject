import { IComment } from '../comment';
import type { IIssue } from './issue.interface';

export class Issue implements IIssue {
  public id: string;
  public numberIssue: number;
  public subject: string;
  public description: string;
  public creator: string; // FK a IUser
  public status: string;
  public type: string;
  public severity: string;
  public priority: string;
  public date: string;
  public comments?: IComment[];
  public locked: boolean;

  constructor(
    id: string,
    numberIssue: number,
    subject: string,
    description: string,
    creator: string,
    status: string,
    type: string,
    severity: string,
    priority: string,
    comments: IComment[],
  ) {
    this.id = id;
    this.numberIssue = numberIssue;
    this.subject = subject;
    this.description = description;
    this.creator = creator;
    this.status = status;
    this.type = type;
    this.severity = severity;
    this.priority = priority;
    this.comments = comments;
    this.locked = false;
  }
}
