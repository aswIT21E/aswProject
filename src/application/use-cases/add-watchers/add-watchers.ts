import type { Request, Response } from 'express';

import type { IUser } from '~/domain/entities';
import { Activity, ActivityModel } from '~/domain/entities/activity';
import { UserRepository } from '~/domain/repositories';
import { IssueRepository } from '~/domain/repositories/issue-repository';
import { getActor } from '~/utils';

export async function addWatchers(req: Request, res: Response): Promise<void> {
  const issueID = req.params.id;
  const userIds = req.body.users;
  try {
    const issue = await IssueRepository.getIssueById(issueID);

    const oldWatchers: IUser[] = issue.watchers;
    const newWatchers: IUser[] = [];

    if (issue) {
      for (const userId of userIds) {
        const userInstance = await UserRepository.getUserById(userId);
        if (!userInstance) {
          res.status(404).json({
            message: `User ${userId} not found`,
          });
          return;
        }

        if (oldWatchers.some((watcher) => watcher.id === userId)) {
          res.status(400).json({
            message: `User ${userId} is already a watcher of this issue`,
          });
          return;
        }
        newWatchers.push(userInstance);
      }

      const creator = await getActor(req);
      const message = `${creator.username} has added ${newWatchers} as watchers`;
      const activityDocument = await ActivityModel.create({
        actor: creator.id,
        message,
      });
      const newActivity = new Activity(activityDocument._id, creator, message);

      issue.updateWatchers([...oldWatchers, ...newWatchers]);
      issue.addActivity(newActivity);

      await IssueRepository.updateIssue(issue);

      res.status(200).json({
        message: 'Watchers added successfully',
        issue,
      });
    } else {
      res.status(404).json({
        message: `Issue ${issueID} not found`,
      });
    }
  } catch (e) {
    res.status(500);
    res.json({
      error: e,
    });
  }
}
