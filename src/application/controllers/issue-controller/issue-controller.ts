import fs from 'fs';

import { load } from 'cheerio';
import type { Request, Response } from 'express';

import { addActivity } from '~/application/use-cases';
import type { IUser } from '~/domain/entities';
import { User } from '~/domain/entities';
import type { IComment } from '~/domain/entities/comment';
import { Comment, CommentModel } from '~/domain/entities/comment';
import type { IFilter } from '~/domain/entities/filter';
import type { IIssue } from '~/domain/entities/issue';
import { Issue } from '~/domain/entities/issue';
import { UserRepository } from '~/domain/repositories';
import { CommentRepository } from '~/domain/repositories/comment-repository/comment-repository';
import { IssueRepository } from '~/domain/repositories/issue-repository/issue-repository';
import type { BulkIssuesDto, CreateIssueDto } from '~/infrastructure';
import { S3Service } from '~/infrastructure/services';
import { getActor } from '~/utils';

export class IssueController {
  public static async testUpload(req: Request, res: Response): Promise<void> {
    const uploadService = new S3Service();
    const file = req.files.file;
    const result = await uploadService.uploadFile(file);

    res.status(200).json({
      message: 'File uploaded successfully',
      url: result.Location,
    });
  }
  public static async bulkIssues(req: Request, res: Response): Promise<void> {
    try {
      const creator = await getActor(req);
      const issues: BulkIssuesDto['issues'] = req.body.issues;
      if (!creator) {
        res.status(400).json({ message: 'User creator not found' });
      }

      const date = new Date().toLocaleString('es-ES', {
        timeZone: 'Europe/Madrid',
      });
      let lastNumberIssue = await IssueRepository.getLastIssue();

      for (const issueDoc of issues) {
        const issue: IIssue = new Issue({
          ...issueDoc,
          creator,
          date,
          numberIssue: lastNumberIssue + 1,
        });
        ++lastNumberIssue;
        await IssueRepository.addIssue(issue);
      }

      res.status(207);
      res.json({
        message: 'bulk succeeded',
      });
      // res.redirect(`${process.env.API_URL}/issue`);
    } catch (e) {
      res.status(500);
      res.json({
        error: e,
        message: 'issue not created',
      });
    }
  }

  public static async createIssue(req: Request, res: Response): Promise<void> {
    try {
      const creator = await getActor(req);

      if (!creator) {
        res.status(400).json({ message: 'User creator not found' });
      }
      const date = new Date().toLocaleString('es-ES', {
        timeZone: 'Europe/Madrid',
      });
      const issueDoc: CreateIssueDto = req.body;
      const lastNumberIssue = await IssueRepository.getLastIssue();
      const issue: IIssue = new Issue({
        ...issueDoc,
        date,
        creator,
        numberIssue: lastNumberIssue + 1,
      });
      await IssueRepository.addIssue(issue);
      res.status(201);
      res.json({
        message: 'Issue created successfully',
        issue,
      });
      // res.redirect(`${process.env.API_URL}/issue`);
    } catch (e) {
      res.status(500);
      res.json({
        error: e,
        message: 'issue not created',
      });
    }
  }

  public static async getAllIssues(
    _req: Request,
    res: Response,
  ): Promise<void> {
    try {
      const issues: IIssue[] = await IssueRepository.getAllIssues();
      res.status(200);
      res.json({
        issues,
      });
    } catch (e) {
      res.status(500);
      res.json({
        error: e,
      });
    }
  }

  public static async getNewIssuePage(
    _req: Request,
    res: Response,
  ): Promise<void> {
    res.sendFile('public/views/addIssue.html', { root: 'src' });
  }

  public static async getNewIssuePageCss(
    _req: Request,
    res: Response,
  ): Promise<void> {
    res.sendFile('public/stylesheets/addIssue.css', { root: 'src' });
  }

  public static async getBulkIssuesPage(
    _req: Request,
    res: Response,
  ): Promise<void> {
    res.sendFile('public/views/bulkIssues.html', { root: 'src' });
  }

