import type { IIssue, IUser } from '~/domain/entities';
import { Activity, ActivityModel } from '~/domain/entities/activity';
import { IssueRepository } from '~/domain/repositories';

export async function addActivity(
  actor: IUser,
  issue: IIssue,
  message: string,
) {
  const activityDocument = await ActivityModel.create({
    actor: actor.id,
    message,
  });
  const newActivity = new Activity(activityDocument.id, actor, message);
  issue.addActivity(newActivity);
  await IssueRepository.updateIssue(issue);
}
