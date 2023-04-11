import type { Request, Response } from 'express';

import { UserRepository } from '~/domain/repositories';
import { IssueRepository } from '~/domain/repositories/issue-repository';

export async function removeWatchers(
  req: Request,
  res: Response,
): Promise<void> {
  const issueID = req.params.id;
  const userIds = req.body.users;
  try {
    const issue = await IssueRepository.getIssueById(issueID);

    const newWatchers = issue.watchers;
    console.log('CURRENT WATCHERS', issue.watchers);

    if (issue) {
      for (const userId of userIds) {
        const userInstance = await UserRepository.getUserById(userId);

        if (!userInstance) {
          res.status(404).json({
            message: `User ${userId} not found`,
          });
          return;
        }
        const index = newWatchers.findIndex((watcher) => watcher.id === userId);

        if (index === -1) {
          res.status(400).json({
            message: `User ${userId} is not a watcher`,
          });
          return;
        }

        newWatchers.splice(index, 1);
      }

      issue.updateWatchers(newWatchers);
      await IssueRepository.updateIssue(issue);

      res.status(200).json({
        message: 'Watchers removed successfully',
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
