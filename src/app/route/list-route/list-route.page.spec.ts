import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListRoutePage } from './list-route.page';

describe('ListRoutePage', () => {
  let component: ListRoutePage;
  let fixture: ComponentFixture<ListRoutePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListRoutePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListRoutePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
