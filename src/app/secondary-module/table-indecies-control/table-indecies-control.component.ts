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
import { DataViewNode, DataViewRoot, TableControlBase } from 'src/app/shared/common-components/table-control-base/table-control-base';
import { WorkCategory } from 'src/app/shared/models/server-models/AvailableIndexWorkCategory';

export interface IndeciesDataView {
  year: number;
  workCategory: WorkCategory;
  periodType: ReleasePeriodType;
  value: string;
}

export interface IndeciesDataViewRoot extends DataViewRoot {
}

export interface IndeciesDataViewNode extends DataViewNode {
  name: IndeciesDataView;
}

export type IndeciesCommonNodes = IndeciesDataViewRoot | IndeciesDataViewNode;

@Component({
  selector: 'ss-indecies-table-control',
  templateUrl: './table-indecies-control.component.html',
  styleUrls: ['./table-indecies-control.component.scss'],
})
export class TableIndeciesControlComponent extends TableControlBase<IndeciesCommonNodes> implements OnInit, AfterViewInit {
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
    super(dialog);
  }

  ngOnInit(): void {
    if (this.table) {
      this.table.renderRows();
    }
  }

  ngAfterViewInit() {
  }

  getWorkCategories(): string[] {
    return ["Строительство", "Ремонт", "Реставрация"]
  }

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

  getCurrWorkCategory(node: IndeciesDataViewNode): string {
    const allCat = this.getWorkCategories();
    if (allCat.length > node.name.workCategory) {
      return allCat[node.name.workCategory];
    } else {
      return "неизвестная категория";
    }
  }

  onWorkCategoryChanged(event: MatSelectChange, row: IndeciesDataViewNode) {
    const allCat = this.getWorkCategories();
    const idx = allCat.findIndex(x => x === event.value);

    console.log("!! | onWorkCategoryChanged | idx", idx)
    if (idx > -1) {
      row.name.workCategory = idx;
      this.onEditedNodes.emit([row]);

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

  protected sortName(a: IndeciesCommonNodes, b: IndeciesCommonNodes): number {
    if (!a.name || !b.name) {
      return 0;
    }

    return a.name === b.name ? 0 : a.name > b.name ? 1 : -1;
  }
  protected sortType(a: IndeciesCommonNodes, b: IndeciesCommonNodes): number {
    return a.baseTypeName === b.baseTypeName ? 0 : a.baseTypeName > b.baseTypeName ? 1 : -1;
  }

}
