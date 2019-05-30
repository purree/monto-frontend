import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Storage } from '@ionic/storage';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import attractions from '../../../testUtils/fixtures/attractions';
import { ListPage } from './list.page';
import { By } from '@angular/platform-browser';

describe('ListPage', () => {
  let de: DebugElement;
  let component: ListPage;
  let fixture: ComponentFixture<ListPage>;
  let listPage: HTMLElement;
  let storage: Storage;
  let http: HttpClient
  let httpTestingController: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ListPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [{
        provide: Storage, useValue: {
          auth: ''
        }
      }]
    })
      .compileComponents();
    http = TestBed.get(HttpClient);
    httpTestingController = TestBed.get(HttpTestingController);
  }));

  beforeEach(async () => {
    fixture = await TestBed.createComponent(ListPage);
    component = fixture.componentInstance;
    component.attractions = attractions;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a list of 3 elements', () => {
    listPage = fixture.nativeElement;
    const items = listPage.querySelectorAll('ion-item');
    expect(items.length).toEqual(3);
  });

  it('Check first item title', () => {
    const listPage = fixture.debugElement;
    const item = listPage.query(By.css('ion-item')).query(By.css('h2'));
    const h2 = item.nativeElement;
    expect(h2.innerText).toContain(attractions[0].titleEnglish);
  });

  it('Check first item subtitle', () => {
    const listPage = fixture.debugElement;
    const item = listPage.query(By.css('ion-item')).query(By.css('h3'));
    const h3 = item.nativeElement;
    expect(h3.innerText).toContain(attractions[0].title);
  });

});
