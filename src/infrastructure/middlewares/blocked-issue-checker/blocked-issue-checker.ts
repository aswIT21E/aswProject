import type { NextFunction, Request, Response } from 'express';

import { IssueRepository } from '~/domain/repositories';

export async function checkBlockedIssue(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const issueId = req.params.id;
  const issue = await IssueRepository.getIssueById(issueId);
  if (issue.locked) {
    res.status(403).json({
      message: `Can't perform action on issue ${issueId} as it is locked`,
    });
  } else next();
}
