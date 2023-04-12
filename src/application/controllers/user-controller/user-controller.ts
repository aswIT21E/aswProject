import fs from 'fs';

import { load } from 'cheerio';
import type { Request, Response } from 'express';
import type { JwtPayload } from 'jsonwebtoken';
import jwt from 'jsonwebtoken';

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

  public static async getProfilePage(
    _req: Request,
    res: Response,
  ): Promise<void> {
    res.sendFile('public/views/profile.html', { root: 'src' });
  }

  public static async getEditProfilePage(
    req: Request,
    res: Response,
  ): Promise<void> {
    const token = req.params.token;
    const decodedToken: JwtPayload = jwt.decode(token, {
      complete: true,
      json: true,
    });
    const username = decodedToken.payload.username;
    const user = await UserRepository.getUserByUsername(username);
    const viewIssueHTML = fs.readFileSync('src/public/views/editProfile.html');
    const $ = load(viewIssueHTML);

    const scriptNode = `<fieldset>
    <label for="username">Nombre de usuario</label>
    <input type="text" name="username" placeholder=${user.username} id="username">
        </fieldset>
        <fieldset>
            <label for="email">Correo</label>
            <input type="email" name="email" id="email" placeholder=${user.email}>
        </fieldset>
        <fieldset>
            <label for="full-name">Nombre completo</label>
            <input type="text" name="full-name" id="full-name" placeholder=${user.name}>
        </fieldset>
        <fieldset>
            <label for="bio">Bio (max. 210 caracteres)</label>
            <textarea name="bio" id="bio" maxlength="210" placeholder=${user.bio}></textarea>
        </fieldset>
        <fieldset class="submit">
            <button type="submit" class="btn-small" title="Guardar">Guardar</button>
        </fieldset>`;
    $('#editP').append(scriptNode);
    res.send($.html());
  }

  public static async getMyProfilePage(
    req: Request,
    res: Response,
  ): Promise<void> {
    const token = req.params.token;
    const decodedToken: JwtPayload = jwt.decode(token, {
      complete: true,
      json: true,
    });
    const username = decodedToken.payload.username;
    const user = await UserRepository.getUserByUsername(username);
    const viewIssueHTML = fs.readFileSync('src/public/views/profile.html');
    const $ = load(viewIssueHTML);

    const scriptNode = `<section class="profile-bar">
        <img src="https://picsum.photos/200" alt="" class="profile-image">
        <div class="profile-data">
        <div class="profile-data">
            <h1>${user.name}</h1>
            <div class="username">@${user.username}</div>
            <h2>${user.bio}</h2>
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
