import { Injectable }    from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { Game } from './game';

@Injectable()
export class GameService {
  private headers = new Headers({'Content-Type': 'application/json'});
  private gameUrl = '/api/solution';  // URL to web api
  constructor(private http: Http) { }

  create(game: Game): Promise<boolean> {
    console.log('Sending the request');
    return this.http
      .post(this.gameUrl, JSON.stringify(game), {headers: this.headers})
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }
  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }

  private extractData(res: Response) {
    console.log(res);
    let body = res.json();
    return body.good;
  }
}
