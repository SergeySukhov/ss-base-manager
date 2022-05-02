import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultipleUploaderComponent } from './multiple-uploader.component';

describe('MultipleUploaderComponent', () => {
  let component: MultipleUploaderComponent;
  let fixture: ComponentFixture<MultipleUploaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultipleUploaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultipleUploaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
