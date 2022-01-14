import { Component, EventEmitter, Injectable, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatOptionSelectionChange } from "@angular/material/core";
import { MatStepperIntl } from '@angular/material/stepper';
import { StepperData } from './models/stepper-model';

@Injectable()
export class StepperIntl extends MatStepperIntl {
  // the default optional label text, if unspecified is "Optional"
  override optionalLabel = "Необязательно";
}

@Component({
  selector: 'ss-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss'],
  providers: [
    FormBuilder,
    {provide: MatStepperIntl, useClass: StepperIntl}
  ]
})
export class StepperComponent implements OnInit {

  @Input() data: StepperData | null = null;
  @Input() isLinear: boolean = false;

  @Output() modelChange = new EventEmitter();

  public isEditable = true;
  public showAddForm = false;

  optionalLabelText: string | undefined;
  firstFormGroup: FormGroup | undefined;

  constructor(private _formBuilder: FormBuilder, private _matStepperIntl: MatStepperIntl) {

  }

  updateOptionalLabel() {
    this._matStepperIntl.optionalLabel = this.optionalLabelText ?? "";
    this._matStepperIntl.changes.next();
  }

  ngOnInit(): void {
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required],
    });
  }


  onSelectionChange(event: MatOptionSelectionChange) {
    this.showAddForm = false;

  }

  onAddNewClick(event: MatOptionSelectionChange) {
    this.showAddForm = true;
  }

  test(event: any) {
    this.modelChange.emit();
  }



}
