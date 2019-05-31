import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import routes from '../../../testUtils/fixtures/routes';

import { RouteCompletedComponent } from './route-completed.component';

describe('RouteCompletedComponent', () => {
  let component: RouteCompletedComponent;
  let fixture: ComponentFixture<RouteCompletedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RouteCompletedComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RouteCompletedComponent);
    component = fixture.componentInstance;
    component.activeRoute = routes[0];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have activeRoute title', () => {
    const popup = fixture.nativeElement;
    const title = popup.querySelectorAll('ion-card-title')[0];
    expect(title.textContent).toContain(`You finished the ${routes[0].routeName}!`);
  });

  it('should have message', () => {
    const popup = fixture.nativeElement;
    const text = popup.querySelectorAll('p')[0];
    expect(text.textContent).toContain('You did it! ✌️ Share this route with a friend or leave a review to express your feelings.');
  });

  it('should have two buttons', () => {
    const popup = fixture.nativeElement;
    const buttons = popup.querySelectorAll('ion-button');
    expect(buttons.length).toEqual(2);
  });

  it('should have correct button text', () => {
    const popup = fixture.nativeElement;
    const buttons = popup.querySelectorAll('ion-button');
    expect(buttons[0].textContent).toContain('Review');
    expect(buttons[1].textContent).toContain('Share');
  });


});
