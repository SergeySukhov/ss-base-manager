import { Component, OnInit } from '@angular/core';
import { StepperData } from "src/app/secondary-module/stepper/models/stepper-model";
import { FormBaseResultParams } from "./models/form-base.models";
import { FormulaBaseDeclarationService } from "./services/formula-base.declaration.service";
import { FormulaBaseEndpointService } from "./services/formula-base.endpoint.service";

@Component({
  selector: 'ss-formula-base',
  templateUrl: './formula-base.component.html',
  styleUrls: ['./formula-base.component.scss'],
  providers: [
    FormulaBaseDeclarationService,
    FormulaBaseEndpointService
  ]
})
export class FormulaBaseComponent implements OnInit {

  public data: StepperData | null = null;
  public resultParams: FormBaseResultParams = new FormBaseResultParams();

  constructor(public declarationService: FormulaBaseDeclarationService) { }

  ngOnInit(): void {
    this.data = this.declarationService.getStepperModel(this);
  }

}
