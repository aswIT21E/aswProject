import type { Request, Response } from 'express';

import { IssueRepository } from '~/domain/repositories/issue-repository';

import { addActivity } from '../add-activity';

export async function updateDeadline(
  req: Request,
  res: Response,
): Promise<void> {
  const issueID = req.params.id;
  const deadline = req.body.deadline;
  console.log(deadline);
  try {
    const issue = await IssueRepository.getIssueById(issueID);
    if (issue) {
      issue.updateDeadline(deadline);
      await addActivity(req, issue, 'updateDeadline');
      await IssueRepository.updateIssue(issue);
      res.status(200).json({
        message: 'Deadline added successfully',
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
