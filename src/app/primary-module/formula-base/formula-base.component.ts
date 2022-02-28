import { Component, OnInit } from '@angular/core';
import { LocalStorageService, LocalStorageConst } from 'src/app/core/services/local-storage.service';
import { UploadComponentBase } from 'src/app/shared/models/base-upload/base-upload-component.model';
import { AvailableBaseAdditionInfo } from 'src/app/shared/models/server-models/AvailableBaseAdditionInfo';
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
export class FormulaBaseComponent extends UploadComponentBase<AvailableBaseAdditionInfo, FormBaseResultParams> implements OnInit {


  constructor(protected declarationService: FormulaBaseDeclarationService, protected endpointService: FormulaBaseEndpointService,
    protected storageService: LocalStorageService) {

    super(declarationService, endpointService, storageService, LocalStorageConst.resultFormulaParams);
  }

  ngOnInit() {
  }

  public onFinish(): void {
    console.log("!! | onFinish | this.resultParams", this.resultParams)
    this.endpointService.sendFormuls(this.resultParams);
  }

  protected loadLastParams(): FormBaseResultParams {
    return this.storageService.getItem(LocalStorageConst.resultFormulaParams) ?? new FormBaseResultParams();
  }
}
