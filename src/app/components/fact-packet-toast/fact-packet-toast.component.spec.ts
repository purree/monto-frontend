import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FactPacketToastComponent } from './fact-packet-toast.component';

describe('FactPacketToastComponent', () => {
  let component: FactPacketToastComponent;
  let fixture: ComponentFixture<FactPacketToastComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FactPacketToastComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FactPacketToastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
