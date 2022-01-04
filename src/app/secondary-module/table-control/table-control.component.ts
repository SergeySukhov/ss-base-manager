import { SelectionModel } from '@angular/cdk/collections';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { DatePipe } from '@angular/common'
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { v4 } from 'uuid';

export interface BaseDataView {
  guid: string;
  name: string;
  position: number;
  availability: boolean | "awaiting";
  changeDate: string | null;
  isRoot?: boolean;
  hasChildren?: boolean;
  parentGuid?: string;
  isExpand?: boolean;
  isHide?: boolean;
}

@Component({
  selector: 'ss-table-control',
  templateUrl: './table-control.component.html',
  styleUrls: ['./table-control.component.scss'],
  providers: [DatePipe]
})
export class TableControlComponent implements OnInit {
  @ViewChild(MatTable) table!: MatTable<BaseDataView>;

  @Input() set dataSourceTemp(value: string[]) {
    this.data.splice(0);
    const rootGuid = v4();
    this.data.push({
      guid: rootGuid,
      position: 1,
      name: "Root",
      isRoot: true,
      isExpand: true,
      availability: true,
      changeDate: this.datepipe.transform(Date.now(), 'HH:mm, dd-MM-yyyy'),
      hasChildren: true,
    });
    value.forEach((x, index) => {
      this.data.push({
        guid: v4(),
        position: index + 2,
        name: x,
        availability: true,
        changeDate: this.datepipe.transform(Date.now(), 'HH:mm, dd-MM-yyyy'),
        parentGuid: rootGuid,
      });
    });
    const rootGuid2 = v4();
    this.data.push({
      guid: rootGuid2,
      position: 1,
      name: "Root",
      isRoot: true,
      isExpand: true,
      availability: true,
      changeDate: this.datepipe.transform(Date.now(), 'HH:mm, dd-MM-yyyy'),
      hasChildren: true,
    });
    value.forEach((x, index) => {
      this.data.push({
        guid: v4(),
        position: index + 2,
        name: x,
        availability: true,
        changeDate: this.datepipe.transform(Date.now(), 'HH:mm, dd-MM-yyyy'),
        parentGuid: rootGuid2,
      });
    });
    if (this.table) {
      this.table.renderRows();
    }

    this.updateAllAvailableState();
  }

  @Output() onAddNodes = new EventEmitter<string[]>();
  @Output() onRemoveNodes = new EventEmitter<string[]>();
  @Output() onEditedNodes = new EventEmitter<BaseDataView[]>();

  allAvailableState: "checked" | "unchecked" | "mixed" = "mixed";
  editingRow: BaseDataView | null = null;
  data: BaseDataView[] = [];

  displayedColumns: string[] = ['select', 'position', 'name', 'availability', 'changeDate'];
  selection = new SelectionModel<BaseDataView>(true, []);

  constructor(public datepipe: DatePipe) { }

  ngOnInit(): void {
  }

  onRootExpandClick(row: BaseDataView) {
    row.isExpand = !row.isExpand;
    if (row.isExpand) {
      this.showChildrenRows(row.guid);
    } else {
      this.hideChildrenRows(row.guid);
    }
    this.table.renderRows();
  }

  showChildrenRows(parentGuid: string) {
    this.data.filter(x => x.parentGuid === parentGuid).forEach(x => {
      x.isHide = false;
    });
  }

  hideChildrenRows(parentGuid: string) {
    this.data.filter(x => x.parentGuid === parentGuid).forEach(x => {
      x.isHide = true;
    });
  }

  toggleChange(value: boolean, rowData: BaseDataView) {
    if (rowData.isRoot) {
      this.data.filter(x => x.parentGuid === rowData.guid).forEach(x => {
        this.toggleChange(value, x);
      });
    } else {
      rowData.availability = "awaiting";
      setTimeout(() => {
        rowData.availability = value;
        this.onEditedNodes.emit([rowData]);
      }, 1000);
    }
    this.updateAllAvailableState();

  }

  toggleGlobalChange(event: MatButtonToggleChange) {
    this.data.forEach(x => {
      x.availability = event.value === "checked";
    });
    this.onEditedNodes.emit(this.data);
  }

  startNameEdit(row: BaseDataView, editInput: HTMLInputElement) {
    setTimeout(() => {
      editInput.focus();
    });
    editInput.value = row.name;
    this.editingRow = row;
  }

  onNameEditing(event: KeyboardEvent, value: string) {
    if (event.key === "Enter") {
      this.finishEditing(value, false);
    } else if (event.key === "Escape") {
      this.finishEditing("", true);

    }
  }

  finishEditing(value: string, isCancel: boolean) {
    if (!isCancel && this.editingRow) {
      this.editingRow.name = value;
      this.onEditedNodes.emit([this.editingRow]);
    }
    this.editingRow = null;
  }

  addData() {
    this.data.push({
      guid: v4(),
      availability: false,
      changeDate: this.datepipe.transform(Date.now()),
      name: "Новый корневой узел",
      position: 0,
      isRoot: true,
      hasChildren: false,

    });
    this.table.renderRows();
    this.updateAllAvailableState();
  }

  removeData() {
    if (this.selection.selected.length) {
      this.selection.selected.forEach(x => {
        const idx = this.data.findIndex(xx => xx.guid === x.guid);
        if (idx > -1) {
          this.data.splice(idx, 1);
        }
      });
    }
    this.selection.clear();
    this.table.renderRows();

    this.updateAllAvailableState();
  }

  updateAllAvailableState() {
    const allAvailable = this.data.filter(x => !x.isRoot).every(x => x.availability === true);
    const noAvailable = this.data.filter(x => !x.isRoot).every(x => x.availability === false);
    this.allAvailableState = allAvailable ? "checked" : (noAvailable ? "unchecked" : "mixed");
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.data.filter(x => !x.isRoot).length;
    return numSelected === numRows;
  }

  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.data.filter(x => !x.isRoot));
  }

  checkboxLabel(row?: BaseDataView): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  onRowClick(row: BaseDataView) {
    if (row.isRoot) {
      return;
    }
    this.selection.toggle(row)
  }
}
