import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { HomePage } from './home.page';
import { AttractionPopupComponent } from '../components/attraction-popup/attraction-popup.component';
import { CreateUserspotComponent } from '../components/create-userspot/create-userspot.component';
import { ShowUserspotComponent } from '../components/show-userspot/show-userspot.component';
import { StartNewRouteComponent } from '../components/start-new-route/start-new-route.component';
import { PredefinedRoutesComponent } from '../components/predefined-routes/predefined-routes.component';
import { FactPacketToastComponent } from '../components/fact-packet-toast/fact-packet-toast.component';
import { FactPacketPopupComponent } from '../components/fact-packet-popup/fact-packet-popup.component';

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
  declarations: [
    HomePage,
    AttractionPopupComponent,
    CreateUserspotComponent,
    ShowUserspotComponent,
    StartNewRouteComponent,
    PredefinedRoutesComponent,
    FactPacketToastComponent,
    FactPacketPopupComponent
  ]
})
export class HomePageModule { }
