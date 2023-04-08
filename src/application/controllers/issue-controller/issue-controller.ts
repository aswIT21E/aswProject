import type { Request, Response } from "express";
import { load } from "cheerio";
import fs from "fs";
import type { IIssue } from "~/domain/entities/issue";
import { IssueRepository } from "~/domain/repositories/issue-repository/issue-repository";
import { CommentRepository } from "~/domain/repositories/comment-repository/comment-repository";
import { IComment } from "~/domain/entities/comment";

export class IssueController {
  public static async createIssue(req: Request, res: Response): Promise<void> {
    try {
      const issue: IIssue = req.body;
      const lastNumberIssue = await IssueRepository.getLastIssue();
      await IssueRepository.addIssue(issue, lastNumberIssue);
      res.status(200);
      res.redirect("http://localhost:8081/issue");
    } catch (e) {
      res.status(500);
      res.json({
        error: e,
        message: "issue not created",
      });
    }
  }

  public static async getAllIssues(
    _req: Request,
    res: Response
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
    res: Response
  ): Promise<void> {
    res.sendFile("public/views/addIssue.html", { root: "src" });
  }

  public static async getNewIssuePageCss(
    _req: Request,
    res: Response
  ): Promise<void> {
    res.sendFile("public/stylesheets/addIssue.css", { root: "src" });
  }

  public static async getIssuePage(
    _req: Request,
    res: Response
  ): Promise<void> {
    const issues: IIssue[] = await IssueRepository.getAllIssues();

    const Indexhtml = fs.readFileSync("src/public/views/index.html");
    const searchPage = fs.readFileSync("src/public/views/searchIssue.html");
    const $ = load(Indexhtml);

    $("#searchbar").append(load(searchPage).html());
    for (const issue of issues) {
      const scriptNode = `                           
              <div class="issue">
              <abbr title = "${issue.type}"> <div class="bola" id="${issue.type}"></div></abbr>
              <abbr title = "${issue.severity}"><div class="bola" id="${issue.severity}"></div></abbr>
              <abbr title = "${issue.priority}"><div class="bola" id="${issue.priority}"></div></abbr>
              <div class="informacion">
                  <div class="numero-peticion" id="NumPeticion">#${issue.numberIssue}</div>
                  <div class="texto-peticion" id="TextoPeticion"><a id="linkIssue" href="http://localhost:8081/issue/${issue.id}">${issue.subject}</a> </div>
              </div>
              <div class="estado" >${issue.status}</div>
              <div class="fecha-creacion" id = "FechaPeticion">${issue.creator}</div>
              </div>`;
      $("body").append(scriptNode);
    }
    res.send($.html());
  }


