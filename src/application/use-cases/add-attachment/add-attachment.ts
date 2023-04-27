import type { Request, Response } from 'express';

import { IssueRepository } from '~/domain/repositories/issue-repository';
import { S3Service } from '~/infrastructure/services';

import { addActivity } from '../add-activity';

export async function addAttachment(
  req: Request,
  res: Response,
): Promise<void> {
  const issueID = req.params.id;
  const file = req.files.file;
  try {
    const issue = await IssueRepository.getIssueById(issueID);

    if (issue) {
      const uploadService = new S3Service();
      const result = await uploadService.uploadFile(file);
      issue.addAttachment(result.Location);
      await addActivity(req, issue, 'addAttachment');
      await IssueRepository.updateIssue(issue);

      res.status(200).json({
        message: 'Attachment added successfully',
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
