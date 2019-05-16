import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { HomePage } from './home.page';
import { AttractionPopupComponent } from '../components/attraction-popup/attraction-popup.component';
import { CreateUserspotComponent } from '../components/create-userspot/create-userspot.component';
import { ShowUserspotComponent } from '../components/show-userspot/show-userspot.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomePage
      }
    ])
  ],
  declarations: [HomePage, AttractionPopupComponent, CreateUserspotComponent, ShowUserspotComponent]
})
export class HomePageModule { }
