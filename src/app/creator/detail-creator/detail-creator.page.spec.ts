import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { Storage } from '@ionic/storage';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { DetailCreatorPage } from './detail-creator.page';

describe('DetailCreatorPage', () => {
  let component: DetailCreatorPage;
  let fixture: ComponentFixture<DetailCreatorPage>;
  let route: ActivatedRoute;
  let storage: Storage;
  let http: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [DetailCreatorPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [{
        provide: ActivatedRoute, useValue: {
          params: { id: 1 }
        }
      }, {
        provide: Storage, useValue: {
          x: ''
        }
      }
      ]
    })
      .compileComponents();

    http = TestBed.get(HttpClient);
    httpTestingController = TestBed.get(HttpTestingController);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailCreatorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
