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
  public tempProgress = 0;
  constructor(private declarationService: FormulaBaseDeclarationService, private endpointService: FormulaBaseEndpointService) { }

  ngOnInit(): void {
    this.data = this.declarationService.getStepperModel(this);
  }

  onFinish() {
    console.log("!! | onFinish | Finish", this.resultParams)

    this.endpointService.sendFormuls(this.resultParams);
    this.tempProgress = 1;
    const tempInterval = setInterval(() => {
      this.tempProgress += 1;
      if (this.tempProgress >= 100) {
        clearInterval(tempInterval);
      }
    }, 300)
  }

  onModelChange() {
    
    console.log("!! | onModelChange | this.data", this.data)
  }

}
