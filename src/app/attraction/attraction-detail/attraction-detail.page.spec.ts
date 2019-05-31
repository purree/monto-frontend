import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Storage } from '@ionic/storage';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import attractions from '../../../testUtils/fixtures/attractions';

import { AttractionDetailPage } from './attraction-detail.page';
import { By } from '@angular/platform-browser';

describe('AttractionDetailPage', () => {
  let de: DebugElement;
  let component: AttractionDetailPage;
  let fixture: ComponentFixture<AttractionDetailPage>;
  let route: ActivatedRoute;
  let http: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [AttractionDetailPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: ActivatedRoute, useValue: { params: { id: 1 } } },
        { provide: Storage, useValue: { x: '' } }
      ]
    })
      .compileComponents();

    http = TestBed.get(HttpClient);
    httpTestingController = TestBed.get(HttpTestingController);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttractionDetailPage);
    component = fixture.componentInstance;
    component.attraction = attractions[0];
    fixture.detectChanges();

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Check title', () => {
    de = fixture.debugElement.query(By.css('h2'));
    const h2 = de.nativeElement;
    expect(h2.innerText).toContain(attractions[0].titleEnglish);
  });

  it('Check subtitle', () => {
    de = fixture.debugElement.query(By.css('h4'));
    const h4 = de.nativeElement;
    expect(h4.innerText).toContain(attractions[0].title);
  });

  it('Check description', () => {
    de = fixture.debugElement.query(By.css('p'));
    const p = de.nativeElement;
    expect(p.innerText).toContain(attractions[0].description);
  });
});
