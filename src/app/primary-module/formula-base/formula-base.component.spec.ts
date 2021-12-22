import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormulaBaseComponent } from './formula-base.component';

describe('FormulaBaseComponent', () => {
  let component: FormulaBaseComponent;
  let fixture: ComponentFixture<FormulaBaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormulaBaseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormulaBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
