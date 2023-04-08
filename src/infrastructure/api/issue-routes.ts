import express from 'express';

import { IssueController, lockIssue } from '~/application';
import { createIssueDto } from '~/infrastructure/dtos';

export const issueRouter = express.Router();

issueRouter.post('/issues/create', createIssueDto, IssueController.createIssue);

issueRouter.post('/issue/:id/new-comment', IssueController.createComment);

issueRouter.post('/issue/:id/editIssue', IssueController.modifyIssue);

issueRouter.get('/issues', IssueController.getAllIssues);

issueRouter.get('/issues/newIssue', IssueController.getNewIssuePage);

issueRouter.get(
  '/issues/stylesheets/addIssue.css',
  IssueController.getNewIssuePageCss,
);

issueRouter.get('/issue', IssueController.getIssuePage);

issueRouter.get('/issue/:id', IssueController.getIssue);

issueRouter.get(
  '/stylesheets/searchIssue.css',
  IssueController.getSearchIssueCss,
);

issueRouter.get(
  '/stylesheets/previewIssue.css',
  IssueController.getIssuePageCss,
);

issueRouter.get(
  '/stylesheets/viewIssue.css',
  IssueController.getViewIssuePageCss,
);

issueRouter.put('/issues/:id/lock-issue', lockIssue);
