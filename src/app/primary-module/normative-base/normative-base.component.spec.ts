import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NormativeBaseComponent } from './normative-base.component';

describe('NormativeBaseComponent', () => {
  let component: NormativeBaseComponent;
  let fixture: ComponentFixture<NormativeBaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NormativeBaseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NormativeBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
