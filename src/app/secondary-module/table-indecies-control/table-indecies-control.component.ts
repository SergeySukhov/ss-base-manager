import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { v4 } from 'uuid';
import { AvailabilityNodes, BaseType } from 'src/app/shared/models/server-models/AvailableNormativeBaseType';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatSort, Sort } from '@angular/material/sort';
import { BaseTypePipe } from 'src/app/core/pipes/base-type.pipe';
import { AddNodeDialogComponent } from 'src/app/shared/common-components/table-node-dialog/add-node-dialog/add-node-dialog.component';
import { TableControlDialogComponent } from 'src/app/shared/common-components/table-node-dialog/table-control-dialog/table-control-dialog.component';
import { PeriodPipe } from 'src/app/core/pipes/period.pipe';
import { ReleasePeriodType } from 'src/app/shared/models/server-models/AvailableBaseIndexInfo';
import { DateIndeciesHelper } from 'src/app/shared/utils/date-indecies.helper.service';
import { MatSelectChange } from '@angular/material/select';

export interface IndeciesDataView {
  year: number;
  periodType: ReleasePeriodType;
  value: string;
}

export interface DataViewBase<T extends string | IndeciesDataView> {
  guid: string;
  availability: boolean;
  baseTypeName: string;
  isCancelled: boolean;
  isRoot: true | false;
  name: T;
  data?: any;

}

export interface IndeciesDataViewRoot extends DataViewBase<string> {
  name: string;
  isRoot: true;
  hasChildren?: boolean;
  isExpand?: boolean;
  availableChilds?: AvailabilityNodes[];

}
export interface IndeciesDataViewNode extends DataViewBase<IndeciesDataView> {
  name: IndeciesDataView;
  isRoot: false;
  parentGuid: string;
  isHide?: boolean;
}

export type IndeciesCommonNodes = IndeciesDataViewRoot | IndeciesDataViewNode;

@Component({
  selector: 'ss-indecies-table-control',
  templateUrl: './table-indecies-control.component.html',
  styleUrls: ['./table-indecies-control.component.scss'],
})
export class TableIndeciesControlComponent implements OnInit, AfterViewInit {
  @ViewChild(MatTable) table!: MatTable<IndeciesCommonNodes>;

  @ViewChild(MatSort) sort!: MatSort;


  @Input() isAwaiting = false;

  @Input() set dataSource(value: IndeciesCommonNodes[] | undefined) {
    if (!value) {
      return;
    }
    this.data.splice(0);
    this.data.push(...value);
    if (this.table) {
      this.table.renderRows();
    }
    this.updateAllAvailableState();
  }
  @Input() set updNode(value: IndeciesCommonNodes | null) {
    if (!value) {
      return;
    }
    this.data.push(value);
    this.updateAllAvailableState();

    this.table.renderRows();

  }

  @Output() onAddNodes = new EventEmitter<{ viewData: IndeciesDataViewRoot, type: BaseType }[]>();
  @Output() onRemoveNodes = new EventEmitter<IndeciesCommonNodes[]>();
  @Output() onEditedNodes = new EventEmitter<IndeciesCommonNodes[]>();

  LocalPeriodType = ReleasePeriodType;
  availabilityNodes = AvailabilityNodes;
  allAvailableState: "checked" | "unchecked" | "mixed" = "mixed";

  editingRow: IndeciesCommonNodes | null = null;
  data: IndeciesCommonNodes[] = [];
  dataSourceTest = new MatTableDataSource(this.data);

  displayedColumns: string[] = ['select', 'name', 'availability', 'baseType', 'cancelled', 'availableChilds', "handleEdit"];
  selection = new SelectionModel<IndeciesCommonNodes>(true, []);

  constructor(public dialog: MatDialog,
    private baseTypePipe: BaseTypePipe, public periodPipe: PeriodPipe,
  ) {
  }

  ngOnInit(): void {
    if (this.table) {
      this.table.renderRows();
    }
  }

  ngAfterViewInit() {
  }

  // announceSortChange(sortState: any) {
  //   const unsorted = this.data.splice(0);
  //   if (sortState.active === "name") {
  //     if (sortState.direction === "desc") {
  //       const rootNodes = unsorted.filter(x => x.isRoot).sort(this.sortName).reverse();
  //       rootNodes.forEach(x => {
  //         this.data.push(x);
  //         this.data.push(...unsorted.filter(xx => xx.parentGuid === x.guid).sort(this.sortName).reverse());
  //       });
  //     } else {
  //       const rootNodes = unsorted.filter(x => x.isRoot).sort(this.sortName);
  //       rootNodes.forEach(x => {
  //         this.data.push(x);
  //         this.data.push(...unsorted.filter(xx => xx.parentGuid === x.guid).sort(this.sortName));
  //       });
  //     }
  //   }
  //   if (sortState.active === "baseType") {
  //     if (sortState.direction === "desc") {
  //       const rootNodes = unsorted.filter(x => x.isRoot).sort(this.sortType).reverse();
  //       rootNodes.forEach(x => {
  //         this.data.push(x);
  //         this.data.push(...unsorted.filter(xx => xx.parentGuid === x.guid).sort(this.sortType).reverse());
  //       });
  //     } else {
  //       const rootNodes = unsorted.filter(x => x.isRoot).sort(this.sortType);
  //       rootNodes.forEach(x => {
  //         this.data.push(x);
  //         this.data.push(...unsorted.filter(xx => xx.parentGuid === x.guid).sort(this.sortType));
  //       });
  //     }
  //   }
  //   this.table.renderRows();
  // }

