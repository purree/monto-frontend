import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import attractions from '../../,,/../../../testUtils/fixtures/attractions';
import { FunfactPopupComponent } from './funfact-popup.component';

describe('FunfactPopupComponent', () => {
  let component: FunfactPopupComponent;
  let fixture: ComponentFixture<FunfactPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FunfactPopupComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FunfactPopupComponent);
    component = fixture.componentInstance;
    component.funFact = attractions[0].funFact;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
