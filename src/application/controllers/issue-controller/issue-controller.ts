import type { Request, Response } from 'express';
import { load } from 'cheerio';
import fs from 'fs';
import type { IIssue } from '~/domain/entities/issue';
import { IssueRepository } from '~/domain/repositories/issue-repository/issue-repository';

export class IssueController {
  public static async createIssue(req: Request, res: Response): Promise<void> {
    try {
      const issue: IIssue = req.body;
      await IssueRepository.addIssue(issue);
      res.status(200);
      res.json({
        message: 'issue created',
      });
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

  public static async getIssuePage(
    _req: Request,
    res: Response,
  ): Promise<void> {
    const issues: IIssue[] = await IssueRepository.getAllIssues();
    const Indexhtml = fs.readFileSync('src/views/index.html');
    const $ = load(Indexhtml);

    for (const issue of issues) {
      const scriptNode = `                           
              <div class="issue">
              <div class="bola" id="${issue.type}"></div>
              <div class="bola" id="${issue.severity}"></div>
              <div class="bola" id="${issue.priority}"></div>
              <div class="informacion">
                  <div class="numero-peticion" id="NumPeticion"> ${issue.id}</div>
                  <div class="texto-peticion" id="TextoPeticion"><a id="linkIssue" href="localhost:8080/issues/issue=000">${issue.description}</a> </div>
              </div>
              <div class="estado" id= "${issue.status}"></div>
              <div class="fecha-creacion" id = "FechaPeticion">${issue.creator}</div>
              </div>`;
      $('body').append(scriptNode);
    }
    res.send($.html());
  }

  public static async getIssuePageCss(
    _req: Request,
    res: Response,
  ): Promise<void> {
    res.sendFile('/views/stylesheets/previewIssue.css', { root: 'src' });
  }
}
