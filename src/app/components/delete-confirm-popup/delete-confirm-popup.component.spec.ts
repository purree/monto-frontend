import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteConfirmPopupComponent } from './delete-confirm-popup.component';

describe('DeleteConfirmPopupComponent', () => {
  let component: DeleteConfirmPopupComponent;
  let fixture: ComponentFixture<DeleteConfirmPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteConfirmPopupComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteConfirmPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should have "are you sure" text', () => {
    const popup = fixture.nativeElement;
    const p = popup.querySelectorAll('p')[0];
    expect(p.innerText).toContain('Are you sure you want to delete this?');
  });

  it('should have yes/no buttons', () => {
    const popup = fixture.nativeElement;
    const buttons = popup.querySelectorAll('ion-button');
    expect(buttons.length).toEqual(2);
  });

});
