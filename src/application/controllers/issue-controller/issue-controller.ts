import type { Request, Response } from 'express';
import { load } from 'cheerio';
import fs from 'fs';
import type { IIssue } from '~/domain/entities/issue';
import type { IFilter } from '~/domain/entities/filter';
import { IssueRepository } from '~/domain/repositories/issue-repository/issue-repository';
import { CommentRepository } from '~/domain/repositories/comment-repository/comment-repository';
import { IComment } from '~/domain/entities/comment';
//import { IComment } from '~/domain/entities/comment';

export class IssueController {

  public static async createIssue(req: Request, res: Response): Promise<void> {
    try {
      const issue: IIssue = req.body;
      const lastNumberIssue = await IssueRepository.getLastIssue();
      await IssueRepository.addIssue(issue, lastNumberIssue);
      res.status(200);
      /*res.json({
        message: 'issue created',
      });*/
      res.redirect('http://localhost:8081/issue');
      /*res.sendFile('public/views/index.html', { root: 'src' });*/
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

  public static async getIssuePage(_req: Request, res: Response): Promise<void> {
    
    const issues: IIssue[] = await IssueRepository.getAllIssues();
    
    const Indexhtml = fs.readFileSync('src/public/views/index.html');
    const searchPage = fs.readFileSync('src/public/views/searchIssue.html');
    const $ = load(Indexhtml);
    
    $('#searchbar').append(load(searchPage).html());
    for (const issue of issues) {

      const scriptNode = `                           
              <div class="issue">
              <abbr title = "${issue.type}"> <div class="bola" id="${issue.type}"></div></abbr>
              <abbr title = "${issue.severity}"><div class="bola" id="${issue.severity}"></div></abbr>
              <abbr title = "${issue.priority}"><div class="bola" id="${issue.priority}"></div></abbr>
              <div class="informacion">
                  <div class="numero-peticion" id="NumPeticion"> ${issue.numberIssue}</div>
                  <div class="texto-peticion" id="TextoPeticion"><a id="linkIssue" href="http://localhost:8081/issue/${issue.id}">${issue.subject}</a> </div>
              </div>
              <div class="estado" >${issue.status}</div>
              <div class="fecha-creacion" id = "FechaPeticion">${issue.creator}</div>
              </div>`;
      $('body').append(scriptNode);
    }
    res.send($.html());

    }

  public static async getIssue(_req: Request, res: Response): Promise<void> {
    const id = _req.params.id
    const issue: IIssue = await IssueRepository.getIssueById(id);
    const viewIssueHTML = fs.readFileSync('src/public/views/viewIssue.html');
    const $ = load(viewIssueHTML);

    const scriptNode = `
                      <div class="detail-nom">
                        <div class="detail-title">
                            <h2 class="title">
                                <div class="ref">#${issue.numberIssue}</div>
                                <span  class="subject">${issue.subject}</span>
                            </h2>
                        </div>
                        <div class="detail-project">
                            <div class="section-name">PETICIÓN</div>
                        </div>
                    </div>
                    <div class="subheader">
                        <div class="created-by">
                            <a href="" class="created-title">Creado por ${issue.creator}</a>
                            <div class="created-date">
                                24 mar. 2023 16:20
                            </div>
                        </div>
                    </div>`;

    const scriptNode2 = `
    <div class="side-wrap">
    <div class="custom-select">
      <select name="status" id="dropdown">
        <option value="Nueva">Nueva</option>
        <option value="En curso">En curso</option>
        <option value="Lista para testear">Lista para testear</option>
        <option value="Cerrada">Cerrada</option>
        <option value="Necesita información">Necesita información</option>
        <option value="Rechazada">Rechazada</option>
        <option value="Pospuesta">Pospuesta</option>
      </select>
    </div>
  </div>
  
  <div class="custom-params">
    <div class="dropdown-cont">
      <label for="type" class="label">tipo</label>
      <div class="bola" id="${issue.type}"></div>
      <select name="type" id="dropdown2" class="tipo">
        <option value="Bug" ${issue.type === "Bug" ? "selected" : ""}>Bug</option>
        <option value="Pregunta" ${issue.type === "Pregunta" ? "selected" : ""}>Pregunta</option>
        <option value="Mejora" ${issue.type === "Mejora" ? "selected" : ""}>Mejora</option>
      </select>
    </div>
    <div class="dropdown-cont">
      <label for="severity" class="label">gravedad</label>
      <div class="bola" id="${issue.severity}"></div>
      <select name="severity" id="dropdown2" class="tipo">
        <option value="Deseada" ${issue.severity === "Deseada" ? "selected" : ""}>Deseada</option>
        <option value="Menor" ${issue.severity === "Menor" ? "selected" : ""}>Menor</option>
        <option value="Normal" ${issue.severity === "Normal" ? "selected" : ""}>Normal</option>
        <option value="Importante" ${issue.severity === "Importante" ? "selected" : ""}>Importante</option>
        <option value="Crítica" ${issue.severity === "Crítica" ? "selected" : ""}>Crítica</option>
      </select>
    </div>
    <div class="dropdown-cont">
      <label for="priority" class="label">prioridad</label>
      <div class="bola" id="${issue.priority}"></div>
      <select name="priority" id="dropdown2" class="tipo">
        <option value="Baja" ${issue.priority === "Baja" ? "selected" : ""}>Baja</option>
        <option value="Media" ${issue.priority === "Media" ? "selected" : ""}>Media</option>
        <option value="Alta" ${issue.priority === "Alta" ? "selected" : ""}>Alta</option>
      </select>
    </div>

  </div>
  
    `;


    $('#detail-header').append(scriptNode);
    $('#sidebar').append(scriptNode2);

    res.send($.html());
  } 
  
  public static async getIssuePageCss(req: Request, res: Response): Promise<void> {
    res.sendFile('public/stylesheets/previewIssue.css', { root: 'src' });
  }

  public static async getViewIssuePageCss(req: Request, res: Response): Promise<void> {
    res.sendFile('public/stylesheets/viewIssue.css', { root: 'src' });
  }

  public static async getSearchIssueCss(req: Request, res: Response): Promise<void> {
    res.sendFile('public/stylesheets/searchIssue.css', { root: 'src' });
  }

  public static async getIndividualIssuePage(req: Request, res: Response): Promise<void>{
    await IssueRepository.getIssueById(req.params.id); 
  }

  public static async getIndividualIssuePageCss(req: Request, res: Response): Promise<void>{
    res.sendFile('public/sytlesheets/viewIssue.css', { root: 'src' });
  }

  public static async createComment(req: Request, res: Response): Promise<void> {
    try {
      const numberIssue: string  = req.params.id;
      const content: string = req.body.comment;
      const date = new Date().toLocaleString('es-ES', { timeZone: 'Europe/Madrid' });
      const comment: IComment = await CommentRepository.addComment(content, numberIssue , date, 'Author');
      await IssueRepository.addComment(numberIssue, comment);
      res.status(200);
      /*res.json({
        message: 'issue created',
      });*/
      res.redirect('http://localhost:8081/issue');
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
      const numberIssue: string  = req.params.id;
      const parameter: string = req.body.parameter;
      const newValue = req.body.newValue;
      const modifiedIssue: IIssue = await IssueRepository.modifyParameterIssue(numberIssue, parameter, newValue);
      res.status(200);
      res.json({
        message: 'issue modified',
        issue: modifiedIssue,
      });
    } catch (e) {
      res.status(500);
      res.json({
        error: e,
        message: 'comment not created',
      });
    }
  }
//Les issues s’han de poder filtrar segons si tenen in determinat status, assignee, tags, priority, assign_to, created_by.
  public static async filterIssues(req: Request, res: Response): Promise<void> {
    try {
      const filter: IFilter = req.body;
      const issues: IIssue[] = await IssueRepository.filterIssues(filter);

      res.status(200);
      res.json({
        message: 'issues filtered',
        issues: issues,
      });
    } catch (e) {
      res.status(500);
      res.json({
        error: e,
        message: 'issues not filtered',
      });
    }

  }
}