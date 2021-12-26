import { SelectionModel } from '@angular/cdk/collections';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { DatePipe } from '@angular/common'
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

export interface BaseData {
  name: string;
  position: number;
  availability: boolean | "awaiting";
  changeDate: string | null;
}

@Component({
  selector: 'ss-table-control',
  templateUrl: './table-control.component.html',
  styleUrls: ['./table-control.component.scss'],
  providers: [DatePipe]
})
export class TableControlComponent implements OnInit {
  @ViewChild(MatTable) table!: MatTable<BaseData>;

  @Input() set dataSourceTemp(value: string[]) {
    this.ELEMENT_DATA.splice(0);
    value.forEach((x, index) => {
      this.ELEMENT_DATA.push({
        position: index+1,
        name: x,
        availability: true,
        changeDate: this.datepipe.transform(Date.now(), 'HH:mm, dd-MM-yyyy')
      }
      )
    })
  }

  ELEMENT_DATA: BaseData[] = [
    // { position: 1, name: 'Hydrogen', availability: true, changeDate: this.datepipe.transform(Date.now(), 'HH:mm, dd-MM-yyyy') },
    // { position: 2, name: 'Helium', availability: true, changeDate: this.datepipe.transform(Date.now(), 'HH:mm, dd-MM-yyyy') },
    // { position: 3, name: 'Lithium', availability: true, changeDate: this.datepipe.transform(Date.now(), 'HH:mm, dd-MM-yyyy') },
    // { position: 4, name: 'Beryllium', availability: true, changeDate: this.datepipe.transform(Date.now(), 'HH:mm, dd-MM-yyyy') },
  ];

  displayedColumns: string[] = ['select', 'position', 'name', 'availability', 'changeDate'];
  dataSource = new MatTableDataSource<BaseData>(this.ELEMENT_DATA);
  selection = new SelectionModel<BaseData>(true, []);

  constructor(public datepipe: DatePipe) { }

  ngOnInit(): void {
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.displayedColumns, event.previousIndex, event.currentIndex);
  }

  toggleChange(event: MatSlideToggleChange, rowData: BaseData) {
    rowData.availability = "awaiting";
    setTimeout(() => {
      rowData.availability = event.checked;
    }, 1000)
  }

  addData() {
    // const randomElementIndex = Math.floor(Math.random() * ELEMENT_DATA.length);
    // this.dataSource.push(ELEMENT_DATA[randomElementIndex]);
    // this.table.renderRows();
  }

  removeData() {
    // this.dataSource.pop();
    // this.table.renderRows();
  }


  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: BaseData): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }
}
