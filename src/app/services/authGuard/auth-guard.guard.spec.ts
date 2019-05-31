import { TestBed, async, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { Storage } from '@ionic/storage';

import { AuthGuard } from './auth-guard.guard';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthService } from '../auth/auth.service';
import  authServiceMock from '../../../testUtils/mocks/authService';


describe('AuthGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthGuard,
        { provide: GooglePlus, useValue: '' },
        { provide: Storage, useValue: ''},
        { provide: AuthService, useValue: authServiceMock },
      ],
      imports: [RouterTestingModule.withRoutes([]), HttpClientTestingModule],
    });
  });

  it('should ...', inject([AuthGuard], (guard: AuthGuard) => {
    expect(guard).toBeTruthy();
  }));
});
