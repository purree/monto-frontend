import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailCreatorPage } from './detail-creator.page';

describe('DetailCreatorPage', () => {
  let component: DetailCreatorPage;
  let fixture: ComponentFixture<DetailCreatorPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailCreatorPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
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