  public static async getIssue(_req: Request, res: Response): Promise<void> {
    const id = _req.params.id;
    const issue: IIssue = await IssueRepository.getIssueById(id);
    const comments: IComment[] = issue.comments;
    const viewIssueHTML = fs.readFileSync('src/public/views/viewIssue.html');
    const $ = load(viewIssueHTML);

    for (const comment of comments) {
      const commentt = await CommentRepository.getComment(comment);
        const scriptNode3 = `
          <li>${commentt.content}</li>
          `;
          $('#comments-list').append(scriptNode3);
    }

    const scriptNode4 =`
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
          .then(response => response.json())
          .then(data => console.log(data))
          .catch(error => console.log(error));
      }
      </script>
                <div class="side-wrap">
                <div class="custom-select">
                  <select name="status" id="dropdown" onchange="modifyIssue('status', this.value)">
                    <option value="Nueva" ${issue.status === "Nueva" ? "selected" : ""}>Nueva</option>
                    <option value="En curso" ${issue.status === "En curso" ? "selected" : ""}>En curso</option>
                    <option value="Lista para testear" ${issue.status === "Lista para testear" ? "selected" : ""}>Lista para testear</option>
                    <option value="Cerrada" ${issue.status === "Cerrada" ? "selected" : ""}>Cerrada</option>
                    <option value="Necesita información" ${issue.status === "Necesita información" ? "selected" : ""}>Necesita información</option>
                    <option value="Rechazada" ${issue.status === "Rechazada" ? "selected" : ""}>Rechazada</option>
                    <option value="Pospuesta" ${issue.status === "Pospuesta" ? "selected" : ""}>Pospuesta</option>
                  </select>
                </div>
              </div>
  
              <div class="custom-params">
                <div class="dropdown-cont">
                  <label for="type" class="label">tipo</label>
                  <div class="bola" id="${issue.type}"></div>
      <select name="type" id="dropdown2" class="tipo" onchange="modifyIssue('type', this.value)">
        <option value="Bug" ${issue.type === "Bug" ? "selected" : ""}>Bug</option>
        <option value="Pregunta" ${issue.type === "Pregunta" ? "selected" : ""}>Pregunta</option>
        <option value="Mejora" ${issue.type === "Mejora" ? "selected" : ""}>Mejora</option>
                  </select>
                </div>
                <div class="dropdown-cont">
                  <label for="severity" class="label">gravedad</label>
                  <div class="bola" id="${issue.severity}"></div>
      <select name="severity" id="dropdown2" class="tipo" onchange="modifyIssue('severity', this.value)">
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
      <select name="priority" id="dropdown2" class="tipo" onchange="modifyIssue('priority', this.value)">
        <option value="Baja" ${issue.priority === "Baja" ? "selected" : ""}>Baja</option>
        <option value="Media" ${issue.priority === "Media" ? "selected" : ""}>Media</option>
        <option value="Alta" ${issue.priority === "Alta" ? "selected" : ""}>Alta</option>
      </select>
      </div>
    </div>
    `;
    
    $('#detail-header').append(scriptNode);
    $('#sidebar').append(scriptNode2);
    $('#description').append(scriptNode4);


    res.send($.html());
  }

  public static async getIssuePageCss(
    req: Request,
    res: Response
  ): Promise<void> {
    res.sendFile("public/stylesheets/previewIssue.css", { root: "src" });
  }

  public static async getViewIssuePageCss(
    req: Request,
    res: Response
  ): Promise<void> {
    res.sendFile("public/stylesheets/viewIssue.css", { root: "src" });
  }

  public static async getSearchIssueCss(
    req: Request,
    res: Response
  ): Promise<void> {
    res.sendFile("public/stylesheets/searchIssue.css", { root: "src" });
  }

  public static async getIndividualIssuePage(
    req: Request,
    res: Response
  ): Promise<void> {
    await IssueRepository.getIssueById(req.params.id);
  }

  public static async getIndividualIssuePageCss(
    req: Request,
    res: Response
  ): Promise<void> {
    res.sendFile("public/sytlesheets/viewIssue.css", { root: "src" });
  }

  public static async createComment(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const numberIssue: string = req.params.id;
      const content: string = req.body.comment;
      const date = new Date().toLocaleString("es-ES", {
        timeZone: "Europe/Madrid",
      });
      const comment: IComment = await CommentRepository.addComment(
        content,
        numberIssue,
        date,
        "Author"
      );
      await IssueRepository.addComment(numberIssue, comment);
      res.status(200);
      res.redirect(`http://localhost:8081/issue/${numberIssue}`);
    } catch (e) {
      res.status(500);
      res.json({
        error: e,
        message: "comment not created",
      });
    }
  }

  public static async modifyIssue(req: Request, res: Response): Promise<void> {
    try {
      const numberIssue: string = req.params.id;
      const parameter: string = req.body.parameter;
      const newValue = req.body.newValue;
      console.log(newValue);
      const modifiedIssue: IIssue = await IssueRepository.modifyParameterIssue(
        numberIssue,
        parameter,
        newValue
      );
      res.status(200);
      res.json({
        message: "issue modified",
        issue: modifiedIssue,
      });
    } catch (e) {
      res.status(500);
      res.json({
        error: e,
        message: "comment not created",
      });
    }
  }
}
