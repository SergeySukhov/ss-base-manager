import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableControlDialogComponent } from './table-control-dialog.component';

describe('TableControlDialogComponent', () => {
  let component: TableControlDialogComponent;
  let fixture: ComponentFixture<TableControlDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TableControlDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TableControlDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
