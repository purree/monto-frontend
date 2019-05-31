import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCreatorPage } from './list-creator.page';
import { ApiService } from 'src/app/api.service';
import { ApiServiceMock } from 'src/testUtils/mocks/apiService';
import creators from 'src/testUtils/fixtures/creators';
import { RouterTestingModule } from '@angular/router/testing';

describe('ListCreatorPage', () => {
  let component: ListCreatorPage;
  let fixture: ComponentFixture<ListCreatorPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [ ListCreatorPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [{ provide: ApiService, useValue: new ApiServiceMock() }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListCreatorPage);
    component = fixture.componentInstance;
    component.creators = creators._embedded.creators;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have title "Creators"', () => {
    const page = fixture.nativeElement;
    const title = page.querySelectorAll('ion-title')[0];
    expect(title.textContent).toContain('Creators');
  });

  it('should have searchBar', () => {
    const page = fixture.nativeElement;
    const sb = page.querySelectorAll('ion-searchbar')[0];
    expect(sb).toBeTruthy();
  });

  it('should have right count of creators in list', () => {
    const page = fixture.nativeElement;
    const items = page.querySelectorAll('ion-item');
    expect(items.length).toEqual(creators._embedded.creators.length);
  });

  it('should have right count of creators in list', () => {
    const page = fixture.nativeElement;
    const items = page.querySelectorAll('ion-item');
    expect(items.length).toEqual(creators._embedded.creators.length);
  });

  it('should display creator name in list', () => {
    const page = fixture.nativeElement;
    const label = page.querySelectorAll('ion-label')[0];
    let creator = creators._embedded.creators[0];
    expect(label.textContent).toContain(`${creator.firstName} ${creator.lastName}`);
  });

  it('should have link to detail-creator', async () => {
    const page = fixture.nativeElement;
    await fixture.detectChanges();
    const item = page.querySelectorAll('ion-item')[0];
    let creator = creators._embedded.creators[0];
    console.log(item)
    expect(item.getAttribute('ng-reflect-router-link')).toEqual(`/detail-creator/${creator.id}`);
  });
});
