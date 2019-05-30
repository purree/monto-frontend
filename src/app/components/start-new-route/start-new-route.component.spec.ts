import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StartNewRouteComponent } from './start-new-route.component';
import routes from 'src/testUtils/fixtures/routes';

describe('StartNewRouteComponent', () => {
  let component: StartNewRouteComponent;
  let fixture: ComponentFixture<StartNewRouteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StartNewRouteComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StartNewRouteComponent);
    component = fixture.componentInstance;
    component.activeRoute = routes[0];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should title from activeRoute', () => {
    const popup = fixture.nativeElement;
    const title = popup.querySelectorAll('ion-card-title')[0];
    expect(title.textContent).toContain(routes[0].routeName);
  });

  it('should have count of statues', () => {
    const popup = fixture.nativeElement;
    const text = popup.querySelectorAll('p')[0];
    expect(text.textContent).toContain(`${routes[0].attractions.length} statues in route`);
  });

  it('should two alternatives', () => {
    const popup = fixture.nativeElement;
    const buttons = popup.querySelectorAll('ion-button');
    expect(buttons.length).toEqual(2);
  });

  it('should Walk now/Edit route alternatives', () => {
    const popup = fixture.nativeElement;
    const buttons = popup.querySelectorAll('ion-button');
    expect(buttons[0].textContent).toContain('Walk now');
    expect(buttons[1].textContent).toContain('Edit route');
  });
});