  public static async getBulkIssuesPageCss(
    _req: Request,
    res: Response,
  ): Promise<void> {
    res.sendFile('public/stylesheets/bulkIssues.css', { root: 'src' });
  }

  public static async getIssueInfo(req: Request, res: Response): Promise<void> {
    const id = req.params.id;
    const issue: IIssue = await IssueRepository.getIssueById(id);

    if (issue) {
      res.status(200).json(issue);
    } else {
      res.status(404).json({ message: 'not found' });
    }
  }
  public static async getUserInfoAssign(
    req: Request,
    res: Response,
  ): Promise<void> {
    const users: IUser[] = await UserRepository.getAllUsers();
    const assignHtml = fs.readFileSync('src/public/views/assign.html');
    const $ = load(assignHtml);
    for (const user of users) {
      const scriptNode = `
    <option class="item" value="${user.id}">
      <div class="user-list-avatar">
          <img src="${user.profilePicture}" alt="" class="img-avatar">
      </div>
      <div class="user-list-name">${user.username}</div>
    </option>
    `;
      $('#select').append(scriptNode);
    }
    res.send($.html());
  }

  public static async getUserInfoWatchers(
    req: Request,
    res: Response,
  ): Promise<void> {
    const users: IUser[] = await UserRepository.getAllUsers();
    const watcherHtml = fs.readFileSync('src/public/views/watchers.html');
    const $ = load(watcherHtml);
    for (const user of users) {
      const scriptNode = `
      <option class="item" value="${user.id}">
        <div class="watcher-list-avatar">
            <img src="${user.profilePicture}" alt="" class="img-avatar">
        </div>
        <div class="watcher-list-name">${user.username}</div>
      </option>
      `;
      $('#select').append(scriptNode);
    }
    res.send($.html());
  }
  public static async getIssuePage(
    _req: Request,
    res: Response,
  ): Promise<void> {
    try {
      const filtro: IFilter = {};
      const {
        tipo,
        gravedad,
        prioridad,
        estado,
        crated_by,
        asign_to,
        asignee,
        order,
        sentido,
        text,
      } = _req.query;
      if (tipo) filtro.tipo = tipo.toString().split(',');
      if (gravedad) filtro.gravedad = gravedad.toString().split(',');
      if (prioridad) filtro.prioridad = prioridad.toString().split(',');
      if (estado) filtro.estado = estado.toString().split(',');
      if (crated_by) filtro.crated_by = crated_by.toString().split(',');
      if (asign_to) filtro.asign_to = asign_to.toString().split(',');
      if (asignee) filtro.asignee = asignee.toString().split(',');
      if (text) {
        var issues: IIssue[] = await IssueRepository.getIssuesBySearch(
          text.toString().split(','),
        );
      } else
        var issues: IIssue[] = await IssueRepository.getIssueByFilter(filtro);

      if (order) {
        const orderField = order.toString();
        // if( orderField == 'creator' ) {
        //   orderField = 'assignedTo';
        // }
        switch (orderField) {
          case 'type':
          case 'severity':
          case 'subject':
          case 'status':
          case 'priority':
          case 'assignedTo':
            if (sentido !== 'true') {
              issues.sort((a, b) => {
                if (
                  a[orderField] === undefined &&
                  orderField === 'assignedTo'
                ) {
                  return 1;
                } else if (a[orderField] === null) {
                  return 1;
                } else if (b[orderField] === null) {
                  return -1;
                } else if (a[orderField] < b[orderField]) {
                  return -1;
                } else if (a[orderField] > b[orderField]) {
                  return 1;
                } else {
                  return 0;
                }
              });
            } else {
              issues.sort((a, b) => {
                if (
                  a[orderField] === undefined &&
                  orderField === 'assignedTo'
                ) {
                  return -1;
                } else if (a[orderField] === null) {
                  return -1;
                } else if (b[orderField] === null) {
                  return 1;
                } else if (a[orderField] > b[orderField]) {
                  return -1;
                } else if (a[orderField] < b[orderField]) {
                  return 1;
                } else {
                  return 0;
                }
              });
            }
            break;
          default:
            // Ordenar por defecto por el campo "id" (MongoId)
            //issues.sort((a: IIssue, b: IIssue) => a.id.localeCompare(b.id));
            break;
        }
      }
      const Indexhtml = fs.readFileSync('src/public/views/index.html');
      const filterPage = fs.readFileSync('src/public/views/filter.html');
      const searchPage = fs.readFileSync('src/public/views/searchIssue.html');
      const $ = load(Indexhtml);

      $('#searchbar').append(load(searchPage).html());
      $('#Filters').append(load(filterPage).html());
      for (const issue of issues) {
        {
          let assigned: User = null;
          if (issue.assignedTo)
            assigned = new User(
              issue.assignedTo.id,
              issue.assignedTo.email,
              issue.assignedTo.name,
              issue.assignedTo.username,
              issue.assignedTo.password,
              issue.assignedTo.bio,
            );
          assigned?.updateProfilePic(issue.assignedTo?.profilePicture);

          const scriptNode = `                           
              <div class="issue">
              <abbr title = "${issue.type}"> <div class="bola" id="${
            issue.type
          }"> </div></abbr>
              <abbr title = "${issue.severity}"><div class="bola" id="${
            issue.severity
          }"> </div></abbr>
              <abbr title = "${issue.priority}"><div class="bola" id="${
            issue.priority
          }"> </div></abbr>
              <div class="informacion">
                  <div class="numero-peticion" id="NumPeticion">#${
                    issue.numberIssue
                  }</div>
                  <div class="texto-peticion" id="TextoPeticion"><a id="linkIssue" href="${
                    process.env.API_URL
                  }/issues/${issue.id}">${issue.subject}</a> </div>
              </div>
              <div class="estado" >${issue.status}</div>
              <div class="fecha-creacion" id="FechaPeticion" onclick="${
                assigned != null
                  ? `window.location.href = '${process.env.API_URL}/myProfile/${assigned.id}';`
                  : ''
              }" ${assigned == null ? 'style="color: gray;"' : ''}>
                ${
                  assigned == null
                    ? 'Not assigned'
                    : `<img src="${assigned.profilePicture}" alt="Imagen por defecto" style="width: 25px; height: 25px; margin-right: 5px;">${assigned.username}`
                }
              </div>
              </div>`;
          $('#issues').append(scriptNode);
        }
      }

      const useranmes: String[] = await UserRepository.getUserUsernames();

      for (const name of useranmes) {
        const scriptUsersAsignee = `
        <label>
        ${name} 
          <input type="checkbox" name="asign_to" value="${name} " >
        </label>`;
        const scriptUserCreator = `
        <label>
          ${name}  
          <input type="checkbox" name="crated_by" value="${name}" >
        </label>`;
        $('#menuAssignedTo').append(scriptUsersAsignee);
        $('#menuCreador').append(scriptUserCreator);
      }

      res.send($.html());
    } catch (e) {
      res.status(500);
      res.json({
        error: e,
        message: 'issues not found',
      });
    }
  }

