import fs from 'fs';

import type { Request, Response } from 'express';

import type { IUser } from '~/domain/entities/user';
import { UserRepository } from '~/domain/repositories/user-repository/user-repository';
import { getActor } from '~/utils';
import { load } from 'cheerio';

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

  public static async getProfilePage(
    _req: Request,
    res: Response,
  ): Promise<void> {
    res.sendFile('public/views/profile.html', { root: 'src' });
  }

  public static async getEditProfilePage(
    _req: Request,
    res: Response,
  ): Promise<void> {
    res.sendFile('public/views/editProfile.html', { root: 'src' });
  }

  public static async getMyProfilePage(
    req: Request,
    res: Response,
  ): Promise<void> {
    const user = await getActor(req);
    const viewIssueHTML = fs.readFileSync('src/public/views/profile.html');
    const $ = load(viewIssueHTML);

    const scriptNode = `<section class="profile-bar">
        <img src="https://picsum.photos/200" alt="" class="profile-image">
        <div class="profile-data">
        <div class="profile-data">
            <h1>${user.username}</h1>
            <div class="username">@${user.username}</div>
            <h2>Diseñador, Product Owner</h2>
        </div>
    </section>
    <div class="main">
        <div class="timeline-wrapper">
            <nav class="profile-content-tabs">
                <a href="" class="tab active">
                    <ion-icon class="icon" name="reorder-four-outline"></ion-icon>
                    <span>Timeline</span>
                </a>
                <a href="" class="tab">
                    <ion-icon class="icon" name="eye-outline"></ion-icon>
                    <span>Observado</span>
                </a>
            </nav>
        </div>
        <aside class="profile-sidebar">
            <div class="editar-bio">
                <h4>Tu perfil</h4>
                <p>La gente puede ver todo lo que haces y en qué estás trabajando. Añade una buena bio para que puedan ver la mejor versión de tu perfil.</p>
                <button class="edit-profile">
                    <a href="http://localhost:8081/profile/edit"><span>EDITAR BIO</span></a>
                </button>
            </div>
        </aside>
    </div>`;
    $('#myProfile').append(scriptNode);
    res.send($.html());
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

  public static async getProfilePageCss(
    _req: Request,
    res: Response,
  ): Promise<void> {
    res.sendFile('public/stylesheets/profile.css', { root: 'src' });
  }

  public static async getEditProfilePageCss(
    req: Request,
    res: Response,
  ): Promise<void> {
    res.sendFile('public/stylesheets/editProfile.css', { root: 'src' });
  }

}
