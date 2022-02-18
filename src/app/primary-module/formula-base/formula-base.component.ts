import { Component, OnInit } from '@angular/core';
import { LocalStorageService, LocalStorageConst } from 'src/app/core/services/local-storage.service';
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
  public errorMessages = "";

  constructor(private declarationService: FormulaBaseDeclarationService, private endpointService: FormulaBaseEndpointService,
    private storageService: LocalStorageService) {
    this.resultParams = this.storageService.getItem(LocalStorageConst.resultFormulaParams) ?? new FormBaseResultParams();
  }

  async ngOnInit() {
    this.endpointService.getAvailableBaseTypes().then(availableBaseTypes => {
      if (availableBaseTypes?.length) {
        this.data = this.declarationService.getStepperModel(this, availableBaseTypes);
      } else {
        this.errorMessages = "!! ошибка загрузки";
      }
    });
    this.declarationService.updateParamsSub.subscribe(newParams => {
      this.resultParams = newParams;
      this.storageService.setItem(LocalStorageConst.resultFormulaParams, this.resultParams);
    });
  }

  onFinish() {
    this.endpointService.sendFormuls(this.resultParams);
  }

  onModelChange() {
    this.declarationService.update(this.resultParams);
  }

}
