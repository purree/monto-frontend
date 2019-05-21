import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AttractionDetailPage } from './attraction-detail.page';
import { FunfactPopupComponent } from '../../components/attraction/funfact-popup/funfact-popup.component';

const routes: Routes = [
  {
    path: '',
    component: AttractionDetailPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AttractionDetailPage, FunfactPopupComponent]
})
export class AttractionDetailPageModule {}
