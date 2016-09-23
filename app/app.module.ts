import './rxjs-extensions';
import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule }    from '@angular/http';
import { DragulaModule, DragulaService } from 'ng2-dragula/ng2-dragula';
import { AppComponent }   from './app.component';
import { GameService }          from './game.service';

@NgModule({
  imports:      [ BrowserModule, DragulaModule , FormsModule, HttpModule],
  declarations: [ AppComponent ],
  bootstrap:    [ AppComponent ],
  providers:	[ GameService ]
})
export class AppModule { }