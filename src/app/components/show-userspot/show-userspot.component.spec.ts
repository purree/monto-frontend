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
});
