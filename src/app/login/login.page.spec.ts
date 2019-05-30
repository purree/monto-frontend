
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { Storage } from '@ionic/storage';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { StorageMock } from '../../testUtils/mocks/storage';
import  authServiceMock from '../../testUtils/mocks/authService';
import { LoginPage } from './login.page';
import { AuthService } from '../services/auth/auth.service';

describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;
  let storageMock = new StorageMock(); 

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoginPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: GooglePlus, useValue: { x: '' } },
        { provide: AuthService, useValue: authServiceMock },
      ],
      imports: [RouterTestingModule.withRoutes([]), HttpClientTestingModule],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have sign-in button if not loading', () => {
    component.loading = false;
    fixture.detectChanges();
    const page = fixture.nativeElement;
    const items = page.querySelectorAll('ion-button');
    expect(items.length).toEqual(1);
  });
 
  it('should not have sign-in button if loading', () => {
    component.loading = true;
    fixture.detectChanges();
    const page = fixture.nativeElement;
    const items = page.querySelectorAll('ion-button');
    expect(items.length).toEqual(0);
  });

  it('should have sign-in button text if not loading', () => {
    component.loading = false;
    fixture.detectChanges();
    const page = fixture.nativeElement;
    const btn = page.querySelectorAll('ion-button')[0];
    expect(btn.textContent).toContain('Sign in with Google');
  });

  it('should have spinner if loading', () => {
    component.loading = true;
    fixture.detectChanges();
    const page = fixture.nativeElement;
    const spinner = page.querySelectorAll('ion-spinner');
    expect(spinner.length).toEqual(1);
  });

});