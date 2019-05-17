import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Storage } from '@ionic/storage';


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
    },
    {
      title: 'Settings',
      url: '/settings',
      icon: 'settings'
    },
    {
      title: 'Sign out',
      url: '/sign-out',
      icon: 'log-out'
    }
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private storage: Storage
  ) {
    this.initializeApp();
    //storage.set('userHref', 'http://localhost:8080/users/1');
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}
