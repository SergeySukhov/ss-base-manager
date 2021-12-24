import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatOptionSelectionChange } from "@angular/material/core";
import { MatSelectChange } from "@angular/material/select";
import { StepperData } from './models/stepper-model';

@Component({
  selector: 'ss-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss'],
  providers: [
    FormBuilder
  ]
})
export class StepperComponent implements OnInit {

  @Input() data: StepperData | null = null;
  @Input() isLinear: boolean = false;

  @Output() modelChange = new EventEmitter();

  public isEditable = true;
  public showAddForm = false;

  firstFormGroup: FormGroup;

  constructor(private _formBuilder: FormBuilder) {
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required],
    });
  }

  ngOnInit(): void {
  }


  onSelectionChange(event: MatOptionSelectionChange) {
    this.showAddForm = false;

  }

  onAddNewClick(event: MatOptionSelectionChange) {
    this.showAddForm = true;
  }

  test(event: any) {
    console.log("!! | test | event", event)
    this.modelChange.emit();
  }



}