  getYears(): string[] {
    return DateIndeciesHelper.GetAllIndeciesYears();
  }

  getPeriods(): string[] {
    const p: string[] = [];
    p.push(...DateIndeciesHelper.GetAllMonths(), ...DateIndeciesHelper.GetAllQuarters());
    return p;
  }

  getCurrPeriodValue(node: IndeciesDataViewNode): string {
    const nodeDateValue = Number.parseInt(node.name.value);

    if (node.name.periodType === ReleasePeriodType.Month && nodeDateValue < 12) {
      return DateIndeciesHelper.GetAllMonths()[nodeDateValue];
    } else if (node.name.periodType === ReleasePeriodType.Month && nodeDateValue < 4) {
      return DateIndeciesHelper.GetAllQuarters()[nodeDateValue];
    } else {
      return "-";
    }
  }

  onYearChanged(event: MatSelectChange, row: IndeciesDataViewNode) {
    const newYear = Number.parseInt(event.value);
    if (!isNaN(newYear)) {
      row.name.year = newYear;
      this.onEditedNodes.emit([row]);
    }
  }

  onPeriodChanged(event: MatSelectChange, row: IndeciesDataViewNode) {
    const months = DateIndeciesHelper.GetAllMonths();
    for (let i = 0; i < months.length; i++) {
      const month = months[i];
      if (month === event.value) {
        row.name.periodType = ReleasePeriodType.Month;
        row.name.value = "" + i + 1;
        this.onEditedNodes.emit([row]);
        return;
      }
    }

    const quarters = DateIndeciesHelper.GetAllQuarters();
    for (let i = 0; i < quarters.length; i++) {
      const quarter = quarters[i];
      if (quarter === event.value) {
        row.name.periodType = ReleasePeriodType.Quarter;
        row.name.value = "" + i + 1;
        this.onEditedNodes.emit([row]);
        return;
      }
    }

  }

  onRootExpandClick(row: IndeciesCommonNodes) {
    if (!row.isRoot) {
      return;
    }
    row.isExpand = !row.isExpand;
    if (row.isExpand) {
      this.showChildrenRows(row.guid);
    } else {
      this.hideChildrenRows(row.guid);
    }
    this.table.renderRows();
  }

  showChildrenRows(parentGuid: string) {
    this.data.filter(x => !x.isRoot && x.parentGuid === parentGuid).forEach(x => {
      if (!x.isRoot) {
        x.isHide = false;
      }
    });
  }

  hideChildrenRows(parentGuid: string) {
    this.data.filter(x => !x.isRoot && x.parentGuid === parentGuid).forEach(x => {
      if (!x.isRoot) {
        x.isHide = true;
      }
    });
  }

  toggleChange(value: boolean, rowData: IndeciesCommonNodes) {
    if (rowData.isRoot) {
      rowData.availability = value;
      this.onEditedNodes.emit([rowData]);

      this.data.filter(x => !x.isRoot && x.parentGuid === rowData.guid).forEach(x => {
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

  startNameEdit(row: IndeciesCommonNodes, editInput: any) {
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

      const newNode: IndeciesDataViewRoot = {
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

  toggleAvailableChildChange(event: MatCheckboxChange, row: IndeciesDataViewRoot) {
    // TODO:

  }

  toggleCancelChange(value: boolean, row: IndeciesCommonNodes) {
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

  checkboxLabel(row?: IndeciesCommonNodes): string {
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

  rowSelected(value: boolean, row: IndeciesCommonNodes) {
    if (row.isRoot && row.hasChildren) {
      this.data.filter(x => !x.isRoot && x.parentGuid === row.guid).forEach(x => {
        this.rowSelected(value, x);
      });
    }
    if (value) {
      this.selection.select(...[row])
    } else {
      if (!row.isRoot) {
        const parent = this.selection.selected.find(x => x.guid === row.parentGuid);
        if (parent) this.selection.deselect(parent);
      }
      this.selection.deselect(row);
    }
  }

  onRowClick(row: IndeciesCommonNodes) {
    this.rowSelected(!this.selection.isSelected(row), row)
  }

  isIncludeChildNodes(nodeType: AvailabilityNodes, row: IndeciesDataViewRoot): boolean {
    return !!row.availableChilds?.includes(nodeType);
  }

  onHandleEdit(row: IndeciesDataViewNode) {
    const forbiddenKeys = ["guid", "type", "isAvailable", "parentBaseType"]
    const dialogRef = this.dialog.open(TableControlDialogComponent, {
      width: '750px',
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



  private sortName(a: IndeciesCommonNodes, b: IndeciesCommonNodes): number {
    if (!a.name || !b.name) {
      return 0;
    }

    return a.name === b.name ? 0 : a.name > b.name ? 1 : -1;
  }
  private sortType(a: IndeciesCommonNodes, b: IndeciesCommonNodes): number {
    return a.baseTypeName === b.baseTypeName ? 0 : a.baseTypeName > b.baseTypeName ? 1 : -1;
  }
  private updateAllAvailableState() {
    const allAvailable = this.data.filter(this.filterDataSource).every(x => x.availability === true);
    const noAvailable = this.data.filter(this.filterDataSource).every(x => x.availability === false);
    this.allAvailableState = allAvailable ? "checked" : (noAvailable ? "unchecked" : "mixed");
  }

  private filterDataSource(value: IndeciesCommonNodes): boolean {
    return true;
  }
}
