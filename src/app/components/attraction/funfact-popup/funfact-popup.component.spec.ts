import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import attractions from '../../,,/../../../testUtils/fixtures/attractions';
import { FunfactPopupComponent } from './funfact-popup.component';
import { By } from '@angular/platform-browser';

describe('FunfactPopupComponent', () => {
  let de : DebugElement;
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

  it('Check description', () => {
    const funfact = fixture.debugElement;
    const item = funfact.query(By.css('ion-card-content'));
    const content = item.nativeElement;
    expect(content.innerText).toContain(attractions[0].funFact.description);
  });

});
