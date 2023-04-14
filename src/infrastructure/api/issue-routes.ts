import express from 'express';

import {
  IssueController,
  lockIssue,
  addWatchers,
  unlockIssue,
  removeWatchers,
  addAttachment,
  assignUserToIssue,
  removeAttachment,
  updateDeadline,
  removeDeadline,
} from '~/application';

import {
  addWatchersDto,
  createIssueDto,
  assignIssueDto,
  bulkIssuesDto,
  addAttachmentDto,
  removeAttachmentDto,
  updateDeadlineDto,
} from '~/infrastructure/dtos';

import { filterDto } from '../dtos/filter-dto';
import { removeWatchersDto } from '../dtos/remove-watchers.dto';
import { authMiddleware, checkBlockedIssue } from '../middlewares';

export const issueRouter = express.Router();

issueRouter.post(
  '/issues/create',
  authMiddleware,
  createIssueDto,
  IssueController.createIssue,
);

issueRouter.post(
  '/issues/bulk',
  authMiddleware,
  bulkIssuesDto,
  IssueController.bulkIssues,
);

issueRouter.post(
  '/issue/:id/new-comment',
  authMiddleware,
  checkBlockedIssue,
  IssueController.createComment,
);

issueRouter.post(
  '/issue/:id/editIssue',
  checkBlockedIssue,
  IssueController.modifyIssue,
);

issueRouter.post(
  '/issue/:id/modifyIssue',
  checkBlockedIssue,
  IssueController.modifyIssue,
);

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

issueRouter.get('/issuefilter', filterDto, IssueController.getIssuePage);

issueRouter.post('/issuefilter', filterDto, IssueController.getIssuePage);

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
  '/issue/:id/stylesheets/assign.css',
  IssueController.getAssignPageCss,
);

issueRouter.get(
  '/issue/:id/stylesheets/watchers.css',
  IssueController.getWatchersPageCss,
);

issueRouter.put('/issues/:id/lock-issue', lockIssue);

issueRouter.put('/issues/:id/unlock-issue', unlockIssue);

issueRouter.post('/issues/:id/add-watchers', addWatchersDto, addWatchers);
issueRouter.post('/issue/:id/remove', IssueController.removeIssue);

issueRouter.post(
  '/issues/:id/delete-watchers',
  removeWatchersDto,
  checkBlockedIssue,
  removeWatchers,
);

issueRouter.post(
  '/issues/:id/assign',
  authMiddleware,
  assignIssueDto,
  checkBlockedIssue,
  assignUserToIssue,
);
issueRouter.post(
  '/issues/:id/updateDeadline',
  authMiddleware,
  updateDeadlineDto,
  checkBlockedIssue,
  updateDeadline,
);

issueRouter.post(
  '/issues/:id/removeDeadline',
  authMiddleware,
  checkBlockedIssue,
  removeDeadline,
);

issueRouter.post(
  '/issues/:id/addAttachment',
  authMiddleware,
  addAttachmentDto,
  addAttachment,
);

issueRouter.post(
  '/issues/:id/removeAttachment',
  authMiddleware,
  removeAttachmentDto,
  removeAttachment,
);
