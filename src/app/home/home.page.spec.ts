import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Storage } from '@ionic/storage';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Geolocation, Geoposition } from '@ionic-native/geolocation/ngx';

import { GeolocationMock } from '../../testUtils/mocks/geolocation';
import { HomePage } from './home.page';
import { MenuController } from '@ionic/angular';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;
  let storage: Storage;
  let http: HttpClient;
  let httpTestingController: HttpTestingController;
  const menuControllerStub = {
    doc: {
      querySelector: () => {}
    },
    enable: () => {}
  }
  const geolocation = new GeolocationMock();

  var google;

  beforeEach(async(() => {

    
    TestBed.configureTestingModule({
      declarations: [HomePage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: Storage, useValue: { x: '' } },
        { provide: Geolocation, useValue: geolocation },
        { provide: MenuController, useValue: menuControllerStub },
        { provide: google, useValue: '' }
      ],
      imports: [HttpClientTestingModule],
    })
      .compileComponents();

    http = TestBed.get(HttpClient);
    httpTestingController = TestBed.get(HttpTestingController);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
