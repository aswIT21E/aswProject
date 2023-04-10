import express from 'express';

import { logIn, signUp, UserController } from '~/application';
import { createUserDto, loginDto } from '~/infrastructure/dtos';

export const userRouter = express.Router();

userRouter.post('/users/signup', createUserDto, signUp);

userRouter.post('/users/login', loginDto, logIn);
userRouter.post('/users/editProfile', UserController.editUser);

userRouter.get('/users', UserController.getAllUsers);

userRouter.get('/signup', UserController.getSignUpPage);

userRouter.get('/login', UserController.getLoginPage);

userRouter.get(
    '/stylesheets/signUp.css',
    UserController.getSignUpPageCss,
  );

userRouter.get(
    '/stylesheets/login.css',
    UserController.getLoginPageCss,
  );
