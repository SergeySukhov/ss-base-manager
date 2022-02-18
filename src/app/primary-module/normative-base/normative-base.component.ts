import { Component, OnInit } from '@angular/core';
import { LocalStorageConst, LocalStorageService } from 'src/app/core/services/local-storage.service';
import { StepperData } from "src/app/secondary-module/stepper/models/stepper-model";
import { FormulaBaseEndpointService } from "../formula-base/services/formula-base.endpoint.service";
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
    NormativeBaseStateService,
    FormulaBaseEndpointService,
  ]
})
export class NormativeBaseComponent implements OnInit {

  public data: StepperData | null = null;
  public resultParams: NormBaseResultParams;
  public errorMessages = "";

  constructor(public declarationService: NormativeBaseDeclarationService, private endpointService: NormativeBaseEndpointService,
    private storageService: LocalStorageService) {
    this.resultParams = this.storageService.getItem(LocalStorageConst.resultNormoParams) ?? new NormBaseResultParams();
  }

  ngOnInit() {
    this.endpointService.getAvailableBaseTypes().then(availableBaseTypes => {
      if (availableBaseTypes?.length) {
        this.data = this.declarationService.getStepperModel(this, availableBaseTypes);
      } else {
        this.errorMessages = "!! ошибка загрузки";
      }
    });
    this.declarationService.updateParamsSub.subscribe(newParams => {
      this.resultParams = newParams;
      this.storageService.setItem(LocalStorageConst.resultNormoParams, this.resultParams);
    });
  }

  onFinish() {
    this.endpointService.sendNormatives(this.resultParams);
  }

  onModelChange() {
    this.declarationService.update(this.resultParams);
  }
  
}
