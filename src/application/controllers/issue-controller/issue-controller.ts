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
      res.sendFile('public/views/index.html', { root: 'src' });
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
    const Indexhtml = fs.readFileSync('src/public/views/index.html');
    const searchPage = fs.readFileSync('src/public/views/searchIssue.html');
    const $ = load(Indexhtml);
    
    $('body').append(load(searchPage).html());
    for (const issue of issues) {
      const scriptNode = `                           
              <div class="issue">
              <abbr title = "${issue.type}"> <div class="bola" id="${issue.type}"></div></abbr>
              <abbr title = "${issue.severity}"><div class="bola" id="${issue.severity}"></div></abbr>
              <abbr title = "${issue.priority}"><div class="bola" id="${issue.priority}"></div></abbr>
              <div class="informacion">
                  <div class="numero-peticion" id="NumPeticion"> ${issue.id}</div>
                  <div class="texto-peticion" id="TextoPeticion"><a id="linkIssue" href="localhost:8080/issues/issue=000">${issue.subject}</a> </div>
              </div>
              <div class="estado" >${issue.status}</div>
              <div class="fecha-creacion" id = "FechaPeticion">${issue.creator}</div>
              </div>`;
      $('body').append(scriptNode);
    }
  res.send($.html());

    }
  
  public static async getIssuePageCss(req: Request, res: Response): Promise<void> {
  
    res.sendFile('public/stylesheets/previewIssue.css', { root: 'src' });
  }
}
