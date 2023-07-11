import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ColegioPage } from './colegio.page';

describe('ColegioPage', () => {
  let component: ColegioPage;
  let fixture: ComponentFixture<ColegioPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ColegioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
