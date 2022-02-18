import { Component, OnInit } from '@angular/core';
import { LocalStorageConst, LocalStorageService } from 'src/app/core/services/local-storage.service';
import { UploadComponentBase } from 'src/app/shared/models/base-upload/base-upload-component.model';
import { AvailableBaseAdditionInfo } from 'src/app/shared/models/server-models/AvailableBaseAdditionInfo';
import { NormBaseResultParams } from './models/norm-base.models';
import { NormativeBaseDeclarationService } from "./services/normative-base.declaration.service";
import { NormativeBaseEndpointService } from './services/normative-base.endpoint.service';

@Component({
  selector: 'ss-normative-base',
  templateUrl: './normative-base.component.html',
  styleUrls: ['./normative-base.component.scss'],
  providers: [
    NormativeBaseDeclarationService,
    NormativeBaseEndpointService,
  ]
})
export class NormativeBaseComponent extends UploadComponentBase<AvailableBaseAdditionInfo, NormBaseResultParams> implements OnInit {

  constructor(protected declarationService: NormativeBaseDeclarationService, protected endpointService: NormativeBaseEndpointService,
    protected storageService: LocalStorageService) {

    super(declarationService, endpointService, storageService, LocalStorageConst.resultNormoParams);
  }

  async ngOnInit() {
    const availableBaseTypes = await this.endpointService.getAvailableBaseTypes()
    if (availableBaseTypes?.length) {
      this.data = this.declarationService.getStepperModel(this, availableBaseTypes);
    } else {
      this.errorMessages = "!! ошибка загрузки";
    }
  }

  onFinish() {
    this.endpointService.sendNormatives(this.resultParams);
  }

  protected loadLastParams(): NormBaseResultParams {
    return this.storageService.getItem(LocalStorageConst.resultNormoParams) ?? new NormBaseResultParams();

  }
}