  public static async getIssue(_req: Request, res: Response): Promise<void> {
    const id = _req.params.id;
    const issue: IIssue = await IssueRepository.getIssueById(id);
    const comments: IComment[] = issue.comments;
    const attachments = issue.attachments;
    const watchers: IUser[] = issue.watchers;
    const viewIssueHTML = fs.readFileSync('src/public/views/viewIssue.html');
    const $ = load(viewIssueHTML);

    for (const comment of comments) {
      const scriptNode3 = `
          <li>
            <div class="comment-wrapper">
              <img class="comment-img" src="${comment.author.profilePicture}">
              <div class="comment-info">
                <div class="comment-data">
                  <span class="comment-creator">${comment.author.name}</span>
                  <span class="comment-date">${comment.date}</span>
                </div>
                <div class="comment-content">
                  <span class="comment">${comment.content}</span>
                </div>
              </div>
            </div>
          
          </li>`;
      $('#comments-list').append(scriptNode3);
    }
    let contador = 0;
    for (const attachment of attachments) {
      const extension = attachment.split('.').pop().toLowerCase();
      let attachmentNode;
      if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) {
        attachmentNode = `
          <li>
            <div class="attachmentS">
              <a href=${attachment}>
                <img src="${attachment}" alt="" class="img-attachment">
              </a>
              <button class="removeAttachmentBtn" id = "removeAttachmentBtn" data-attachment-index="${contador}">X</butotn>
            </div>
          </li>`;
      } else {
        const filename = attachment.split('/').pop();
        attachmentNode = `
          <li>
            <div  class="attachmentS">
              <a href=${attachment} download>
                ${filename}
              </a>
              <button class="removeAttachmentBtn" id = "removeAttachmentBtn" data-attachment-index="${contador}">X</butotn>
            </div>
          </li>`;
      }
      $('#attachment-list').append(attachmentNode);
      ++contador;
    }

