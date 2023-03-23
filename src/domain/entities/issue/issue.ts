import type { IIssue } from "./issue.interface";

export class Issue implements IIssue {
  public id: string;
  public subject: string;
  public description: string;
  public creator: string; // FK a IUser
  public status: string;
  public type: string;
  public severity: string;
  public priority: string;

  constructor(
    id: string,
    subject: string,
    description: string,
    creator: string,
    status: string,
    type: string,
    severity: string,
    priority: string,
  ) {
    this.id = id;
    this.subject = subject;
    this.description = description;
    this.creator = creator;
    this.status = status;
    this.type = type;
    this.severity = severity;
    this.priority = priority;
  }
}
