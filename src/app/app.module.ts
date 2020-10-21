import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { PlayerLettersComponent } from './player-letters/player-letters.component';
import { HomeComponent } from './home/home.component';
import { BoardComponent } from './board/board.component';
import { RouterModule } from '@angular/router';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [
    AppComponent,
    BoardComponent,
    HomeComponent,
    PlayerLettersComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    //FormsModule,
    DragDropModule,
    RouterModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
