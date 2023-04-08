import express from 'express';

import { issueRouter } from './issue-routes';
import { userRouter } from './user-routes';

export const routes = express.Router();

routes.use(userRouter);
routes.use(issueRouter);
