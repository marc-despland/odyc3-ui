import { Component } from '@angular/core';
import { LogoComponent } from './logo/logo.component';
import { GameService } from './game.service';
import { Game } from './game';


@Component({
  moduleId: module.id,
  selector: 'odyc3-app',
  directives: [LogoComponent],
  templateUrl: 'odyc3.component.html',
  styleUrls: ['odyc3.component.css'],
  providers:	[ GameService ]
})
export class Odyc3AppComponent {
  public logosid: Array<number>=[1, 2, 3, 4, 5, 6, 7, 8, 9];
  public selected: number=-1;
  public state:number=1;
  email:string = "";

  constructor(private gameService: GameService) {
  }

  onSelect(id: number) {
    if (this.selected==-1) {
      this.selected=id;
    } else {
      var tmp:number= this.logosid[id];
      this.logosid[id]=this.logosid[this.selected];
      this.logosid[this.selected]=tmp;
      this.selected=-1;
    }
  }

  enterEmail() {
    this.state=2;
  }

  sendGame() {
    var game=new Game();
    game.email=this.email;
    game.play=this.logosid;
    console.log('Component will send the request');
    this.gameService.create(game).then(response => this.receivedResponse(response));
    this.state=3;
  }
  tryAgain() {
    this.state=1;
  }

  receivedResponse(response:boolean) {
    console.log("Received response: "+response);
    if (response) {
      this.state=5;
    } else {
      this.state=4;
    }
  }

}