    for (const act of issue.activity) {
      const scriptActivities = `<div class="activityIssue"> ${act.message}  "<a href =${process.env.API_URL}/issues/${issue.id}>${issue.numberIssue}  ${issue.subject}</a>" </div>`;
      $('.activitieslist').append(scriptActivities);
    }
    $('#comment-count').append(`${comments.length}`);
    $('#activity-count').append(`${issue.activity.length}`);
    $('#comment-count2').append(`${comments.length}`);
    $('#activity-count2').append(`${issue.activity.length}`);
    $('#attachment-count').append(`${issue.attachments.length}`);

    if (watchers) {
      for (const watcher of watchers) {
        const username: User = new User(
          watcher.id,
          watcher.email,
          watcher.name,
          watcher.username,
          watcher.password,
          watcher.bio,
        );
        username?.updateProfilePic(watcher.profilePicture);
        const scriptNodeWatcher = `
        <div class="watchUser" onclick="window.location.href = '${process.env.API_URL}/myProfile/${username.id}';">
          <div class="img-avatar"><img src="${username.profilePicture}" alt="" class="img-avatar"></div>
          <div class="watcher-list-name"><span>${watcher.username}</span></div>
        </div>
        `;
        $('#ticket-watchers-list').append(scriptNodeWatcher);
      }
    }

    const scriptNode5 = `
    <a href="${process.env.API_URL}/issues/${issue.id}/assign" class="ticket-actions-link"><span>Añadir asignación</span></a>
    `;

    const scriptNode6 = `
    <a href="${process.env.API_URL}/issues/${issue.id}/watchers" class="ticket-actions-link"><span>Modificar observadores</span></a>
    `;

    // const scriptNode7 = `
    // <a href="process.env.API_URL/issues/${issue.id}/watchers" class="ticket-actions-link"><span>No observar</span></a>
    // `;

