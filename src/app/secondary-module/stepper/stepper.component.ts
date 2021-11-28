import { Component, Input, OnInit } from '@angular/core';
import { MatOptionSelectionChange } from "@angular/material/core";
import { MatSelectChange } from "@angular/material/select";
import { StepperData } from './models/stepper-model';

@Component({
  selector: 'ss-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss']
})
export class StepperComponent implements OnInit {

  @Input() data: StepperData | null = null;

  public isEditable = true;
  public baseTypes = [{ name: "ТСН МГЭ", isAvailable: true }, { name: "ФЕР", isAvailable: false },]
  public availableBaseOptions = [{ name: "Дополнение 55" }, { name: "Дополнение 56" },]
  public showAddForm = false;
  constructor() { }

  ngOnInit(): void {
  }


  onSelectionChange(event: MatOptionSelectionChange) {
    console.log("!! | onSelectionChange | event", event)
    this.showAddForm = false;

  }

  onAddNewClick(event: MatOptionSelectionChange) {
    console.log("!! | onAddNewClick | event", event)
    this.showAddForm = true;
  }



 

}
