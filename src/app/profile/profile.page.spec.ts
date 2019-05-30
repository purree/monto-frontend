import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilePage } from './profile.page';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { StorageMock } from 'src/testUtils/mocks/storage';
import { Storage } from '@ionic/storage';
import user from 'src/testUtils/fixtures/user';


describe('ProfilePage', () => {
  let component: ProfilePage;
  let fixture: ComponentFixture<ProfilePage>;
  let storageMock = new StorageMock();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ ProfilePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [{ provide: Storage, useValue: storageMock }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfilePage);
    component = fixture.componentInstance;
    component.user = user;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have title "Profile"', () => {
    const page = fixture.nativeElement;
    const title = page.querySelectorAll('ion-title')[0];
    expect(title.textContent).toContain('Profile');
  });

  it('should have two inputs', () => {
    const page = fixture.nativeElement;
    const inputs = page.querySelectorAll('ion-input');
    expect(inputs.length).toEqual(2);
  });

  it('should have username', () => {
    const page = fixture.nativeElement;
    const input = page.querySelectorAll('ion-input')[0];
    expect(input.textContent).toContain(user.username);
  });

  it('should have email', () => {
    const page = fixture.nativeElement;
    const input = page.querySelectorAll('ion-input')[1];
    expect(input.textContent).toContain(user.email);
  });

  it('should have picture', () => {
    const page = fixture.nativeElement;
    const img = page.querySelectorAll('img')[0];
    expect(img.getAttribute(['src'])).toContain(user.profilePicture);
  });
});
