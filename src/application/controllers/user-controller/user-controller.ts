import fs from 'fs';

import { load } from 'cheerio';
import type { Request, Response } from 'express';
import type { JwtPayload } from 'jsonwebtoken';
import jwt from 'jsonwebtoken';

import type { IUser } from '~/domain/entities/user';
import { UserRepository } from '~/domain/repositories/user-repository/user-repository';
import { IssueRepository } from '~/domain/repositories';

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
      const token = req.params.token;
      const decodedToken: JwtPayload = jwt.decode(token, {
        complete: true,
        json: true,
      });
      const username = decodedToken.payload.username;
      const oldUser = await UserRepository.getUserByUsername(username);
      if (!oldUser) {
        res.status(404).json({message: 'Usuario no encontrado'});
        return;
        }
      const newUser: IUser = {
        id: oldUser.id,
        email: req.body.email || oldUser.email,
        name: req.body.name || oldUser.name,
        username: req.body.username || oldUser.username,
        password: req.body.password || oldUser.password,
        bio: req.body.bio || oldUser.bio,
      };
      await UserRepository.editarUser(oldUser, newUser);
      res.redirect(`http://localhost:8081/myProfile/${token}`);
      }
    catch (e) {
        res.status(500);
        res.json({
          error: e,
        });
      }
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

    const scriptNode = `<form action="/myProfile/${token}/edit/submit" method="post">
    <fieldset>
      <label for="username">Nombre de usuario</label>
      <input type="text" name="username" placeholder="${user.username}" id="username">
    </fieldset>
    <fieldset>
      <label for="email">Correo</label>
      <input type="email" name="email" id="email" placeholder="${user.email}">
    </fieldset>
    <fieldset>
      <label for="full-name">Nombre completo</label>
      <input type="text" name="name" id="full-name" placeholder="${user.name}">
    </fieldset>
    <fieldset>
      <label for="bio">Bio (max. 210 caracteres)</label>
      <textarea name="bio" id="bio" maxlength="210" placeholder="${user.bio}"></textarea>
    </fieldset>
    <fieldset class="submit">
      <button type="submit" class="btn-small" title="Guardar">Guardar</button>
    </fieldset>
  </form>
  
  `;
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
    const profileHTML = fs.readFileSync('src/public/views/profile.html');
    const $ = load(profileHTML);

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
            <div class="timeline" id="timeline" style="display:flex; flex-direction:column;">
            </div>
        </div>
        <aside class="profile-sidebar">
            <div class="editar-bio">
                <h4>Tu perfil</h4>
                <p>La gente puede ver todo lo que haces y en qué estás trabajando. Añade una buena bio para que puedan ver la mejor versión de tu perfil.</p>
            </div>
        </aside>
    </div>`;
  const issues = await IssueRepository.getAllIssues();
  for(const issue of issues){
    for(const activity of issue.activity){
      const user = await UserRepository.getUserById(activity.actor.toString());
      console.log(user.username);console.log(activity.message);
      if(user.username === username){
    const scriptActivities = `<div class="timeline-item"> ${user.username} ${activity.message} </div>`;
    console.log("PUTA");
    $('.timeline-wrapper').append(scriptActivities);
  }

    
}}
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
