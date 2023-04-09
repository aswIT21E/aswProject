import type { Request, Response } from 'express';

import { UserRepository } from '~/domain/repositories';
import { IssueRepository } from '~/domain/repositories/issue-repository';

export async function addWatchers(req: Request, res: Response): Promise<void> {
  const issueID = req.params.id;
  const userIds = req.body.users;
  try {
    const issue = await IssueRepository.getIssueById(issueID);

    const newWatchers = issue.watchers;

    if (issue) {
      for (const userId of userIds) {
        const userInstance = await UserRepository.getUserById(userId);

        if (!userInstance) {
          res.status(404).json({
            message: `User ${userId} not found`,
          });
          return;
        }

        if (newWatchers.some((watcherId) => watcherId.id === userId)) {
          res.status(400).json({
            message: `User ${userId} is already a watcher of this issue`,
          });
          return;
        }

        newWatchers.push(userId);
      }

      issue.updateWatchers(newWatchers);
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
