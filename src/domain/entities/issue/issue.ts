import { IComment } from "../comment";
import type { IIssue } from "./issue.interface";

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
  public asigned_to?: string;
  public tags?: string[];
  
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
    asigned_to?: string,
    tags?: string[],
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
    this.asigned_to = asigned_to;
    this.tags = tags;
  }

  
}
