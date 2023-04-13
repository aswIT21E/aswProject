import type { Request, Response } from 'express';
import { IssueRepository } from '~/domain/repositories';
import { addActivity } from '../add-activity';

export async function removeAttachment(
  req: Request,
  res: Response,
): Promise<void> {
  const issueID = req.params.id;
  const attachmentIndex = req.body.attachmentIndex;
  try {
    const issue = await IssueRepository.getIssueById(issueID);

    if (issue) {
      issue.removeAttachment(attachmentIndex);
      await addActivity(req, issue, 'removeAttachment');
      await IssueRepository.updateIssue(issue);

      res.status(200).json({
        message: 'Attachment removed successfully',
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
