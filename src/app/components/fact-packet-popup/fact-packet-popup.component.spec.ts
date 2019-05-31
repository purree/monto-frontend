import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import attractions from '../,,/../../../testUtils/fixtures/attractions';
import { FactPacketPopupComponent } from './fact-packet-popup.component';
import { By } from '@angular/platform-browser';

describe('FactPacketPopupComponent', () => {
  let de: DebugElement;
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
    de = fixture.debugElement;    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have title', () => {
    const item = de.query(By.css('ion-card-title'));
    const content = item.nativeElement;
    expect(content.innerText).toContain(attractions[0].titleEnglish);
  });

  it('should have description', () => {
    const item = de.query(By.css('p'));
    const content = item.nativeElement;
    expect(content.innerText).toContain(attractions[0].description);
  });

});
