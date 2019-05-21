import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditReviewPage } from './edit-review.page';

describe('EditReviewPage', () => {
  let component: EditReviewPage;
  let fixture: ComponentFixture<EditReviewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditReviewPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditReviewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
