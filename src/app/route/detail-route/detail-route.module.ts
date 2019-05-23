import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { DeleteConfirmPopupComponent } from '../../components/delete-confirm-popup/delete-confirm-popup.component';

import { DetailRoutePage } from './detail-route.page';

const routes: Routes = [
  {
    path: '',
    component: DetailRoutePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [DetailRoutePage, DeleteConfirmPopupComponent]
})
export class DetailRoutePageModule {}
