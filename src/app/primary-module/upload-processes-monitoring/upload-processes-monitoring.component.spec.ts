import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadProcessesMonitoringComponent } from './upload-processes-monitoring.component';

describe('UploadProcessesMonitoringComponent', () => {
  let component: UploadProcessesMonitoringComponent;
  let fixture: ComponentFixture<UploadProcessesMonitoringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadProcessesMonitoringComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadProcessesMonitoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
