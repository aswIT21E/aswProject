import express from 'express';

// eslint-disable-next-line import/named
import { logIn, signUp, UserController, googleAuth } from '~/application';
import {
  createUserDto,
  loginDto,
  uploadProfilePicDto,
  googleAuthDto,
} from '~/infrastructure/dtos';
import { authMiddleware } from '../middlewares';

export const userRouter = express.Router();

userRouter.post('/users/signup', createUserDto, signUp);

userRouter.post('/users/login', loginDto, logIn);

userRouter.post('/users/googleAuth', googleAuthDto, googleAuth);

userRouter.post('/users/editProfile', UserController.editUser);

userRouter.post(
  '/user/editProfilePic',
  authMiddleware,
  uploadProfilePicDto,
  uploadProfilePicDto,
);

userRouter.get('/users', UserController.getAllUsers);

userRouter.get('/signup', UserController.getSignUpPage);

userRouter.get('/login', UserController.getLoginPage);

userRouter.get('/profile', UserController.getProfilePage);

userRouter.get('/myProfile/:token', UserController.getMyProfilePage);

userRouter.post('/myProfile/:token/edit/submit', UserController.editUser);

userRouter.get('/myProfile/:token/edit', UserController.getEditProfilePage);

userRouter.get('/stylesheets/signUp.css', UserController.getSignUpPageCss);

userRouter.get('/stylesheets/login.css', UserController.getLoginPageCss);

userRouter.get('/stylesheets/profile.css', UserController.getProfilePageCss);

userRouter.get(
  '/stylesheets/editProfile.css',
  UserController.getEditProfilePageCss,
);
