import express from 'express';

import { logIn, signUp, UserController } from '~/application';
import { createUserDto, loginDto } from '~/infrastructure/dtos';

export const userRouter = express.Router();

userRouter.post('/users/signup', createUserDto, signUp);

userRouter.post('/users/login', loginDto, logIn);

userRouter.get('/users', UserController.getAllUsers);
