import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed, async } from '@angular/core/testing';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { RouterTestingModule } from '@angular/router/testing';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';

import { AppComponent } from './app.component';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { Storage } from '@ionic/storage';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Observable } from 'rxjs';
import { AngularFireModule } from '@angular/fire';
import { environment } from 'src/environments/environment';
import { AuthService } from './services/auth/auth.service';
import authServiceMock from '../testUtils/mocks/authService';

describe('AppComponent', () => {

  let statusBarSpy, splashScreenSpy, platformReadySpy, platformSpy, authSpy;

  beforeEach(async(() => {
    statusBarSpy = jasmine.createSpyObj('StatusBar', ['styleDefault']);
    splashScreenSpy = jasmine.createSpyObj('SplashScreen', ['hide']);
    platformReadySpy = Promise.resolve();
    platformSpy = jasmine.createSpyObj('Platform', { ready: platformReadySpy });
    authSpy = jasmine.createSpyObj('auth', ['signOut']);
    let http: HttpClient;
    let httpTestingController: HttpTestingController;

    const authState = {
      displayName: null,
      isAnonymous: true,
      uid: '17WvU2Vj58SnTz8v7EqyYYb0WRc2'
    };

    const mockAngularFireAuth: any = {
      auth: ''
    };

    TestBed.configureTestingModule({
      declarations: [AppComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: StatusBar, useValue: statusBarSpy },
        { provide: SplashScreen, useValue: splashScreenSpy },
        { provide: Platform, useValue: platformSpy },
        { provide: AngularFireAuth, useValue: mockAngularFireAuth },
        { provide: GooglePlus, useValue: { x: '' } },
        { provide: Storage, useValue: { x: '' } },
        { provide: AuthService, useValue: authServiceMock },
      ],
      imports: [RouterTestingModule.withRoutes([]), HttpClientTestingModule, AngularFireModule.initializeApp(environment.firebaseConfig)],
    }).compileComponents();

    http = TestBed.get(HttpClient);
    httpTestingController = TestBed.get(HttpTestingController);
  }));

  it('should create the app', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should initialize the app', async () => {
    TestBed.createComponent(AppComponent);
    expect(platformSpy.ready).toHaveBeenCalled();
    await platformReadySpy;
    expect(statusBarSpy.styleDefault).toHaveBeenCalled();
    expect(splashScreenSpy.hide).toHaveBeenCalled();
  });

  it('should have menu labels', async () => {
    const fixture = await TestBed.createComponent(AppComponent);
    await fixture.detectChanges();
    const app = fixture.nativeElement;
    const menuItems = app.querySelectorAll('ion-label');
    expect(menuItems.length).toEqual(6);
    expect(menuItems[0].textContent).toContain('Map');
    expect(menuItems[1].textContent).toContain('Routes');
    expect(menuItems[2].textContent).toContain('Statues');
    expect(menuItems[3].textContent).toContain('Creators');
    expect(menuItems[4].textContent).toContain('Profile');
  });

  it('should have urls', async () => {
    const fixture = await TestBed.createComponent(AppComponent);
    await fixture.detectChanges();
    const app = fixture.nativeElement;
    const menuItems = app.querySelectorAll('ion-item');
    expect(menuItems.length).toEqual(6);
    expect(menuItems[0].getAttribute('ng-reflect-router-link')).toEqual('/home');
    expect(menuItems[1].getAttribute('ng-reflect-router-link')).toEqual('/list-route');
    expect(menuItems[2].getAttribute('ng-reflect-router-link')).toEqual('/list');
    expect(menuItems[3].getAttribute('ng-reflect-router-link')).toEqual('/list-creator');
    expect(menuItems[4].getAttribute('ng-reflect-router-link')).toEqual('/profile');
  });

});
