import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import attractions from '../,,/../../../testUtils/fixtures/attractions';
import { FactPacketPopupComponent } from './fact-packet-popup.component';

describe('FactPacketPopupComponent', () => {
  let component: FactPacketPopupComponent;
  let fixture: ComponentFixture<FactPacketPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FactPacketPopupComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FactPacketPopupComponent);
    component = fixture.componentInstance;
    component.fact = attractions[0];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
