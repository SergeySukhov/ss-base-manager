import { Component, OnInit } from '@angular/core';
import { StepperData } from "src/app/secondary-module/stepper/models/stepper-model";
import { MainStateService } from '../main/services/main-state.service';
import { NormativeBaseDeclarationService } from "./services/normative-base.declaration.service";

@Component({
  selector: 'ss-normative-base',
  templateUrl: './normative-base.component.html',
  styleUrls: ['./normative-base.component.scss'],
  providers: [NormativeBaseDeclarationService]
})
export class NormativeBaseComponent implements OnInit {

  public data: StepperData | null = null;

  constructor(public stateService: MainStateService, public declarationService: NormativeBaseDeclarationService) {

  }

  ngOnInit(): void {
     this.declarationService.getStepperModel().then((value) => {
        this.data = value;
     });
  }


}
