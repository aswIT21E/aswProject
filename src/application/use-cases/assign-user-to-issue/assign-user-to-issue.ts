import type { Request, Response } from 'express';
import { IssueRepository, UserRepository } from '~/domain/repositories';
import { addActivity } from '../add-activity';

export async function assignUserToIssue(req: Request, res: Response) {
  try {
    const issueId = req.params.id;
    const userId = req.body.userId;

    const issue = await IssueRepository.getIssueById(issueId);
    const user = await UserRepository.getUserById(userId);

    issue.assignUser(user);
    addActivity(req, issue, 'assignIssue');

    await IssueRepository.updateIssue(issue);

    res.status(200).json({
      message: 'Successfully assigned user to issue',
      issue,
    });
  } catch (e) {
    res.status(500).json({
      error: e,
    });
  }
}
