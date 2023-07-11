import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DirectivoPage } from './directivo.page';

describe('DirectivoPage', () => {
  let component: DirectivoPage;
  let fixture: ComponentFixture<DirectivoPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(DirectivoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
