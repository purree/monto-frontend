import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';

import { AuthService } from '../services/auth/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loading: boolean = false;

  constructor(
    private menuCtrl: MenuController,
    private auth: AuthService) {}

  ionViewWillEnter() {
    this.menuCtrl.enable(false);
  }

  ngOnInit() {
    this.loading = (window.location.hash === '#login');
  }


  googleLogin() {
    this.auth.googleLogin();
  }
}
