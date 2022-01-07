import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AvailableBaseAdditionInfo } from 'src/app/shared/models/server-models/AvailableBaseAdditionInfo';
import { BaseDataView } from '../table-control.component';

@Component({
  selector: 'ss-table-control-dialog',
  templateUrl: './table-control-dialog.component.html',
  styleUrls: ['./table-control-dialog.component.scss']
})
export class TableControlDialogComponent implements OnInit {

  errorMessage = "";

  objKeyValues: { key: string, value: string }[] = [];
  editingCopy: any;

  constructor(public dialogRef: MatDialogRef<TableControlDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { data: any, disabledKeys: string[] },) { }

  ngOnInit(): void {
    try {
      this.editingCopy = JSON.parse(JSON.stringify(this.data.data));
      for (const [key, value] of Object.entries(this.data.data)) {
        let objValue: string = "";
        objValue = JSON.stringify(value);
        if (this.isKeyDisabled(key)) {
          this.objKeyValues.push({ key, value: objValue });
        } else {
          this.objKeyValues.unshift({ key, value: objValue });
        }
      }
    } catch (exp) {
      this.errorMessage = "!! ошибка json";
    }


  }

  isKeyDisabled(key: string) {
    return this.data.disabledKeys.includes(key);
  }

  handleKey(event: KeyboardEvent) {
    if (event.key === "Escape") {
      this.dialogRef.close();
    }

    if (event.key === "Enter" && !this.errorMessage) {
      this.dialogRef.close(this.data);
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  valueChange(value: string) {
    this.toObj();
  }

  toObj() {
    this.errorMessage = "";
    try {
      for (const pair of this.objKeyValues) {
        this.editingCopy[pair.key] = JSON.parse(pair.value);
      }
      console.log("!! | toObj | this.editingCopy", this.editingCopy)
      if (this.editingCopy && this.isInstanseOfObj(this.editingCopy)) {
        this.errorMessage = "Некорректный тип поля";
      }
    } catch (e) {
      this.errorMessage = "Некорректный тип поля";

    }
  }

  isInstanseOfObj(object: any): boolean {
    const keys = Object.keys(object);
    const dataKeys = Object.keys(object);
    if (dataKeys.length !== keys.length) {
      return false;
    }
    for (let key of keys) {
      if (!(key in this.data.data) || (typeof key !== typeof this.data.data[key])) {
        return false;
      }
    }
    return true;
  }

}
