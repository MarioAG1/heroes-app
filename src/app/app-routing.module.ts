import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Error404PageComponent } from './shared/pages/error404-page/error404-page.component';
import { authActivateGuard, authMatchGuard } from './auth/guards/auth.guard';
import { publicActivateGuard, publicMatchGuard } from './auth/guards/public.guard';

const routes: Routes = [
  {
    path: "auth",
    loadChildren: () => import("./auth/auth.module").then(m => m.AuthModule),
    canActivate: [publicActivateGuard],
    canMatch: [publicMatchGuard]
  },
  {
    path: "heroes",
    loadChildren: () => import("./heroes/heroes.module").then(m => m.HeroesModule),
    canActivate: [authActivateGuard], //Anclamos la función del canActive
    canMatch: [authMatchGuard], //Anclamos la función del canMatch
  },
  {
    path: "404",
    component: Error404PageComponent
  },
  {
    path: "",
    redirectTo: "heroes",
    pathMatch: 'full'
  }, {
    path: "**",
    redirectTo: "404"
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
