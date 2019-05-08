import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailRoutePage } from './detail-route.page';

describe('DetailRoutePage', () => {
  let component: DetailRoutePage;
  let fixture: ComponentFixture<DetailRoutePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailRoutePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
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
