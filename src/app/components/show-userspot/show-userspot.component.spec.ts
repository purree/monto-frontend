import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import attractions from '../,,/../../../testUtils/fixtures/attractions';
import { ShowUserspotComponent } from './show-userspot.component';

describe('ShowUserspotComponent', () => {
  let component: ShowUserspotComponent;
  let fixture: ComponentFixture<ShowUserspotComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowUserspotComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowUserspotComponent);
    component = fixture.componentInstance;
    component.userSpot = attractions[0];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have fact title', () => {
    const popup = fixture.nativeElement;
    const title = popup.querySelectorAll('ion-card-title')[0];
    expect(title.textContent).toContain(attractions[0].titleEnglish);
  });

  it('should have description', () => {
    const popup = fixture.nativeElement;
    const text = popup.querySelectorAll('p')[0];
    expect(text.textContent).toContain(attractions[0].description);
  });

  it('should not have button if not creator', () => {
    component.isRouteCreator = false;
    const popup = fixture.nativeElement;
    const buttons = popup.querySelectorAll('ion-button');
    expect(buttons.length).toEqual(0);
  });

  it('should have button if creator', () => {
    component.isRouteCreator = true;
    fixture.detectChanges();
    const popup = fixture.nativeElement;
    const buttons = popup.querySelectorAll('ion-button');
    expect(buttons.length).toEqual(1);
  });

});
