import type { Request, Response } from 'express';

import type { IIssue } from '~/domain/entities/issue';
import { IssueRepository } from '~/domain/repositories/issue-repository/issue-repository';

export class IssueController {
  public static async createIssue(req: Request, res: Response): Promise<void> {
    try {
      const issue: IIssue = req.body;
      await IssueRepository.addIssue(issue);
      res.status(200);
      res.json({
        message: 'issue created',
      });
    } catch (e) {
      res.status(500);
      res.json({
        error: e,
      });
    }
  }

  public static async getAllIssues(
    _req: Request,
    res: Response,
  ): Promise<void> {
    try {
      const issues: IIssue[] = await IssueRepository.getAllIssues();
      res.status(200);
      res.json({
        issues,
      });
    } catch (e) {
      res.status(500);
      res.json({
        error: e,
      });
    }
  }

  public static async getNewIssuePage(
    _req: Request,
    res: Response,
  ): Promise<void> {
    res.sendFile('views/addIssue.html', { root: 'src' });
  }

  public static async getIssuePage(
    _req: Request,
    res: Response,
  ): Promise<void> {
    res.sendFile('/public/views/issue.html', { root: 'src' });
  }
}
