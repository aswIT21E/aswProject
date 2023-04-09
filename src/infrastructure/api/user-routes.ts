import express from 'express';

import { UserController } from '~/application';
import { createUserDto } from '~/infrastructure/dtos';

export const userRouter = express.Router();

userRouter.post('/users/create', createUserDto, UserController.createUser);

userRouter.get('/users', UserController.getAllUsers);