    const scriptNode4 = `
    <span class= "editableText" id="text" contenteditable="false" style="">${issue.description}</span>
    <span class="edit-icon-wrapper">
    <i id="edit-icon" class="fas fa-pencil-alt"></i>
    </span>
    `;
    const idUser = new User(
      issue.creator.id,
      issue.creator.email,
      issue.creator.name,
      issue.creator.username,
      issue.creator.password,
      issue.creator.bio,
    );
    idUser?.updateProfilePic(idUser.profilePicture);
    const scriptNode = `
                      <div class="detail-nom">
                        <div class="detail-title">
                            <h2 class="title">
                                <div class="ref">#${issue.numberIssue}</div>
                                <span class= "editableText" id="text-subject">${issue.subject}</span>
                                <span class="edit-icon-wrapper-subject">
                                  <i id="edit-icon-subject" class="fas fa-pencil-alt"></i>
                                </span>
                            </h2>
                        </div>
                        <button id="confirm-subject" class="save-button-subject" style="display:none">Confirmar</button>
                        <div class="detail-project">
                            <div class="section-name">PETICIÓN</div>
                        </div>
                    </div>
                    <div class="subheader">
                        <div class="created-by">
                            <a href="${process.env.API_URL}/myProfile/${idUser.id}" class="created-title">Creado por ${issue.creator.username}</a>
                            <div class="created-date">
                            ${issue.date}
                            </div>
                            <div>
                                <div style="margin-top:5em;" id = "deadl"> </div>
                                <button id="delete-deadline" class= botonLock style="display:flex ;    background-color: #E91E63;
                                color: white;" onclick="eliminadeadline()"> Eliminar</button>
                            </div>
                        </div>
    </div>`;
    const path = `'${process.env.API_URL}/issues/${issue.id}/modifyIssue'`;
    const scriptNode2 = `
      <script>
      function modifyIssue(parameter, newValue) {
        fetch(${path} , {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            parameter: parameter,
            newValue: newValue,
          }),
          credentials: 'same-origin',
        })
          .catch(error => console.log(error));
      }
      </script>
      <br/>
      <br/>
      <br>
                  <select class="dropdown" name="status" id="dropdown" onchange="modifyIssue('status', this.value)">
                    <option class="dropdown-option" value="Nueva" ${
                      issue.status === 'Nueva' ? 'selected' : ''
                    }>Nueva</option>
                    <option class="dropdown-option" value="En curso" ${
                      issue.status === 'En curso' ? 'selected' : ''
                    }>En curso</option>
                    <option class="dropdown-option" value="Lista para testear" ${
                      issue.status === 'Lista para testear' ? 'selected' : ''
                    }>Lista para testear</option>
                    <option class="dropdown-option" value="Cerrada" ${
                      issue.status === 'Cerrada' ? 'selected' : ''
                    }>Cerrada</option>
                    <option class="dropdown-option" value="Necesita información" ${
                      issue.status === 'Necesita información' ? 'selected' : ''
                    }>Necesita información</option>
                    <option class="dropdown-option" value="Rechazada" ${
                      issue.status === 'Rechazada' ? 'selected' : ''
                    }>Rechazada</option>
                    <option class="dropdown-option" value="Pospuesta" ${
                      issue.status === 'Pospuesta' ? 'selected' : ''
                    }>Pospuesta</option>
                  </select>
              <div class="custom-params">
                <div class="dropdown-cont">
                    <label for="type" class="label">tipo</label>       
                    <select name="type" id="dropdown2" class="tipo" onchange="modifyIssue('type', this.value)">
                      <option value="Bug" ${
                        issue.type === 'Bug' ? 'selected' : ''
                      }>Bug</option>
                      <option value="Pregunta" ${
                        issue.type === 'Pregunta' ? 'selected' : ''
                      }>Pregunta</option>
                      <option value="Mejora" ${
                        issue.type === 'Mejora' ? 'selected' : ''
                      }>Mejora</option>
                    </select>
                    <div class="bola" id="${issue.type}"></div>
                </div>
                <div class="dropdown-cont">
                  <label for="severity" class="label">gravedad</label>
                    <select name="severity" id="dropdown2" class="tipo" onchange="modifyIssue('severity', this.value)">
                      <option value="Deseada" ${
                        issue.severity === 'Deseada' ? 'selected' : ''
                      }>Deseada</option>
                      <option value="Menor" ${
                        issue.severity === 'Menor' ? 'selected' : ''
                      }>Menor</option>
                      <option value="Normal" ${
                        issue.severity === 'Normal' ? 'selected' : ''
                      }>Normal</option>
                      <option value="Importante" ${
                        issue.severity === 'Importante' ? 'selected' : ''
                      }>Importante</option>
                      <option value="Crítica" ${
                        issue.severity === 'Crítica' ? 'selected' : ''
                      }>Crítica</option>
                    </select>
                    <div class="bola" id="${issue.severity}"></div>
                  </div>
                <div class="dropdown-cont">
                  <label for="priority" class="label">prioridad</label>
                  <select name="priority" id="dropdown2" class="tipo" onchange="modifyIssue('priority', this.value)">
                    <option value="Baja" ${
                      issue.priority === 'Baja' ? 'selected' : ''
                    }>Baja</option>
                    <option value="Media" ${
                      issue.priority === 'Media' ? 'selected' : ''
                    }>Media</option>
                    <option value="Alta" ${
                      issue.priority === 'Alta' ? 'selected' : ''
                    }>Alta</option>
                  </select>
                  <div class="bola" id="${issue.priority}"></div>
                </div>
                <br/>
                <button class="boton-papelera" id="borrar">
                  <i class="fas fa-trash-alt"></i>
                </button>
        </div>
        `;
    let username: IUser = issue.assignedTo;
    if (issue.assignedTo)
      username = new User(
        issue.assignedTo.id,
        issue.assignedTo.email,
        issue.assignedTo.name,
        issue.assignedTo.username,
        issue.assignedTo.password,
        issue.assignedTo.bio,
      );
    username?.updateProfilePic(issue.assignedTo.profilePicture);
    const scriptNodeAssign = `
            <div class="assignUser" onclick="${
              username
                ? `window.location.href = '${process.env.API_URL}/myProfile/${username.id}';`
                : ''
            }">
              <div class="img-avatar"><img src="${
                issue.assignedTo ? username.profilePicture : ''
              }" alt="" class="img-avatar"></div>
              <div class="user-list-name"><span>${
                issue.assignedTo ? issue.assignedTo.username : ''
              }</span></div>
            </div>
    `;

