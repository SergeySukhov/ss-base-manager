import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { DatePipe } from '@angular/common'
import { v4 } from 'uuid';
import { AvailabilityNodes, BaseType } from 'src/app/shared/models/server-models/AvailableNormativeBaseType';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { TableControlDialogComponent } from './table-control-dialog/table-control-dialog.component';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AddNodeDialogComponent } from './table-add-node-dialog/add-node-dialog/add-node-dialog.component';
import { BaseTypePipe } from 'src/app/core/pipes/base-type.pipe';

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
})
export class TableControlComponent implements OnInit, AfterViewInit {
  @ViewChild(MatTable) table!: MatTable<BaseDataView>;
  @ViewChild(MatSort) sort!: MatSort;
  @Input() isAwaiting = false;
  @Input() set dataSource(value: BaseDataView[]) {
    this.data.splice(0);
    this.data.push(...value);
    if (this.table) {
      this.table.renderRows();
    }
    this.updateAllAvailableState();
  }
  @Input() set updNode(value: BaseDataView | null) {
    console.log("!! | @Input | value", value)
    if (!value) {
      return;
    }
    value.name = "!!!!!!";
    this.data.push(value);
    this.updateAllAvailableState();

    this.table.renderRows();

}

@Output() onAddNodes = new EventEmitter<{ viewData: BaseDataView, type: BaseType }[]>();
@Output() onRemoveNodes = new EventEmitter<BaseDataView[]>();
@Output() onEditedNodes = new EventEmitter<BaseDataView[]>();


availabilityNodes = AvailabilityNodes;
allAvailableState: "checked" | "unchecked" | "mixed" = "mixed";

editingRow: BaseDataView | null = null;
data: BaseDataView[] = [];
dataSourceTest = new MatTableDataSource(this.data);

displayedColumns: string[] = ['select', 'name', 'availability', 'baseType', 'cancelled', 'availableChilds', "handleEdit"];
selection = new SelectionModel<BaseDataView>(true, []);

constructor(public dialog: MatDialog, private baseTypePipe: BaseTypePipe) {
}

ngOnInit(): void {
  if(this.table) {
  this.table.renderRows();
}
  }

ngAfterViewInit() {
}

announceSortChange(sortState: any) {
  const unsorted = this.data.splice(0);
  if (sortState.active === "name") {
    if (sortState.direction === "desc") {
      const rootNodes = unsorted.filter(x => x.isRoot).sort(this.sortName).reverse();
      rootNodes.forEach(x => {
        this.data.push(x);
        this.data.push(...unsorted.filter(xx => xx.parentGuid === x.guid).sort(this.sortName).reverse());
      });
    } else {
      const rootNodes = unsorted.filter(x => x.isRoot).sort(this.sortName);
      rootNodes.forEach(x => {
        this.data.push(x);
        this.data.push(...unsorted.filter(xx => xx.parentGuid === x.guid).sort(this.sortName));
      });
    }
  }
  if (sortState.active === "baseType") {
    if (sortState.direction === "desc") {
      const rootNodes = unsorted.filter(x => x.isRoot).sort(this.sortType).reverse();
      rootNodes.forEach(x => {
        this.data.push(x);
        this.data.push(...unsorted.filter(xx => xx.parentGuid === x.guid).sort(this.sortType).reverse());
      });
    } else {
      const rootNodes = unsorted.filter(x => x.isRoot).sort(this.sortType);
      rootNodes.forEach(x => {
        this.data.push(x);
        this.data.push(...unsorted.filter(xx => xx.parentGuid === x.guid).sort(this.sortType));
      });
    }
  }
  this.table.renderRows();
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
    this.onEditedNodes.emit([rowData]);

    this.data.filter(x => x.parentGuid === rowData.guid).forEach(x => {
      this.toggleChange(value, x);
    });
  } else {
    rowData.availability = "awaiting";
    setTimeout(() => {
      rowData.availability = value;
      this.onEditedNodes.emit([rowData]);
      this.updateAllAvailableState();
    }, 1000);
  }
  this.updateAllAvailableState();
}

toggleGlobalChange(isAllAvailable: boolean) {
  this.data.forEach(x => {
    x.availability = isAllAvailable;
  });
  this.updateAllAvailableState();

  this.onEditedNodes.emit(this.data);
}

startNameEdit(row: BaseDataView, editInput: any) {
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
  const dialogRef = this.dialog.open(AddNodeDialogComponent, {
    width: '650px',
    data: this.data.filter(x => x.isRoot).map(x => x.data.type),
  });

  dialogRef.afterClosed().subscribe(result => {
    console.log("!! | dialogRef.afterClosed | result", result)
    if (!result) {
      return;
    }

    const newNode: BaseDataView = {
      guid: v4(),
      availability: false,
      name: this.baseTypePipe.transform(result),
      baseTypeName: this.baseTypePipe.transform(result),
      isCancelled: false,
      isRoot: true,
      hasChildren: false,
    }

    this.onAddNodes.emit([{ viewData: newNode, type: result }]);

    this.table.renderRows();
    this.updateAllAvailableState();
  });


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

checkboxLabel(row ?: BaseDataView): string {
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
    // this.data.filter(x => x.parentGuid === row.guid).forEach(x => {
    //   this.rowSelected(value, x);
    // });
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

onHandleEdit(row: BaseDataView) {
  const forbiddenKeys = ["guid", "type", "isAvailable", "parentBaseType"]
  const dialogRef = this.dialog.open(TableControlDialogComponent, {
    width: '650px',
    data: { data: row.data, disabledKeys: forbiddenKeys },
  });

  dialogRef.afterClosed().subscribe(result => {
    if (!result) {
      return;
    }
    row.data = result;
    this.onEditedNodes.emit([row]);
  });
}
  private sortName(a: BaseDataView, b: BaseDataView): number {
  return a.name === b.name ? 0 : a.name > b.name ? 1 : -1;
}
  private sortType(a: BaseDataView, b: BaseDataView): number {
  return a.name === b.name ? 0 : a.name > b.name ? 1 : -1;
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
