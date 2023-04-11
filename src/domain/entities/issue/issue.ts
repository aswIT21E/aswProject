import { MongoId } from '~/types/types';
import type { IActivity } from '../activity/activity.interface';
import type { IComment } from '../comment';
import type { IUser } from '../user';

import type { IIssue } from './issue.interface';

export class Issue implements IIssue {
  public id: MongoId;
  public numberIssue: number;
  public subject: string;
  public description: string;
  public creator: IUser;
  public status: string;
  public severity: string;
  public type: string;
  public date: string;
  public priority: string;
  public comments?: IComment[];
  public locked: boolean;
  public watchers: IUser[];
  public activity: IActivity[];

  constructor(
    id: MongoId,
    numberIssue: number,
    subject: string,
    description: string,
    creator: IUser,
    status: string,
    severity: string,
    type: string,
    date: string,
    priority: string,
    comments: IComment[],
    watchers?: IUser[],
    activity?: IActivity[],
  ) {
    this.id = id;
    this.numberIssue = numberIssue;
    this.subject = subject;
    this.description = description;
    this.creator = creator;
    this.status = status;
    this.severity = severity;
    this.type = type;
    this.date = date;
    this.priority = priority;
    this.comments = comments;
    this.locked = false;
    this.watchers = watchers;
    this.activity = activity;
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

  public get watchersIds(): MongoId[] {
    const ids = this.watchers.map((watcher) => watcher.id);
    return ids;
  }

  public get activitiesIds(): MongoId[] {
    const ids = this.activity.map((watcher) => watcher.id);
    return ids;
  }

  public addActivity(newActivity: IActivity): void {
    const newActivities = [...this.activity, newActivity];
    this.activity = newActivities;
  }
}
