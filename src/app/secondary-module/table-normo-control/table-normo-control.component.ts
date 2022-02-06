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
import { CommonNodes, DataViewNode, DataViewRoot, TableControlBase } from 'src/app/shared/common-components/table-control-base/table-control-base';

export interface NormoDataViewRoot extends DataViewRoot {
  name: string;
}

export interface NormoDataViewNode extends DataViewNode {
  name: string;
}

export type NormoBaseDataView = NormoDataViewRoot | NormoDataViewNode;

@Component({
  selector: 'ss-table-control',
  templateUrl: './table-normo-control.component.html',
  styleUrls: ['./table-normo-control.component.scss'],
})
export class TableNormoControlComponent extends TableControlBase<NormoBaseDataView> implements OnInit, AfterViewInit {
  @ViewChild(MatTable) table!: MatTable<NormoBaseDataView>;

  @ViewChild(MatSort) sort!: MatSort;


  @Input() isAwaiting = false;

  @Input() set dataSource(value: NormoBaseDataView[] | undefined) {
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
  @Input() set updNode(value: NormoBaseDataView | null) {
    if (!value) {
      return;
    }
    this.data.push(value);
    this.updateAllAvailableState();

    this.table.renderRows();

  }

  @Output() onAddNodes = new EventEmitter<{ viewData: NormoDataViewRoot, type: BaseType }[]>();
  @Output() onRemoveNodes = new EventEmitter<NormoBaseDataView[]>();
  @Output() onEditedNodes = new EventEmitter<NormoBaseDataView[]>();


  availabilityNodes = AvailabilityNodes;
  allAvailableState: "checked" | "unchecked" | "mixed" = "mixed";

  editingRow: NormoBaseDataView | null = null;
  data: NormoBaseDataView[] = [];
  dataSourceTest = new MatTableDataSource(this.data);

  displayedColumns: string[] = ['select', 'name', 'availability', 'baseType', 'cancelled', 'availableChilds', "handleEdit"];
  selection = new SelectionModel<NormoBaseDataView>(true, []);

  constructor(public dialog: MatDialog, private baseTypePipe: BaseTypePipe) {
    super(dialog);
  }

  ngOnInit(): void {
    if (this.table) {
      this.table.renderRows();
    }
  }

  ngAfterViewInit() {
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

      const newNode: NormoBaseDataView = {
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

  isIncludeChildNodes(nodeType: AvailabilityNodes, row: NormoDataViewRoot): boolean {
    return !!row.availableChilds?.includes(nodeType);
  }

  onHandleEdit(row: NormoBaseDataView) {
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

  protected sortName(a: NormoBaseDataView, b: NormoBaseDataView): number {
    return a.name === b.name ? 0 : a.name > b.name ? 1 : -1;
  }
  protected sortType(a: NormoBaseDataView, b: NormoBaseDataView): number {
    return 0;
    // return a.baseTypeName === b.baseTypeName ? 0 : a.baseTypeName > b.baseTypeName ? 1 : -1;
  }
}
