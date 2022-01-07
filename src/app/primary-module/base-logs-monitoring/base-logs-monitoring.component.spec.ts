import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseLogsMonitoringComponent } from './base-logs-monitoring.component';

describe('BaseLogsMonitoringComponent', () => {
  let component: BaseLogsMonitoringComponent;
  let fixture: ComponentFixture<BaseLogsMonitoringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BaseLogsMonitoringComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseLogsMonitoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
