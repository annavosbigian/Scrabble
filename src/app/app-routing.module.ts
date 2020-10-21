import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'; // CLI imports router
import { HomeComponent } from './home/home.component';
import { BoardComponent } from './board/board.component';

const routes: Routes = [
        { path: '', component: HomeComponent, pathMatch: 'full' },
        { path: 'home', component: BoardComponent, pathMatch: 'full' }


]; // sets up routes constant where you define your routes

// configures NgModule imports and exports
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }