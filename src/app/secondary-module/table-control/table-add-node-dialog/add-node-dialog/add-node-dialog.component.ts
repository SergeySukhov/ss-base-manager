
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BaseTypePipe } from 'src/app/core/pipes/base-type.pipe';
import { BaseType } from 'src/app/shared/models/server-models/AvailableNormativeBaseType';

@Component({
  selector: 'ss-add-node-dialog',
  templateUrl: './add-node-dialog.component.html',
  styleUrls: ['./add-node-dialog.component.scss'],
})
export class AddNodeDialogComponent implements OnInit {

  allTypes: string[] = [];

  constructor(public dialogRef: MatDialogRef<AddNodeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: BaseType[], private baseTypePipe: BaseTypePipe) {
     }

  ngOnInit(): void {
    Object.values(BaseType).forEach(x => {
      const type = Number.parseInt(x.toString());
      if (!isNaN(type)) {
        this.allTypes.push(this.baseTypePipe.transform(type));
      }
    });
  }

  isTypeDisabled(type: string): boolean {
    return this.data.map(x => this.baseTypePipe.transform(x)).includes(type);
  }

  handleKey(event: KeyboardEvent) {
    if (event.key === "Escape") {
      this.dialogRef.close();
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  valueChange(value: string) {
    Object.values(BaseType).forEach(x => {
      const type = Number.parseInt(x.toString());
      if (!isNaN(type) && this.baseTypePipe.transform(type) === value) {
        this.dialogRef.close(type);
      }
    });
  }
  
}

