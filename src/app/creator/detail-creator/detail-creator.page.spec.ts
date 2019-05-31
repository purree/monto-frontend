import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { DetailCreatorPage } from './detail-creator.page';
import { ApiService } from 'src/app/api.service';
import { ApiServiceMock } from 'src/testUtils/mocks/apiService';
import creators from 'src/testUtils/fixtures/creators';

describe('DetailCreatorPage', () => {
  let component: DetailCreatorPage;
  let fixture: ComponentFixture<DetailCreatorPage>;
  let creator;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DetailCreatorPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [{
        provide: ActivatedRoute, useValue: {
          snapshot: { paramMap: { get: function () { return 1 } } }
        }
      }, { provide: ApiService, useValue: new ApiServiceMock() }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailCreatorPage);
    component = fixture.componentInstance;
    creator = creators._embedded.creators[0];
    component.creator = creator;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have title', () => {
    const page = fixture.nativeElement;
    const title = page.querySelectorAll('ion-title')[0];
    expect(title.textContent).toContain('Creator');
  });

  it('should have creators name', () => {
    const page = fixture.nativeElement;
    const text = page.querySelectorAll('h2')[0];
    expect(text.textContent).toContain(`${creator.firstName} ${creator.lastName}`);
  });

  it('should have creators description', () => {
    const page = fixture.nativeElement;
    const text = page.querySelectorAll('p')[0];
    expect(text.textContent).toContain(creator.description);
  });

  it('should have creators statues listed', () => {
    const page = fixture.nativeElement;
    const items = page.querySelectorAll('ion-item');
    expect(items.length).toEqual(creator.attractions.length);
  });

  it('should have creators statues listed with name', () => {
    const page = fixture.nativeElement;
    const items = page.querySelectorAll('ion-item');
    expect(items[0].textContent).toEqual(creator.attractions[0].titleEnglish);
    expect(items[1].textContent).toEqual(creator.attractions[1].titleEnglish);
  });

});
