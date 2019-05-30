import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Storage } from '@ionic/storage';
import { DetailRoutePage } from './detail-route.page';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { File } from '@ionic-native/file/ngx';
import  authServiceMock from '../../../testUtils/mocks/authService';
import { AuthService } from 'src/app/services/auth/auth.service';



describe('DetailRoutePage', () => {
  let component: DetailRoutePage;
  let fixture: ComponentFixture<DetailRoutePage>;

  const mockAngularFireAuth: any = {
    auth: ''
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailRoutePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: Storage, useValue: '' },
        { provide: SocialSharing, useValue: '' },
        { provide: AuthService, useValue: authServiceMock },
        { provide: File, useValue: '' },
        { provide: GooglePlus, useValue: { x: '' }},
      ],
      imports: [ReactiveFormsModule, FormsModule, IonicModule, HttpClientTestingModule, RouterTestingModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailRoutePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
