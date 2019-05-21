import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './services/authGuard/auth-guard.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: './home/home.module#HomePageModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'list',
    loadChildren: './attraction/list/list.module#ListPageModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'profile',
    loadChildren: './profile/profile.module#ProfilePageModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'list/:id',
    loadChildren: './attraction/attraction-detail/attraction-detail.module#AttractionDetailPageModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'create-route',
    loadChildren: './route/create-route/create-route.module#CreateRoutePageModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'list-route',
    loadChildren: './route/list-route/list-route.module#ListRoutePageModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'detail-route/:id',
    loadChildren: './route/detail-route/detail-route.module#DetailRoutePageModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'list-creator',
    loadChildren: './creator/list-creator/list-creator.module#ListCreatorPageModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'detail-creator/:id',
    loadChildren: './creator/detail-creator/detail-creator.module#DetailCreatorPageModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    loadChildren: './login/login.module#LoginPageModule'
  },
  {
    path: 'sign-up',
    loadChildren: './sign-up/sign-up.module#SignUpPageModule'
  },
  {
    path: 'create-review/:id',
    loadChildren: './review/create-review/create-review.module#CreateReviewPageModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'edit-review/:id',
    loadChildren: './review/edit-review/edit-review.module#EditReviewPageModule',
    canActivate: [AuthGuard]
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
