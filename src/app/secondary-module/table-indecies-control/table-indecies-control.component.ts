import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { DatePipe } from '@angular/common'
import { v4 } from 'uuid';
import { AvailabilityNodes, BaseType } from 'src/app/shared/models/server-models/AvailableNormativeBaseType';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatSort, Sort } from '@angular/material/sort';
import { BaseTypePipe } from 'src/app/core/pipes/base-type.pipe';
import { AddNodeDialogComponent } from 'src/app/shared/common-components/table-node-dialog/add-node-dialog/add-node-dialog.component';
import { TableControlDialogComponent } from 'src/app/shared/common-components/table-node-dialog/table-control-dialog/table-control-dialog.component';

export interface BaseIndeciesDataView {
  guid: string;
  name: string;
  availability: boolean;
  baseTypeName: string;
  isCancelled: boolean;
  isRoot?: boolean;
  hasChildren?: boolean;
  parentGuid?: string;
  isExpand?: boolean;
  isHide?: boolean;
  isVirtual?: boolean;
  availableChilds?: AvailabilityNodes[];
  data?: any;
}

@Component({
  selector: 'ss-table-control',
  templateUrl: './table-indecies-control.component.html',
  styleUrls: ['./table-indecies-control.component.scss'],
})
export class TableIndeciesControlComponent implements OnInit, AfterViewInit {
  @ViewChild(MatTable) table!: MatTable<BaseIndeciesDataView>;
  
  @ViewChild(MatSort) sort!: MatSort;


  @Input() isAwaiting = false;

  @Input() set dataSource(value: BaseIndeciesDataView[]) {
    this.data.splice(0);
    this.data.push(...value);
    if (this.table) {
      this.table.renderRows();
    }
    this.updateAllAvailableState();
  }
  @Input() set updNode(value: BaseIndeciesDataView | null) {
    if (!value) {
      return;
    }
    this.data.push(value);
    this.updateAllAvailableState();

    this.table.renderRows();

}

@Output() onAddNodes = new EventEmitter<{ viewData: BaseIndeciesDataView, type: BaseType }[]>();
@Output() onRemoveNodes = new EventEmitter<BaseIndeciesDataView[]>();
@Output() onEditedNodes = new EventEmitter<BaseIndeciesDataView[]>();


availabilityNodes = AvailabilityNodes;
allAvailableState: "checked" | "unchecked" | "mixed" = "mixed";

editingRow: BaseIndeciesDataView | null = null;
data: BaseIndeciesDataView[] = [];
dataSourceTest = new MatTableDataSource(this.data);

displayedColumns: string[] = ['select', 'name', 'availability', 'baseType', 'cancelled', 'availableChilds', "handleEdit"];
selection = new SelectionModel<BaseIndeciesDataView>(true, []);

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

onRootExpandClick(row: BaseIndeciesDataView) {
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

toggleChange(value: boolean, rowData: BaseIndeciesDataView) {
  if (!!rowData.isRoot) {
    rowData.availability = value;
    this.onEditedNodes.emit([rowData]);

    this.data.filter(x => x.parentGuid === rowData.guid).forEach(x => {
      this.toggleChange(value, x);
    });
  } else {
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

startNameEdit(row: BaseIndeciesDataView, editInput: any) {
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
    if (!result) {
      return;
    }

    const newNode: BaseIndeciesDataView = {
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

toggleAvailableChildChange(event: MatCheckboxChange, row: BaseIndeciesDataView) {
  // TODO:

}

toggleCancelChange(value: boolean, row: BaseIndeciesDataView) {
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

checkboxLabel(row ?: BaseIndeciesDataView): string {
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

rowSelected(value: boolean, row: BaseIndeciesDataView) {
  if (row.hasChildren) {
    this.data.filter(x => x.parentGuid === row.guid).forEach(x => {
      this.rowSelected(value, x);
    });
  }
  if (value) {
    this.selection.select(...[row])
  } else {
    if (row.parentGuid) {
      const parent = this.selection.selected.find(x => x.guid === row.parentGuid);
      if (parent) this.selection.deselect(parent);
    }
    this.selection.deselect(row);
  }
}

onRowClick(row: BaseIndeciesDataView) {
  this.rowSelected(!this.selection.isSelected(row), row)
}

isIncludeChildNodes(nodeType: AvailabilityNodes, row: BaseIndeciesDataView): boolean {
  return !!row.availableChilds?.includes(nodeType);
}

onHandleEdit(row: BaseIndeciesDataView) {
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
  private sortName(a: BaseIndeciesDataView, b: BaseIndeciesDataView): number {
  return a.name === b.name ? 0 : a.name > b.name ? 1 : -1;
}
  private sortType(a: BaseIndeciesDataView, b: BaseIndeciesDataView): number {
  return a.name === b.name ? 0 : a.name > b.name ? 1 : -1;
}
  private updateAllAvailableState() {
  const allAvailable = this.data.filter(this.filterDataSource).every(x => x.availability === true);
  const noAvailable = this.data.filter(this.filterDataSource).every(x => x.availability === false);
  this.allAvailableState = allAvailable ? "checked" : (noAvailable ? "unchecked" : "mixed");
}

  private filterDataSource(value: BaseIndeciesDataView): boolean {
  return true;
}
}
