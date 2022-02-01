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

    toggleAvailableChildChange(event: MatCheckboxChange, row: T) {
        // TODO:

    }

    toggleCancelChange(value: boolean, row: T) {
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

    checkboxLabel(row?: T): string {
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

    rowSelected(value: boolean, row: T) {
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

    onRowClick(row: T) {
        this.rowSelected(!this.selection.isSelected(row), row)
    }

    announceSortChange(sortState: any) {
        const unsorted = this.data.splice(0);
        if (sortState.active === "name") {
            if (sortState.direction === "desc") {
                const rootNodes = unsorted.filter(x => x.isRoot).sort(this.sortName).reverse();
                rootNodes.forEach(x => {
                    this.data.push(x);
                    this.data.push(...unsorted.filter(xx => !xx.isRoot && xx.parentGuid === x.guid).sort(this.sortName).reverse());
                });
            } else {
                const rootNodes = unsorted.filter(x => x.isRoot).sort(this.sortName);
                rootNodes.forEach(x => {
                    this.data.push(x);
                    this.data.push(...unsorted.filter(xx => !xx.isRoot && xx.parentGuid === x.guid).sort(this.sortName));
                });
            }
        }
        if (sortState.active === "baseType") {
            if (sortState.direction === "desc") {
                const rootNodes = unsorted.filter(x => x.isRoot).sort(this.sortType).reverse();
                rootNodes.forEach(x => {
                    this.data.push(x);
                    this.data.push(...unsorted.filter(xx => !xx.isRoot && xx.parentGuid === x.guid).sort(this.sortType).reverse());
                });
            } else {
                const rootNodes = unsorted.filter(x => x.isRoot).sort(this.sortType);
                rootNodes.forEach(x => {
                    this.data.push(x);
                    this.data.push(...unsorted.filter(xx => !xx.isRoot && xx.parentGuid === x.guid).sort(this.sortType));
                });
            }
        }
        this.table.renderRows();
    }

    protected abstract sortName(a: T, b: T): number;
    protected abstract sortType(a: T, b: T): number;


    protected updateAllAvailableState() {
        const allAvailable = this.data.filter(this.filterDataSource).every(x => x.availability === true);
        const noAvailable = this.data.filter(this.filterDataSource).every(x => x.availability === false);
        this.allAvailableState = allAvailable ? "checked" : (noAvailable ? "unchecked" : "mixed");
    }

    protected filterDataSource(value: T): boolean {
        return true;
    }
}
