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

/**
 * POST METHODS
 */

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
  '/issues/:id/add-watchers',
  authMiddleware,
  addWatchersDto,
  addWatchers,
);

issueRouter.post(
  '/issuefilter',
  authMiddleware,
  filterDto,
  IssueController.getIssuePage,
);

issueRouter.post(
  '/issues/:id/new-comment',
  authMiddleware,
  checkBlockedIssue,
  IssueController.createComment,
);

issueRouter.post(
  '/issues/:id/delete-watchers',
  authMiddleware,
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
  '/issues/:id/addAttachment',
  authMiddleware,
  addAttachmentDto,
  addAttachment,
);

issueRouter.post('/issues/bulkIssues', IssueController.bulkIssues);

/**
 * PUT METHODS
 */

issueRouter.put(
  '/issues/:id/editIssue',
  authMiddleware,
  checkBlockedIssue,
  IssueController.modifyIssue,
);

issueRouter.put(
  '/issues/:id/modifyIssue',
  authMiddleware,
  checkBlockedIssue,
  IssueController.modifyIssue,
);

issueRouter.put(
  '/issues/:id/lock-issue',
  authMiddleware,
  authMiddleware,
  lockIssue,
);

issueRouter.post(
  '/issues/:id/editIssueObject',
  authMiddleware,
  checkBlockedIssue,
  IssueController.modifyIssue,
);

issueRouter.put(
  '/issues/:id/updateDeadline',
  authMiddleware,
  updateDeadlineDto,
  checkBlockedIssue,
  updateDeadline,
);

issueRouter.put('/issues/:id/unlock-issue', authMiddleware, unlockIssue);

/**
 * GET METHODS
 */

issueRouter.get('/issues', authMiddleware, IssueController.getAllIssues);

issueRouter.get(
  '/issues/info/:id',
  authMiddleware,
  IssueController.getIssueInfo,
);

/**
 * DELETE METHODS
 */

issueRouter.delete(
  '/issues/:id/remove',
  authMiddleware,
  IssueController.removeIssue,
);

issueRouter.delete(
  '/issues/:id/removeDeadline',
  authMiddleware,
  checkBlockedIssue,
  removeDeadline,
);

issueRouter.delete(
  '/issues/:id/removeAttachment',
  authMiddleware,
  removeAttachmentDto,
  removeAttachment,
);

/**
 * PAGES AND STYLES
 */

issueRouter.get('/issues/bulk', IssueController.getBulkIssuesPage);

issueRouter.get('/issues/newIssue', IssueController.getNewIssuePage);

issueRouter.get(
  '/issues/stylesheets/addIssue.css',
  IssueController.getNewIssuePageCss,
);

issueRouter.get('/issuefilter', filterDto, IssueController.getIssuePage);

issueRouter.get('/issue', IssueController.getIssuePage);

issueRouter.get('/issues/:id', IssueController.getIssue);

issueRouter.get('/issues/:id/assign', IssueController.getUserInfoAssign);

issueRouter.get('/issues/:id/watchers', IssueController.getUserInfoWatchers);

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
  '/issues/:id/stylesheets/assign.css',
  IssueController.getAssignPageCss,
);

issueRouter.get(
  '/issues/:id/stylesheets/watchers.css',
  IssueController.getWatchersPageCss,
);

issueRouter.get(
  '/stylesheets/bulkIssues.css',
  IssueController.getBulkIssuesPageCss,
);
