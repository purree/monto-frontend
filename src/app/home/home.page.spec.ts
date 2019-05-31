import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Geolocation } from '@ionic-native/geolocation/ngx';

import { GeolocationMock } from '../../testUtils/mocks/geolocation';
import { HomePage } from './home.page';
import { MenuController } from '@ionic/angular';
import { ApiService } from '../api.service';
import { ApiServiceMock } from 'src/testUtils/mocks/apiService';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;
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
        { provide: ApiService, useValue: new ApiServiceMock() },
        { provide: Geolocation, useValue: geolocation },
        { provide: MenuController, useValue: menuControllerStub },
        { provide: google, useValue: '' }
      ],
    })
      .compileComponents();
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
