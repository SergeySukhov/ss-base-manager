import { SelectionModel } from "@angular/cdk/collections";
import { EventEmitter, ViewChild } from "@angular/core";
import { MatCheckboxChange } from "@angular/material/checkbox";
import { MatDialog } from "@angular/material/dialog";
import { MatSort } from "@angular/material/sort";
import { MatTable, MatTableDataSource } from "@angular/material/table";
import { v4 } from "uuid";
import { AvailabilityNodes } from "../../models/server-models/AvailableNormativeBaseType";
import { AddNodeDialogComponent } from "../table-node-dialog/add-node-dialog/add-node-dialog.component";
import { TableControlDialogComponent } from "../table-node-dialog/table-control-dialog/table-control-dialog.component";

export interface DataViewBase {
    guid: string;
    availability: boolean;
    baseTypeName: string;
    isCancelled: boolean;
    isRoot: true | false;
    name: any;
    data?: any;

}

export interface DataViewRoot extends DataViewBase {
    name: string;
    isRoot: true;
    hasChildren?: boolean;
    isExpand?: boolean;
    availableChilds?: AvailabilityNodes[];
}

export interface DataViewNode extends DataViewBase {
    name: any;
    isRoot: false;
    parentGuid: string;
    isHide?: boolean;
}

export type CommonNodes = DataViewRoot | DataViewNode;


export abstract class TableControlBase<T extends CommonNodes> {
    isAwaiting = false;
    table!: MatTable<CommonNodes>;

    sort!: MatSort;

    allAvailableState: "checked" | "unchecked" | "mixed" = "mixed";

    editingRow: T | null = null;
    data: T[] = [];
    dataSourceTest = new MatTableDataSource(this.data);

    displayedColumns: string[] = ['select', 'name', 'availability', 'baseType', 'cancelled', 'availableChilds', "handleEdit"];
    selection = new SelectionModel<T>(true, []);

    onAddNodes = new EventEmitter<{ viewData: DataViewRoot, type: any }[]>();
    onRemoveNodes = new EventEmitter<CommonNodes[]>();
    onEditedNodes = new EventEmitter<CommonNodes[]>();

    constructor(public dialog: MatDialog,
    ) {
    }

    onRootExpandClick(row: T) {
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

    toggleChange(value: boolean, rowData: T) {
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
    
      startNameEdit(row: T, editInput: any) {
        setTimeout(() => {
          editInput.focus();
        });
        editInput.value = row.name;
        this.editingRow = row;
      }
    




      private updateAllAvailableState() {
        const allAvailable = this.data.filter(this.filterDataSource).every(x => x.availability === true);
        const noAvailable = this.data.filter(this.filterDataSource).every(x => x.availability === false);
        this.allAvailableState = allAvailable ? "checked" : (noAvailable ? "unchecked" : "mixed");
      }
    
      private filterDataSource(value: T): boolean {
        return true;
      }
}
