import express from "express";

import { userRouter } from "./user-routes";
import { issueRouter } from "./issue-routes";

export const routes = express.Router();

routes.use(userRouter);
routes.use(issueRouter);