    let scriptLockUnlockButton;
    let scriptLockReason;
    if (issue.locked) {
      scriptLockUnlockButton = `
    <button id="botonLock" data-lock="true" class="botonLock" onclick="LockUnlock()" style="background-color: #a52d47 ;">
      <i class="fas fa-lock"></i> 
    </button>`;
      scriptLockReason = `<div style =" background-color: #ff4c4c; 
    padding: 10px; 
    border-radius: 5px; 
    font-size: 16px; 
    color: white> <i class="fas fa-lock"></i> ${issue.reasonLock}</div>   `;
    } else {
      scriptLockUnlockButton = `
    <button id="botonLock" data-lock="false" class="botonLock" onclick="mostrarCampoTexto()" style="background-color: #2dd486;">
      <i class="fas fa-unlock"></i> 
    </button>
    <form id="formularioLock" style="display:none;">
    Introduzca el motivo: <input type="text" id="campoTextoLock"> 
                <button type="button" id="botonLock" data-lock="true" onclick="LockUnlock()">Confirmar</button>
    `;
    }
    $('#lockReason').append(scriptLockReason);
    $('#butonLockUnlock').append(scriptLockUnlockButton);
    $('#detail-header').append(scriptNode);
    $('#atributos').append(scriptNode2);
    $('#description').append(scriptNode4);
    $('#link1').append(scriptNode5);
    $('#link2').append(scriptNode6);
    // $('#link3').append(scriptNode7);
    if (issue.assignedTo) $('#ticket-user-list').append(scriptNodeAssign);
    if (issue.deadline) {
      const d = issue.deadline.toDateString();
      if (issue.deadline < new Date(Date.now()))
        $('#deadl').append(`Deadline: <span style="color: red;">${d}</span>`);
      else if (issue.deadline < new Date(Date.now() + 86400000 * 3))
        $('#deadl').append(
          `Deadline: <span style="color: orange;">${d}</span>`,
        );
      else
        $('#deadl').append(`Deadline: <span style="color: green;">${d}</span>`);
    } else $('#deadl').append('Deadline: - ');

