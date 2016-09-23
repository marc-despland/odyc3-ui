import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { DragulaModule, DragulaService } from 'ng2-dragula/ng2-dragula';
import { AppComponent }   from './app.component';
@NgModule({
  imports:      [ BrowserModule, DragulaModule , FormsModule],
  declarations: [ AppComponent ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }