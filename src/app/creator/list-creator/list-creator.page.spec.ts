import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCreatorPage } from './list-creator.page';

describe('ListCreatorPage', () => {
  let component: ListCreatorPage;
  let fixture: ComponentFixture<ListCreatorPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListCreatorPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListCreatorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
