import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IonicModule } from '@ionic/angular';

import { CreateRoutePage } from './create-route.page';
import { RouterTestingModule } from '@angular/router/testing';

describe('CreateRoutePage', () => {
  let component: CreateRoutePage;
  let fixture: ComponentFixture<CreateRoutePage>;

  const formBuilder: FormBuilder = new FormBuilder();


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateRoutePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: Storage, useValue: '' },
      ],
      imports : [FormsModule, ReactiveFormsModule, HttpClientTestingModule, RouterTestingModule, IonicModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateRoutePage);
    component = fixture.componentInstance;
    component.ngOnInit();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
