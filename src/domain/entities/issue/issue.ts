import type { IComment } from '../comment';
import type { IUser } from '../user';

import type { IIssue } from './issue.interface';

export class Issue implements IIssue {
  public id: string;
  public numberIssue: number;
  public subject: string;
  public description: string;
  public creator: IUser;
  public status: string;
  public type: string;
  public severity: string;
  public priority: string;
  public date: string;
  public comments?: IComment[];
  public asigned_to?: string;
  public tags?: string[];
  public locked: boolean;
  public watchers: IUser[];

  constructor(
    id: string,
    numberIssue: number,
    subject: string,
    description: string,
    creator: IUser,
    status: string,
    type: string,
    severity: string,
    priority: string,
    comments: IComment[],
    asigned_to?: string,
    tags?: string[],
    watchers?: IUser[],
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
    this.locked = false;
    this.watchers = watchers;
  }

  public lockIssue(): void {
    this.locked = true;
  }

  public unlockIssue(): void {
    this.locked = false;
  }

  public updateWatchers(watchers: IUser[]): void {
    this.watchers = watchers;
  }

  public get watchersIds(): string[] {
    const ids = this.watchers.map((watcher) => watcher.id);
    return ids;
  }
}
