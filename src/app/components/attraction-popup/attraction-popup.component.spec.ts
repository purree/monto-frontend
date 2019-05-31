import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import attractions from '../,,/../../../testUtils/fixtures/attractions';
import { AttractionPopupComponent } from './attraction-popup.component';
import { By } from '@angular/platform-browser';

describe('AttractionPopupComponent', () => {
  let de: DebugElement;
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
    de = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Check description', () => {
    const item = de.query(By.css('p'));
    const content = item.nativeElement;
    expect(content.innerText).toContain('You\'ve arrived at the "' + attractions[0].titleEnglish + '" monument.');
  });

  it('Check buttons', () => {
    const items = de.queryAll(By.css('ion-button'));
    expect(items.length).toEqual(2);
  });

});
