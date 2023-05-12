import fs from 'fs';

import { load } from 'cheerio';
import type { Request, Response } from 'express';
import type { JwtPayload } from 'jsonwebtoken';
import jwt from 'jsonwebtoken';

import type { IUser } from '~/domain/entities/user';
import { IssueRepository } from '~/domain/repositories';
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
    try {
      const token = req.params.token;
      const decodedToken: JwtPayload = jwt.decode(token, {
        complete: true,
        json: true,
      });
      const username = decodedToken.payload.username;
      const oldUser = await UserRepository.getUserByUsername(username);
      if (!oldUser) {
        res.status(404).json({ message: 'Usuario no encontrado' });
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
      res.redirect(`${process.env.API_URL}/myProfile/${token}`);
    } catch (e) {
      console.log(e);
      res.status(500).json({
        error: e.message,
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
    console.log(user);
    const viewIssueHTML = fs.readFileSync('src/public/views/editProfile.html');
    const $ = load(viewIssueHTML);
    const scriptNode = `<form action="/myProfile/${token}/edit/submit" method="put">
    <fieldset class="image-container" id="image-container">
          <label for="image-input" class="image-label">CAMBIAR FOTO</label>
          <input type="file" id="image-input" class="image-input" name="profilePicture">
    </fieldset>
    <fieldset>
      <label for="username">Nombre de usuario</label>
      <input type="text" name="username" placeholder="${
        user.username
      }" id="username">
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
      <textarea name="bio" id="bio" maxlength="210" placeholder="${
        user.bio ? user.bio : ''
      }"></textarea>
    </fieldset>
    <fieldset class="submit">
      <button id="submit" type="submit" class="btn-small" title="Guardar">Guardar</button>
    </fieldset>
  </form>
  
  `;
    const profileImage = `<img src=${user.profilePicture} alt="" class="image">`;
    $('#editP').append(scriptNode);
    $('#image-avatar').append(profileImage);
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
    let user;
    let username;
    if (decodedToken != null) {
      username = decodedToken.payload.username;
      user = await UserRepository.getUserByUsername(username);
    } else {
      username = token;
      user = await UserRepository.getUserById(username);
      username = user.username;
    }
    const profileHTML = fs.readFileSync('src/public/views/profile.html');
    const $ = load(profileHTML);
    const scriptNode = `<section class="profile-bar">
        <img src="${user.profilePicture}" alt="" class="profile-image">
        <div class="profile-data">
        <div class="profile-data">
            <h1>${user.name}</h1>
            <div class="username">@${user.username}</div>
            <h2>${user.bio ? user.bio : ''}</h2>
        </div>
    </section>
    <div class="main">
        <div class="timeline-wrapper">
            <nav class="profile-content-tabs">
                <a class="tab active" id="timeLineButton">
                    <ion-icon class="icon" name="reorder-four-outline"></ion-icon>
                    <span>Timeline</span>
                </a>
                <a class="tab" id="timeWatcher">
                    <ion-icon class="icon" name="eye-outline"></ion-icon>
                    <span>Observado</span>
                </a>
            </nav>
            <div class="timeline" id="timeline" style="display:flex; flex-direction:column;">
            </div>
        </div>
        <aside class="profile-sidebar">
        <button class="botonLock" onclick="redirectToUrl()">
        <i class="fas fa-home btn-icon"></i> Home
      </button>
      <div id="myperfil"></div>
            
        </aside>
    </div>`;
    $('#myProfile').append(scriptNode);
    if (decodedToken) {
      const editarBioHTML = `
        <div class="editar-bio">
          <h4>Tu perfil</h4>
          <p>La gente puede ver todo lo que haces y en qué estás trabajando. Añade una buena bio para que puedan ver la mejor versión de tu perfil.</p>
        </div>
        <div class="button">
          <button id="editPerfil" class="btn-small">Editar Perfil</button>
        </div>
      `;
      const logOut = `
      <button id="logout" class="btn-small" onclick="logout()">Log Out</button>
      `;
      $('#myperfil').append(editarBioHTML);
      $('#logout-btn').append(logOut);
    }
    const issues = await IssueRepository.getAllIssues();
    const param = req.query.view;
    for (const issue of issues) {
      if (param === 'watched') {
        for (const watcher of issue.watchers) {
          if (watcher.username === username) {
            const scriptActivities = `<div class="timeline-item"> <a href =${process.env.API_URL}/issue/${issue.id}>${issue.numberIssue}  ${issue.subject}</a> </div>`;
            $('#timeline').append(scriptActivities);
          }
        }
      } else {
        for (const activity of issue.activity) {
          const user = await UserRepository.getUserById(
            activity.actor.toString(),
          );
          if (user.username === username) {
            const scriptActivities = `<div class="timeline-item"> ${activity.message}  "<a href =${process.env.API_URL}/issue/${issue.id}>${issue.numberIssue}  ${issue.subject}</a>" </div>`;
            $('#timeline').append(scriptActivities);
          }
        }
      }
    }
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