    res.send($.html());
  }

  public static async getIssuePageCss(
    req: Request,
    res: Response,
  ): Promise<void> {
    res.sendFile('public/stylesheets/previewIssue.css', { root: 'src' });
  }

  public static async getViewIssuePageCss(
    _req: Request,
    res: Response,
  ): Promise<void> {
    res.sendFile('public/stylesheets/viewIssue.css', { root: 'src' });
  }

  public static async getSearchIssueCss(
    req: Request,
    res: Response,
  ): Promise<void> {
    res.sendFile('public/stylesheets/searchIssue.css', { root: 'src' });
  }

  public static async getIndividualIssuePage(
    req: Request,
    _res: Response,
  ): Promise<void> {
    await IssueRepository.getIssueById(req.params.id);
  }

  public static async getIndividualIssuePageCss(
    req: Request,
    res: Response,
  ): Promise<void> {
    res.sendFile('public/sytlesheets/viewIssue.css', { root: 'src' });
  }

  public static async getAssignPageCss(
    req: Request,
    res: Response,
  ): Promise<void> {
    res.sendFile('public/stylesheets/assign.css', { root: 'src' });
  }

  public static async getWatchersPageCss(
    req: Request,
    res: Response,
  ): Promise<void> {
    res.sendFile('public/stylesheets/watchers.css', { root: 'src' });
  }

  public static async createComment(
    req: Request,
    res: Response,
  ): Promise<void> {
    const issueID = req.params.id;
    const content: string = req.body.comment;
    const date = new Date().toLocaleString('es-ES', {
      timeZone: 'Europe/Madrid',
    });
    try {
      const issue = await IssueRepository.getIssueById(issueID);
      const creator = await getActor(req);

      const commentDoc = await CommentModel.create({
        author: creator.id,
        content,
        date,
      });

      const comment = new Comment(commentDoc.id, content, creator, date);

      if (issue) {
        issue.addComment(comment);
        await addActivity(req, issue, 'addComment');
        await IssueRepository.updateIssue(issue);

        res.status(200);
        res.json({
          message: 'Comment added successfully',
          issue,
        });
        //res.redirect(`${process.env.API_URL}/issues/${issueID}`);
      } else {
        res.status(404).json({
          message: `Issue ${issueID} not found`,
        });
      }
    } catch (e) {
      res.status(500);
      res.json({
        error: e,
      });
    }
    try {
      const numberIssue: string = req.params.id;
      const content: string = req.body.comment;
      const date = new Date().toLocaleString('es-ES', {
        timeZone: 'Europe/Madrid',
      });
      const comment: IComment = await CommentRepository.addComment(
        content,
        date,
        'Author',
      );
      await IssueRepository.addComment(numberIssue, comment);
      res.status(200);
      res.redirect(`${process.env.API_URL}/issues/${numberIssue}`);
    } catch (e) {
      res.status(500);
      res.json({
        error: e,
        message: 'comment not created',
      });
    }
  }

  public static async modifyIssue(req: Request, res: Response): Promise<void> {
    try {
      const numberIssue: string = req.params.id;
      const parameter: string = req.body.parameter;
      const newValue = req.body.newValue;
      await IssueRepository.modifyParameterIssue(
        numberIssue,
        parameter,
        newValue,
      );
      // res.redirect(`/issues/${numberIssue}`);
      res.status(200);
      res.json({
        message: 'Issue editted successfuly',
      });
    } catch (e) {
      res.status(500);
      res.json({
        error: e,
        message: 'issue not modified',
      });
    }
  }
  public static async modifyIssueObject(
    req: Request,
    res: Response,
  ): Promise<void> {
    try {
      const numberIssue: string = req.params.id;
      const parameter: string = req.body.parameter;
      const newValue = req.body.newValue;
      await IssueRepository.modifyParameterIssue(
        numberIssue,
        parameter,
        newValue,
      );
      res.status(200);
      res.json({
        message: 'issue modified correctly',
      });
    } catch (e) {
      res.status(500);
      res.json({
        error: e,
        message: 'issue not modified',
      });
    }
  }

  public static async removeIssue(req: Request, res: Response): Promise<void> {
    try {
      const numberIssue: string = req.params.id;
      await IssueRepository.deleteIssue(numberIssue);
      res.status(200);
      res.json({
        message: 'issue deleted successfully',
      });
    } catch (e) {
      res.status(500);
      res.json({
        error: e,
        message: 'issue was not deleted',
      });
    }
  }
}
