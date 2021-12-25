import { Component, OnInit } from '@angular/core';
import { StepperData } from "src/app/secondary-module/stepper/models/stepper-model";
import { NormBaseResultParams } from './models/norm-base.models';
import { NormativeBaseDeclarationService } from "./services/normative-base.declaration.service";
import { NormativeBaseEndpointService } from './services/normative-base.endpoint.service';
import { NormativeBaseStateService } from './services/normative-base.state.service';

@Component({
  selector: 'ss-normative-base',
  templateUrl: './normative-base.component.html',
  styleUrls: ['./normative-base.component.scss'],
  providers: [
    NormativeBaseDeclarationService,
    NormativeBaseEndpointService,
    NormativeBaseStateService]
})
export class NormativeBaseComponent implements OnInit {

  public data: StepperData | null = null;
  public resultParams: NormBaseResultParams = new NormBaseResultParams();

  constructor(public declarationService: NormativeBaseDeclarationService, private endpointService: NormativeBaseEndpointService) {
  }

  ngOnInit(): void {
    this.data = this.declarationService.getStepperModel(this);
  }

  onFinish() {
    console.log("!! | onFinish | Finish", this.resultParams)

    // this.endpointService.(this.resultParams);
  }

}
