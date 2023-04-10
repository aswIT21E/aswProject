import express from 'express';

import {
  IssueController,
  lockIssue,
  addWatchers,
  unlockIssue,
  removeWatchers,
} from '~/application';
import { addWatchersDto, createIssueDto } from '~/infrastructure/dtos';
import { filterDto } from '../dtos/filter-dto';

import { removeWatchersDto } from '../dtos/remove-watchers.dto';

export const issueRouter = express.Router();

issueRouter.post('/issues/create', createIssueDto, IssueController.createIssue);

issueRouter.post('/issue/:id/new-comment', IssueController.createComment);

issueRouter.post('/issue/:id/editIssue', IssueController.modifyIssue);

issueRouter.post('/issue/:id/modifyIssue', IssueController.modifyIssue);

issueRouter.get('/issues', IssueController.getAllIssues);

issueRouter.get('/issues/newIssue', IssueController.getNewIssuePage);

issueRouter.get(
  '/issues/stylesheets/addIssue.css',
  IssueController.getNewIssuePageCss,
);

issueRouter.get('/issue', IssueController.getIssuePage);

issueRouter.get('/issue/:id', IssueController.getIssue);

issueRouter.get('/issuefilter', filterDto, IssueController.getIssuePage);

issueRouter.get('/issuefilter', filterDto, IssueController.getIssuePage);

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

issueRouter.put('/issues/:id/lock-issue', lockIssue);

issueRouter.put('/issues/:id/unlock-issue', unlockIssue);

issueRouter.post('/issues/:id/add-watchers', addWatchersDto, addWatchers);

issueRouter.post(
  '/issues/:id/delete-watchers',
  removeWatchersDto,
  removeWatchers,
);
