import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';

import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { Platform } from '@ionic/angular';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  user: Observable<firebase.User>;
  loading: boolean = false;

  constructor(private afAuth: AngularFireAuth,
    private gplus: GooglePlus,
    private platform: Platform,
    private api: ApiService,
    private router: Router,
    private storage: Storage) {
    this.user = this.afAuth.authState;
  }



  ngOnInit() {
    this.loading = (window.location.hash === '#login');
  }

  googleLogin() {
    if (this.platform.is('cordova')) {
      this.nativeGoogleLogin();
    } else {
      this.webGoogleLogin();
    }
  }

  signOut() {
    this.afAuth.auth.signOut();
  }

  async nativeGoogleLogin(): Promise<firebase.auth.UserCredential> {
    try {
      const gplusUser = await this.gplus.login({
        'webClientId': '229530239467-urg9illfbn55333203g6vgl4qr46cl94.apps.googleusercontent.com',
        'offline': true,
        'scopes': 'profile email'
      })
      return await this.afAuth.auth.signInWithCredential(firebase.auth.GoogleAuthProvider.credential(gplusUser.idToken));
    } catch (err) {
      console.log(err)
    }
  }

  async webGoogleLogin(): Promise<void> {
    window.location.hash = 'login';
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      // const credential = await this.afAuth.auth.signInWithPopup(provider).then((response) =>{});
      firebase.auth().signInWithRedirect(provider);
    } catch (err) {
      console.log(err)
    }

  }

  firebaseLoginResponse = firebase.auth().getRedirectResult().then(response => {
    if (response.user) {
      this.storage.set('user', {
        'displayName': response.user.displayName,
        'email': response.user.email,
        'photoUrl': response.user.photoURL,
        'userHref': ''
      }).then(() =>
        this.checkAccount(response.user)
      );
    }
  }).catch(error => console.log(error));

  checkAccount(user) {
    this.api.findByEmail(user.email).subscribe(searchResult => {
      console.log(searchResult);
      let userData = <any>searchResult;
      this.storage.set('userHref', userData._links.self.href);
      this.router.navigateByUrl('/home');
    },
      error => {
        // A 404 on from the api means no user with that email exists
        this.router.navigateByUrl('/sign-up');
      });
  }

}
