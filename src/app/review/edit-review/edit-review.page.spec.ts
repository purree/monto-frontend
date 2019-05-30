import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Storage } from '@ionic/storage';

import { EditReviewPage } from './edit-review.page';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ApiService } from 'src/app/api.service';
import { ApiServiceMock } from 'src/testUtils/mocks/apiService';
import { ActivatedRoute } from '@angular/router';
import reviews from 'src/testUtils/fixtures/reviews';

describe('EditReviewPage', () => {
  let component: EditReviewPage;
  let fixture: ComponentFixture<EditReviewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EditReviewPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [{ provide: ApiService, useValue: new ApiServiceMock() },
      { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: function () { return 1 } } } } }
      ],
      imports: [ReactiveFormsModule, FormsModule, IonicModule, HttpClientTestingModule, RouterTestingModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditReviewPage);
    component = fixture.componentInstance;
    component.review = reviews[0];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
