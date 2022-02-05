import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexBaseComponent } from './index-base.component';

describe('IndexBaseComponent', () => {
  let component: IndexBaseComponent;
  let fixture: ComponentFixture<IndexBaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndexBaseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IndexBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
