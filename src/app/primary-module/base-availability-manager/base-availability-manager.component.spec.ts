import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseAvailabilityManagerComponent } from './base-availability-manager.component';

describe('BaseAvailabilityManagerComponent', () => {
  let component: BaseAvailabilityManagerComponent;
  let fixture: ComponentFixture<BaseAvailabilityManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BaseAvailabilityManagerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseAvailabilityManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
