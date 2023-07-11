import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ApoderadoPage } from './apoderado.page';

describe('ApoderadoPage', () => {
  let component: ApoderadoPage;
  let fixture: ComponentFixture<ApoderadoPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ApoderadoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
