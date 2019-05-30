import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Storage } from '@ionic/storage';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { CreateUserspotComponent } from './create-userspot.component';
import attractions from '../../../testUtils/fixtures/attractions';
import { ApiServiceMock } from '../../../testUtils/mocks/apiService';
import { ApiService } from 'src/app/api.service';


describe('CreateUserspotComponent', () => {
  let component: CreateUserspotComponent;
  let fixture: ComponentFixture<CreateUserspotComponent>;
  let http: HttpClient;
  let storage: Storage;
  let httpTestingController: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CreateUserspotComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [HttpClientTestingModule],
      providers: [{
        provide: ApiService, useValue: new ApiServiceMock()
      }]
    })
      .compileComponents();

    http = TestBed.get(HttpClient);
    httpTestingController = TestBed.get(HttpTestingController);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateUserspotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have category options', () => {
    const app = fixture.nativeElement;
    const optionItems = app.querySelectorAll('ion-select-option');
    expect(optionItems.length).toEqual(6);
    expect(optionItems[0].textContent).toContain('Café');
    expect(optionItems[1].textContent).toContain('Vista');
    expect(optionItems[2].textContent).toContain('Bar');
    expect(optionItems[3].textContent).toContain('Restaurant');
    expect(optionItems[4].textContent).toContain('Fact');
    expect(optionItems[5].textContent).toContain('Other');
  });
 
  it('should have submit button', () => {
    const app = fixture.nativeElement;
    const button = app.querySelectorAll('ion-button')[0];
    expect(button.textContent).toContain('Add marker');
  });

});
