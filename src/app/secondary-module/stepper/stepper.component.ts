import { Component, OnInit } from '@angular/core';
import { MatOptionSelectionChange } from "@angular/material/core";
import { MatSelectChange } from "@angular/material/select";

@Component({
  selector: 'ss-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss']
})
export class StepperComponent implements OnInit {
  isEditable = false;
  public baseTypes = [{ name: "ТСН МГЭ", isAvailable: true }, { name: "ФЕР", isAvailable: false },]
  public availableBaseOptions = [{ name: "Дополнение 55" }, { name: "Дополнение 56" },]

  public showAddForm = false;
  constructor() { }

  ngOnInit(): void {
  }


  onSelectionChange(event: MatSelectChange) {
    console.log("!! | onSelectionChange | event", event)
    this.showAddForm = false;

  }

  onAddNewClick(event: MatOptionSelectionChange) {
    console.log("!! | onAddNewClick | event", event)
    this.showAddForm = true;
  }



 

}
