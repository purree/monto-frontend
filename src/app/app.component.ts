import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './services/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})

export class AppComponent {
  public appPages = [
    {
      title: 'Map',
      url: '/home',
      icon: 'home'
    },
    {
      title: 'Routes',
      url: '/list-route',
      icon: 'search'
    },
    {
      title: 'Statues',
      url: '/list',
      icon: 'list'
    },
    {
      title: 'Creators',
      url: '/list-creator',
      icon: 'person'
    },
    {
      title: 'Profile',
      url: '/profile',
      icon: 'contact'
    }
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private auth: AuthService,
  ) {
    this.initializeApp();
  }

  signOut() {
    this.auth.signOut();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}
