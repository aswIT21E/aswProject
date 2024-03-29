import type { Request, Response } from 'express';

import { IssueRepository } from '~/domain/repositories/issue-repository';

import { addActivity } from '../add-activity';

export async function lockIssue(req: Request, res: Response): Promise<void> {
  const issueID = req.params.id;
  try {
    const issue = await IssueRepository.getIssueById(issueID);
    if (issue) {
      issue.lockIssue(req.body.reason);
        await addActivity(req, issue, 'lockIssue');
      await IssueRepository.updateIssue(issue);
      res.status(200).json({
        message: `Issue locked successfully because the following reason: ${req.body.reason}`,
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
