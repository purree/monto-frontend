import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import attractions from '../,,/../../../testUtils/fixtures/attractions';
import { AttractionPopupComponent } from './attraction-popup.component';

describe('AttractionPopupComponent', () => {
  let component: AttractionPopupComponent;
  let fixture: ComponentFixture<AttractionPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttractionPopupComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttractionPopupComponent);
    component = fixture.componentInstance;
    component.attraction = attractions[0];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
