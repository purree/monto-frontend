import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Storage } from '@ionic/storage';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ApiServiceMock } from '../../../testUtils/mocks/apiService';
import { StorageMock } from '../../../testUtils/mocks/storage';



import { CreateReviewPage } from './create-review.page';
import { ApiService } from 'src/app/api.service';
import reviews from 'src/testUtils/fixtures/reviews';

describe('CreateReviewPage', () => {
  let component: CreateReviewPage;
  let fixture: ComponentFixture<CreateReviewPage>;
  let storageMock = new StorageMock();


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CreateReviewPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: ApiService, useValue: new ApiServiceMock() },
        { provide: Storage, useValue: storageMock },{
          provide: ActivatedRoute, useValue: {
            snapshot: { paramMap: { get: function () { return 1 } } }
          }
        }
      ],
      imports: [
        IonicModule,
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule,
        HttpClientTestingModule
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateReviewPage);
    component = fixture.componentInstance;
    //let rating = component.reviewForm.controls['rating'];
    //rating.setValue(0);
    //let comment = component.reviewForm.controls['comment'];
    //comment.setValue('');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have five radios', () => {
    const page = fixture.nativeElement;
    const radios = page.querySelectorAll('ion-radio');
    expect(radios.length).toEqual(5);
  });

  it('should have a textarea', () => {
    const page = fixture.nativeElement;
    const textarea = page.querySelectorAll('ion-textarea');
    expect(textarea.length).toEqual(1);
  });
  
  it('should have a submitBtn', () => {
    const page = fixture.nativeElement;
    const submitBtn = page.querySelectorAll('ion-button');
    expect(submitBtn).toBeTruthy();
  });
});
