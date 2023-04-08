import type { Request, Response } from 'express';

import { Issue } from '~/domain/entities';
import { IssueRepository } from '~/domain/repositories/issue-repository';

export async function unlockIssue(req: Request, res: Response): Promise<void> {
  const issueID = req.params.id;
  try {
    const issue = await IssueRepository.getIssueById(issueID);
    const newIssue = new Issue(
      issue.id,
      issue.numberIssue,
      issue.subject,
      issue.description,
      issue.creator,
      issue.status,
      issue.type,
      issue.severity,
      issue.priority,
      issue.comments,
    );
    if (issue) {
      newIssue.unlockIssue();
      IssueRepository.updateIssue(newIssue);
      res.status(200).json({
        message: 'Issue unlocked successfully',
        newIssue,
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
