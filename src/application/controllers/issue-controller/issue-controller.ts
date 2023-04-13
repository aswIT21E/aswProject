import fs from 'fs';

import { load } from 'cheerio';
import type { Request, Response } from 'express';

import type { IComment } from '~/domain/entities/comment';
import type { IFilter } from '~/domain/entities/filter';
import type { IUser } from '~/domain/entities/user'
import { IIssue, Issue } from '~/domain/entities/issue';
import { UserRepository } from '~/domain/repositories';
import { CommentRepository } from '~/domain/repositories/comment-repository/comment-repository';
import { IssueRepository } from '~/domain/repositories/issue-repository/issue-repository';
import { getActor } from '~/utils';
import { BulkIssuesDto, CreateIssueDto } from '~/infrastructure';

export class IssueController {
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
          numberIssue: lastNumberIssue,
        });
        ++lastNumberIssue;
        await IssueRepository.addIssue(issue);
      }

      res.status(200);
      res.redirect('http://localhost:8081/issue');
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
      res.status(200);
      res.redirect('http://localhost:8081/issue');
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

  public static async getIssueInfo(req: Request, res: Response): Promise<void> {
    const id = req.params.id;
    const issue: IIssue = await IssueRepository.getIssueById(id);

    if (issue) {
      res.status(200).json(issue);
    } else {
      res.status(404).json({ message: 'not found' });
    }
  }
  public static async getUserInfoAssign(req: Request, res: Response) : Promise<void> {
    const users: IUser[] = await UserRepository.getAllUsers();
    const assignHtml = fs.readFileSync('src/public/views/assign.html');
    const $ = load(assignHtml);
    for (const user of users) {
      const scriptNode = `
    <option class="item" value="${user.id}">
      <div class="user-list-avatar">
          <img src="https://picsum.photos/48" alt="" class="img-avatar">
      </div>
      <div class="user-list-name">${user.username}</div>
    </option>
    `;
      $('#select').append(scriptNode);
    } 
    res.send($.html());
    
  }

  public static async getUserInfoWatchers(req: Request, res: Response) : Promise<void> {
    const users: IUser[] = await UserRepository.getAllUsers();
    const watcherHtml = fs.readFileSync('src/public/views/watchers.html');
    const $ = load(watcherHtml);
    for (const user of users) {
      const scriptNode = `
      <option class="item" value="${user.id}">
        <div class="watcher-list-avatar">
            <img src="https://picsum.photos/48" alt="" class="img-avatar">
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
        created_by,
        asign_to,
        asignee,
      } = _req.query;
      if (tipo) filtro.tipo = tipo.toString().split(',');
      if (gravedad) filtro.gravedad = gravedad.toString().split(',');
      if (prioridad) filtro.prioridad = prioridad.toString().split(',');
      if (estado) filtro.estado = estado.toString().split(',');
      if (created_by) filtro.crated_by = created_by.toString().split(',');
      if (asign_to) filtro.asign_to = asign_to.toString().split(',');
      if (asignee) filtro.asignee = asignee.toString().split(',');

      const issues: IIssue[] = await IssueRepository.getIssueByFilter(filtro);
      const Indexhtml = fs.readFileSync('src/public/views/index.html');
      const filterPage = fs.readFileSync('src/public/views/filter.html');
      const searchPage = fs.readFileSync('src/public/views/searchIssue.html');
      const $ = load(Indexhtml);

      $('#searchbar').append(load(searchPage).html());
      $('#Filters').append(load(filterPage).html());
      for (const issue of issues) {
        {
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
                  <div class="texto-peticion" id="TextoPeticion"><a id="linkIssue" href="http://localhost:8081/issue/${
                    issue.id
                  }">${issue.subject}</a> </div>
              </div>
              <div class="estado" >${issue.status}</div>
              <div class="fecha-creacion" id = "FechaPeticion">${
                issue.creator == null ? 'undefined' : issue.creator.username
              }</div>
              </div>`;
          $('#issues').append(scriptNode);
        }
      }

      const useranmes: String[] = await UserRepository.getUserUsernames();
      useranmes.push('maci');
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
    const watchers: IUser[] = issue.watchers;
    const viewIssueHTML = fs.readFileSync('src/public/views/viewIssue.html');
    const $ = load(viewIssueHTML);

    for (const comment of comments) {
      const commentt = await CommentRepository.getComment(comment);

      const scriptNode3 = `
          <li>
            <div class="comment-wrapper">
              <img class="comment-img" src="https://picsum.photos/50">
              <div class="comment-info">
                <div class="comment-data">
                  <span class="comment-creator">${commentt.author}</span>
                  <span class="comment-date">${commentt.date}</span>
                </div>
                <div class="comment-content">
                  <span class="comment">${commentt.content}</span>
                </div>
              </div>
            </div>
          
          </li>`;
      $('#comments-list').append(scriptNode3);
    }

    if (watchers) {
      for (const watcher of watchers) {
        const scriptNodeWatcher = `
        <div class="watchUser">
          <div class="img-avatar"><img src="https://picsum.photos/48" alt="" class="avatar"></div>
          <div class="watcher-list-name"><span>${watcher.username}</span></div>
      </div>
        `;
      $('#ticket-watchers-list').append(scriptNodeWatcher);
      }
    }

    const scriptNode5 = `
    <a href="http://localhost:8081/issue/${issue.id}/assign" class="ticket-actions-link"><span>Añadir asignación</span></a>
    `;

    const scriptNode6 = `
    <a href="http://localhost:8081/issue/${issue.id}/watchers" class="ticket-actions-link"><span>Añadir observadores</span></a>
    `;

    const scriptNode7 = `
    <a href="http://localhost:8081/issue/${issue.id}/watchers" class="ticket-actions-link"><span>No observar</span></a>
    `;

    const scriptNode4 = `
    <span class= "editableText" id="text" contenteditable="false" style="">${issue.description}</span>
    <span class="edit-icon-wrapper">
    <i id="edit-icon" class="fas fa-pencil-alt"></i>
    </span>
    `;
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
                            <a href="" class="created-title">Creado por ${issue.creator.username}</a>
                            <div class="created-date">
                            ${issue.date}
                            </div>
                        </div>
    </div>`;
    const path = `'http://localhost:8081/issue/${issue.id}/modifyIssue'`;
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

    const scriptNodeAssign = `
            <div class="assignUser">
              <div class="img-avatar"><img src="https://picsum.photos/48" alt="" class="avatar"></div>
              <div class="user-list-name"><span>${issue.assignedTo ? issue.assignedTo.username : ''}</span></div>
            </div>
    `;

    $('#detail-header').append(scriptNode);
    $('#atributos').append(scriptNode2);
    $('#description').append(scriptNode4);
    $('#link1').append(scriptNode5);
    $('#link2').append(scriptNode6);
    $('#link3').append(scriptNode7);
    if (issue.assignedTo) $('#ticket-user-list').append(scriptNodeAssign);


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
    res.sendFile('public/sytlesheets/assign.css', { root: 'src' });
  }

  public static async getWatchersPageCss(
    req: Request,
    res: Response,
  ): Promise<void> {
    res.sendFile('public/sytlesheets/watchers.css', { root: 'src' });
  }

  public static async createComment(
    req: Request,
    res: Response,
  ): Promise<void> {
    try {
      const numberIssue: string = req.params.id;
      const content: string = req.body.comment;
      const date = new Date().toLocaleString('es-ES', {
        timeZone: 'Europe/Madrid',
      });
      const comment: IComment = await CommentRepository.addComment(
        content,
        numberIssue,
        date,
        'Author',
      );
      await IssueRepository.addComment(numberIssue, comment);
      res.status(200);
      res.redirect(`http://localhost:8081/issue/${numberIssue}`);
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
      res.redirect(`/issue/${numberIssue}`);
      res.status(200);
    } catch (e) {
      res.status(500);
      res.json({
        error: e,
        message: 'comment not created',
      });
    }
  }

  public static async removeIssue(req: Request, res: Response): Promise<void> {
    try {
      const numberIssue: string = req.params.id;
      await IssueRepository.deleteIssue(numberIssue);
      res.status(200);
      res.end();
    } catch (e) {
      res.status(500);
      res.json({
        error: e,
        message: 'issue was not deleted',
      });
    }
  }
}
