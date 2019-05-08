import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyRoutesPage } from './my-routes.page';

describe('MyRoutesPage', () => {
  let component: MyRoutesPage;
  let fixture: ComponentFixture<MyRoutesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyRoutesPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyRoutesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
