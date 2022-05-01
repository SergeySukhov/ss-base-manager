import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadProcessCardComponent } from './upload-process-card.component';

describe('UploadProcessCardComponent', () => {
  let component: UploadProcessCardComponent;
  let fixture: ComponentFixture<UploadProcessCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadProcessCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadProcessCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
