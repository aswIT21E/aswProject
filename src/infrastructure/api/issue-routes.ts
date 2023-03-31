
import type { Request, Response } from 'express';
import express from 'express';

import { IssueController } from '~/application';
import { createIssueDto } from '~/infrastructure/dtos';

export const issueRouter = express.Router();

issueRouter.get('/test-issue', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'application/json');
  res.status(200);
  res.json({
    hello: 'you',
  });
});

issueRouter.post('/issues/create', createIssueDto, IssueController.createIssue);

issueRouter.get('/issues', IssueController.getAllIssues);

issueRouter.get('/issues/newIssue', IssueController.getNewIssuePage);

issueRouter.get('/issues/stylesheets/addIssue.css',IssueController.getNewIssuePageCss,);

issueRouter.get('/issue', IssueController.getIssuePage);

issueRouter.get('/issue/:id', IssueController.getIndividualIssuePage);

issueRouter.get('/stylesheets/searchIssue.css', IssueController.getSearchIssueCss,);

issueRouter.get( '/stylesheets/previewIssue.css',IssueController.getIssuePageCss,);
