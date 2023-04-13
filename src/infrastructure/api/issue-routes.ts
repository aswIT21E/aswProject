import express from 'express';

import {
  IssueController,
  lockIssue,
  addWatchers,
  unlockIssue,
  removeWatchers,
} from '~/application';
import { addWatchersDto, createIssueDto } from '~/infrastructure/dtos';

import { removeWatchersDto } from '../dtos/remove-watchers.dto';
import { authMiddleware } from '../middlewares';

export const issueRouter = express.Router();

issueRouter.post(
  '/issues/create',
  authMiddleware,
  createIssueDto,
  IssueController.createIssue,
);

issueRouter.post('/issue/:id/new-comment', IssueController.createComment);

issueRouter.post('/issue/:id/editIssue', IssueController.modifyIssue);

issueRouter.post('/issue/:id/modifyIssue', IssueController.modifyIssue);

issueRouter.get('/issue/:id/assign', IssueController.getUserInfoAssign);

issueRouter.get('/issue/:id/watchers', IssueController.getUserInfoWatchers);

issueRouter.get('/issues', IssueController.getAllIssues);

issueRouter.get('/issues/newIssue', IssueController.getNewIssuePage);

issueRouter.get(
  '/issues/stylesheets/addIssue.css',
  IssueController.getNewIssuePageCss,
);

issueRouter.get('/issue', IssueController.getIssuePage);

issueRouter.get('/issue/:id', IssueController.getIssue);


issueRouter.get('/info/:id', IssueController.getIssueInfo);

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

issueRouter.get(
  '/stylesheets/assign.css',
  IssueController.getAssignPageCss,
);

issueRouter.get(
  '/stylesheets/watchers.css',
  IssueController.getWatchersPageCss,
);

issueRouter.put('/issues/:id/lock-issue', lockIssue);

issueRouter.put('/issues/:id/unlock-issue', unlockIssue);

issueRouter.post('/issues/:id/add-watchers', addWatchersDto, addWatchers);
issueRouter.post('/issue/:id/remove', IssueController.removeIssue);

issueRouter.post(
  '/issues/:id/delete-watchers',
  removeWatchersDto,
  removeWatchers,
);
