import { Component, OnInit } from '@angular/core';
import { observable } from 'mobx';
import { StepperData } from "src/app/secondary-module/stepper/models/stepper-model";
import { MainStateService } from '../main/services/main-state.service';
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

  constructor(public stateService: MainStateService, public normativeStateService: NormativeBaseStateService, public declarationService: NormativeBaseDeclarationService) {
  }

  ngOnInit(): void {
    this.data = this.declarationService.getStepperModel(this);
  }


}