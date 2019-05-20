import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase/app';
import { MenuController } from '@ionic/angular';

import { AuthService } from '../auth/auth.service';


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

  firebaseLoginResponse = firebase.auth().getRedirectResult().then(response =>
    this.auth.loginUser(response)
  ).catch(error => console.log(error));
}
