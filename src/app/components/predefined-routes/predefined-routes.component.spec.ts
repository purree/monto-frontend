import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Storage } from '@ionic/storage';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApiServiceMock } from '../../../testUtils/mocks/apiService';
import { ApiService } from 'src/app/api.service';
import predefinedRoutes from '../../../testUtils/fixtures/predefinedRoutes';


import { PredefinedRoutesComponent } from './predefined-routes.component';

describe('PredefinedRoutesComponent', () => {
  let component: PredefinedRoutesComponent;
  let fixture: ComponentFixture<PredefinedRoutesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PredefinedRoutesComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [HttpClientTestingModule],
      providers: [
        { provide: ApiService, useValue: new ApiServiceMock() }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PredefinedRoutesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it('should have predefined route count', () => {
    const app = fixture.nativeElement;
    const routeItems = app.querySelectorAll('ion-card-subtitle');
    expect(routeItems.length).toEqual(predefinedRoutes._embedded.routes.length);
  });

  it('should have right predefined route options', () => {
    const app = fixture.nativeElement;
    const routeItems = app.querySelectorAll('ion-card-subtitle');
    expect(routeItems[0].textContent).toContain(predefinedRoutes._embedded.routes[0].routeName);
    expect(routeItems[1].textContent).toContain(predefinedRoutes._embedded.routes[1].routeName);
    expect(routeItems[2].textContent).toContain(predefinedRoutes._embedded.routes[2].routeName);
    expect(routeItems[3].textContent).toContain(predefinedRoutes._embedded.routes[3].routeName);
    expect(routeItems[4].textContent).toContain(predefinedRoutes._embedded.routes[4].routeName);
  });

});
