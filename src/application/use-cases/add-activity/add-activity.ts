import { Request } from 'express';
import type { IIssue } from '~/domain/entities';
import { Activity, ActivityModel } from '~/domain/entities/activity';
import { getActor } from '~/utils';

export type Action =
  | 'addWatchers'
  | 'removeWatchers'
  | 'editIssue'
  | 'addComment'
  | 'assignIssue'
  | 'addAttachment'
  | 'lockIssue'
  | 'unlockIssue';

type ActionMessageMapType = {
  [key in Action]: (username: string, issueId: string) => string;
};

const actionMessagesMap: ActionMessageMapType = {
  addAttachment: (username: string, issueId: string) =>
    `${username} has added an attachment to issue ${issueId}`,
  removeWatchers: (username: string, issueId: string) =>
    `${username} has removed some watchers from issue ${issueId}`,
  editIssue: (username: string, issueId: string) =>
    `${username} has edited issue ${issueId}`,
  addComment: (username: string, issueId: string) =>
    `${username} has added a comment to issue ${issueId}`,
  assignIssue: (username: string, issueId: string) =>
    `${username} has assigned issue ${issueId}`,
  addWatchers: (username: string, issueId: string) =>
    `${username} has added watchers to issue ${issueId}`,
  lockIssue: (username: string, issueId: string) =>
    `${username} has locked issue ${issueId}`,
  unlockIssue: (username: string, issueId: string) =>
    `${username} has unlocked issue ${issueId}`,
};

export async function addActivity(
  req: Request,
  issue: IIssue,
  actionType: Action,
) {
  const actor = await getActor(req);
  const message = actionMessagesMap[actionType](
    actor.username,
    issue.id.toString(),
  );
  const activityDocument = await ActivityModel.create({
    actor: actor.id,
    message,
  });

  const newActivity = new Activity(activityDocument.id, actor, message);
  issue.addActivity(newActivity);
}
