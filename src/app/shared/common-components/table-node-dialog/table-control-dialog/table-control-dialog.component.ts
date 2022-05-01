import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { KeyValueStr } from "src/app/shared/models/common/interfaces";

interface ParsedObj {
  pairs: KeyValueStr[];
  lvl: number;
  key: string;
  parentKey?: string;
}

@Component({
  selector: 'ss-table-control-dialog',
  templateUrl: './table-control-dialog.component.html',
  styleUrls: ['./table-control-dialog.component.scss']
})
export class TableControlDialogComponent implements OnInit {

  errorMessage = "";
  errorTooltip = "";
  processKey = "";

  objKeyValues: ParsedObj = { pairs: [], lvl: 0, key: "" };

  slaveObjs: ParsedObj[] = [];

  editingCopy: any;

  constructor(public dialogRef: MatDialogRef<TableControlDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { data: any, disabledKeys: string[] },) { }

  ngOnInit(): void {
    try {
      this.editingCopy = JSON.parse(JSON.stringify(this.data.data));
    } catch (e) {
      this.errorMessage = "!! Ошибка JSON";
      this.errorTooltip = "Исключение при работе с JSON, возможно объект содержал null|undefined или зацикленные связи";
    }
    try {
      this.objKeyValues.pairs.push(...this.getKeyValueFromObj(this.data.data));
    } catch (e) {
      this.errorMessage = "!! Ошибка обработки объекта";
      this.errorTooltip = "Необработанная ситуация в представлении объекта";
    }
  }

  getKeyValueFromObj(obj: any, lvl = 0): KeyValueStr[] {
    const result: { key: string, value: string }[] = [];
    for (const [key, value] of Object.entries(obj)) {
      if (value === null || value === undefined) {
        this.data.disabledKeys.push(key);
        result.push({ key, value: "null" });
        continue;
      }
      if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {

        let objValue: string = "";
        objValue = JSON.stringify(value);
        if (this.isKeyDisabled(key)) {
          result.push({ key, value: objValue });
        } else {
          result.unshift({ key, value: objValue });
        }

      } else {
        const sLvl = lvl++;
        if (sLvl > 1) continue;
        this.slaveObjs.push({
          pairs: this.getKeyValueFromObj(value, sLvl),
          lvl: sLvl,
          key: key
        });
      }
    }
    return result;
  }

  isKeyDisabled(key: string) {
    return this.data.disabledKeys.includes(key);
  }

  handleKey(event: KeyboardEvent) {
    if (event.key === "Escape") {
      this.dialogRef.close();
    }

    if (event.key === "Enter" && !this.errorMessage) {
      this.dialogRef.close(this.editingCopy);
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  valueChange(event: KeyboardEvent, pair: KeyValueStr, value: string) {
    if (pair.value !== value) {
      pair.value = value;
      this.toObj();
    }
  }

  toObj() {
    this.errorMessage = "";
    this.errorTooltip = "";
    this.processKey = "";
    try {
      for (const pair of this.objKeyValues.pairs) {
        this.processKey = pair.key;
        this.editingCopy[pair.key] = JSON.parse(pair.value);
      }

      for (let slaveObj of this.slaveObjs) {
        const sObj: { [key: string]: any } = {};
        for (const pair of slaveObj.pairs) {
          this.processKey = pair.key;
          sObj[pair.key] = JSON.parse(pair.value);
        }
        this.editingCopy[slaveObj.key] = sObj;
        if (!this.isInstanseOfObj(sObj, this.data.data[slaveObj.key])) {
          this.errorTooltip = "Некорректный тип поля дочернего объекта";
          this.errorMessage = "Некорректный тип поля";
          return;
        }
      }

      if (!this.editingCopy || !this.isInstanseOfObj(this.editingCopy, this.data.data)) {
        this.errorTooltip = "Некорректный тип поля объекта";
        this.errorMessage = "Некорректный тип поля";
        return;
      }
      this.processKey = "";
    } catch (e) {
      this.errorTooltip = "Исключение при работе с JSON, объект неправильного формата, объект содержал null|undefined или зацикленные связи";
      this.errorMessage = "Некорректный тип поля";

    }
  }

  isInstanseOfObj(targetObject: any, sourceObject: any): boolean {
    const keys = Object.keys(targetObject);
    const dataKeys = Object.keys(sourceObject);
    if (dataKeys.length !== keys.length) {
      return false;
    }

    for (let key of keys) {
      if (typeof sourceObject[key] === "object") {
        continue;
      }

      if (!(key in sourceObject) || (typeof targetObject[key] !== typeof sourceObject[key])) {
        this.processKey = key;
        return false;
      }
    }
    return true;
  }

}
