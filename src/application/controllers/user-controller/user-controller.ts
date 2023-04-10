import type { Request, Response } from 'express';

import type { IUser } from '~/domain/entities/user';
import { UserRepository } from '~/domain/repositories/user-repository/user-repository';

export class UserController {
  public static async createUser(req: Request, res: Response): Promise<void> {
    try {
      const user: IUser = req.body;
      await UserRepository.addUser(user);
      res.status(200);
      res.json({
        message: 'user created',
      });
    } catch (e) {
      res.status(500);
      res.json({
        error: e,
      });
    }
  }

  public static async getAllUsers(_req: Request, res: Response): Promise<void> {
    try {
      const users: IUser[] = await UserRepository.getAllUsers();
      res.status(200);
      res.json({
        users,
      });
    } catch (e) {
      res.status(500);
      res.json({
        error: e,
      });
    }
  }

  public static async getSignUpPage(
    _req: Request,
    res: Response,
  ): Promise<void> {
    res.sendFile('public/views/signUp.html', { root: 'src' });
  }

  public static async getLoginPage(
    _req: Request,
    res: Response,
  ): Promise<void> {
    res.sendFile('public/views/login.html', { root: 'src' });
  }

  public static async editUser(req: Request, res: Response): Promise<void> {
    try{
      const oldUser = await UserRepository.getUserById(req.body.id);
      if (!oldUser) {
        res.status(404).json({message: 'Usuario no encontrado'});
        return;
        }
      const newUser: IUser = {
        id: oldUser.id,
        email: req.body.email || oldUser.email,
        username: req.body.username || oldUser.username,
        password: req.body.password || oldUser.password,
      };
      await UserRepository.editarUser(oldUser, newUser);
       res.status(500).json({message: 'Usuario editado correctamente'});  
      }
    catch (e) {
        res.status(500);
        res.json({
          error: e,
        });
      }
   }

  public static async getSignUpPageCss(
    _req: Request,
    res: Response,
  ): Promise<void> {
    res.sendFile('public/stylesheets/signUp.css', { root: 'src' });
  }

  public static async getLoginPageCss(
    _req: Request,
    res: Response,
  ): Promise<void> {
    res.sendFile('public/stylesheets/login.css', { root: 'src' });
  }

}
