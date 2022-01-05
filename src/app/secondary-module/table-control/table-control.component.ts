import { SelectionModel } from '@angular/cdk/collections';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { DatePipe } from '@angular/common'
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { v4 } from 'uuid';
import { AvailabilityNodes } from 'src/app/shared/models/server-models/AvailableNormativeBaseType';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { observable } from 'mobx';

export interface BaseDataView {
  guid: string;
  name: string;
  availability: boolean | "awaiting";
  baseTypeName: string;
  isCancelled: boolean;
  isRoot?: boolean;
  hasChildren?: boolean;
  parentGuid?: string;
  isExpand?: boolean;
  isHide?: boolean;
  availableChilds?: AvailabilityNodes[];
  data?: any;
}

@Component({
  selector: 'ss-table-control',
  templateUrl: './table-control.component.html',
  styleUrls: ['./table-control.component.scss'],
  providers: [DatePipe]
})
export class TableControlComponent implements OnInit {
  @ViewChild(MatTable) table!: MatTable<BaseDataView>;

  @Input() isAwaiting = false;
  @Input() set dataSource(value: BaseDataView[]) {
    console.log("!! | @Input | value", value)
    this.data.splice(0);
    this.data.push(...value);
    if (this.table) {
      this.table.renderRows();
    }
    this.updateAllAvailableState();
  }

  @Output() onAddNodes = new EventEmitter<BaseDataView[]>();
  @Output() onRemoveNodes = new EventEmitter<BaseDataView[]>();
  @Output() onEditedNodes = new EventEmitter<BaseDataView[]>();

  availabilityNodes = AvailabilityNodes;
  allAvailableState: "checked" | "unchecked" | "mixed" = "mixed";

  editingRow: BaseDataView | null = null;
  data: BaseDataView[] = [];

  displayedColumns: string[] = ['select', 'name', 'availability', 'baseType', 'cancelled', 'availableChilds'];
  selection = new SelectionModel<BaseDataView>(true, []);

  constructor(public datepipe: DatePipe) { }

  ngOnInit(): void {
    if (this.table) {
      this.table.renderRows();
    }
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
    if (!!rowData.isRoot) {
      rowData.availability = value;
      this.data.filter(x => x.parentGuid === rowData.guid).forEach(x => {
        this.toggleChange(value, x);
      });
    } else {
      rowData.availability = "awaiting";
      setTimeout(() => {
        rowData.availability = value;
      }, 1000);
    }
    this.onEditedNodes.emit([rowData]);
    this.updateAllAvailableState();
  }

  toggleGlobalChange(isAllAvailable: boolean) {
    this.data.forEach(x => {
      x.availability = isAllAvailable;
    });
    this.updateAllAvailableState();

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
    const newNode: BaseDataView = {
      guid: v4(),
      availability: false,
      name: "Новый корневой узел",
      baseTypeName: "",
      isCancelled: false,
      isRoot: true,
      hasChildren: false,
    }

    this.data.push(newNode);
    this.onAddNodes.emit([newNode]);

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
      this.onRemoveNodes.emit(this.selection.selected)
    }
    this.selection.clear();
    this.table.renderRows();

    this.updateAllAvailableState();
  }

  toggleAvailableChildChange(event: MatCheckboxChange, row: BaseDataView) {
    // TODO:
  }

  toggleCancelChange(value: boolean, row: BaseDataView) {
    row.isCancelled = value;
    this.onEditedNodes.emit([row]);

  }

  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.data.filter(this.filterDataSource));
  }

  checkboxLabel(row?: BaseDataView): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row `;
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.data.filter(this.filterDataSource).length;
    return numSelected === numRows;
  }

  rowSelected(value: boolean, row: BaseDataView) {
    if (row.hasChildren) {
      this.data.filter(x => x.parentGuid === row.guid).forEach(x => {
        this.rowSelected(value, x);
      });
    }
    if (value) {
      this.selection.select(...[row])
    } else {
      this.selection.deselect(...[row])
    }
  }

  onRowClick(row: BaseDataView) {
    this.rowSelected(!this.selection.isSelected(row), row)
  }

  isIncludeChildNodes(nodeType: AvailabilityNodes, row: BaseDataView): boolean {
    return !!row.availableChilds?.includes(nodeType);
  }

  private updateAllAvailableState() {
    const allAvailable = this.data.filter(this.filterDataSource).every(x => x.availability === true);
    const noAvailable = this.data.filter(this.filterDataSource).every(x => x.availability === false);
    this.allAvailableState = allAvailable ? "checked" : (noAvailable ? "unchecked" : "mixed");
  }

  private filterDataSource(value: BaseDataView): boolean {
    return true;
  }
}
