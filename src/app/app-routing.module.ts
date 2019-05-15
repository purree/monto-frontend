import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: './home/home.module#HomePageModule'
  },
  {
    path: 'list',
    loadChildren: './attraction/list/list.module#ListPageModule'
  },
  {
    path: 'profile',
    loadChildren: './profile/profile.module#ProfilePageModule'
  },
  {
    path: 'list/:id',
    loadChildren: './attraction/attraction-detail/attraction-detail.module#AttractionDetailPageModule'
  },
  {
    path: 'create-route',
    loadChildren: './route/create-route/create-route.module#CreateRoutePageModule'
  },
  {
    path: 'list-route',
    loadChildren: './route/list-route/list-route.module#ListRoutePageModule'
  },
  {
    path: 'detail-route/:id',
    loadChildren: './route/detail-route/detail-route.module#DetailRoutePageModule'
  },
  { 
    path: 'list-creator', 
    loadChildren: './creator/list-creator/list-creator.module#ListCreatorPageModule'
  },
  { 
    path: 'detail-creator/:id', 
    loadChildren: './creator/detail-creator/detail-creator.module#DetailCreatorPageModule' 
  },
  { path: 'login', loadChildren: './login/login.module#LoginPageModule' },
  { path: 'sign-up', loadChildren: './sign-up/sign-up.module#SignUpPageModule' },
  /*
  {
    path: 'find-route',
    loadChildren: './find-route/find-route.module#FindRoutePageModule'
  },
  {
    path: 'my-route',
    loadChildren: './my-route/my-route.module#MyRoutePageModule'
  },
  {
    path: 'settings',
    loadChildren: './settings/settings.module#SettingsPageModule'
  },
  {
    path: 'sign-out',
    loadChildren: './sign-out/sign-out.module#SignOutPageModule'
  }
  */
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
