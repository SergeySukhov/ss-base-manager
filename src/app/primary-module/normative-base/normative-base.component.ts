import { Component, OnInit } from '@angular/core';
import { StepperData } from "src/app/secondary-module/stepper/models/stepper-model";
import { MainStateService } from '../main/services/main-state.service';
import { NormBaseResultParams } from './models/norm-base.models';
import { NormativeBaseDeclarationService } from "./services/normative-base.declaration.service";
import { NormativeBaseEndpointService } from './services/normative-base.endpoint.service';

@Component({
  selector: 'ss-normative-base',
  templateUrl: './normative-base.component.html',
  styleUrls: ['./normative-base.component.scss'],
  providers: [
    NormativeBaseDeclarationService,
    NormativeBaseEndpointService]
})
export class NormativeBaseComponent implements OnInit {

  public data: StepperData | null = null;
  public resultParams: NormBaseResultParams = new NormBaseResultParams();

  constructor(public stateService: MainStateService, public declarationService: NormativeBaseDeclarationService) {

  }

  ngOnInit(): void {
    this.declarationService.getStepperModel(this).then((value) => {
      this.data = value;
    });
  }


}
