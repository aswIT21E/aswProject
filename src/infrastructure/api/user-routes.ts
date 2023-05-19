import express from 'express';

import {
  logIn,
  signUp,
  UserController,
  googleAuth,
  uploadProfilePic,
} from '~/application';
import {
  createUserDto,
  loginDto,
  uploadProfilePicDto,
  googleAuthDto,
} from '~/infrastructure/dtos';

import { authMiddleware } from '../middlewares';

export const userRouter = express.Router();

/**
 * POST METHODS
 */

userRouter.post('/users/signup', createUserDto, signUp);

userRouter.post('/users/login', loginDto, logIn);

userRouter.post('/users/googleAuth', googleAuthDto, googleAuth);

userRouter.post(
  '/user/editProfilePic',
  authMiddleware,
  uploadProfilePicDto,
  uploadProfilePic,
);

/**
 * PUT METHODS
 */

userRouter.put('/users/editProfile', authMiddleware, UserController.editUser);

/**
 * GET METHODS
 */

userRouter.get('/users/profile', authMiddleware, UserController.getUserProfile);

userRouter.get('/users', authMiddleware, UserController.getAllUsers);

/**
 * PAGES AND STYLES
 */

userRouter.get('/signup', UserController.getSignUpPage);

userRouter.get('/login', UserController.getLoginPage);

userRouter.get('/profile', UserController.getProfilePage);

userRouter.get('/myProfile/:token', UserController.getMyProfilePage);

userRouter.put('/myProfile/:token/edit/submit', UserController.editUser);

userRouter.get('/myProfile/:token/edit', UserController.getEditProfilePage);

userRouter.get('/stylesheets/signUp.css', UserController.getSignUpPageCss);

userRouter.get('/stylesheets/login.css', UserController.getLoginPageCss);

userRouter.get('/stylesheets/profile.css', UserController.getProfilePageCss);

userRouter.get(
  '/stylesheets/editProfile.css',
  UserController.getEditProfilePageCss,
);
