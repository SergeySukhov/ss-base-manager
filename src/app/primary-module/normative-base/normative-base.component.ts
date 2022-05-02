import { Component, OnInit } from '@angular/core';
import { LocalStorageConst, LocalStorageService } from 'src/app/core/services/local-storage.service';
import { UploadComponentBase } from 'src/app/shared/common-components/uploader-base/upload-base.component';
import { AvailableBaseAdditionInfo } from 'src/app/shared/models/server-models/AvailableBaseAdditionInfo';
import { NormBaseResultParams } from './models/norm-base.models';
import { NormativeBaseDeclarationService } from "./services/normative-base.declaration.service";
import { NormativeBaseEndpointService } from './services/normative-base.endpoint.service';

@Component({
  selector: 'ss-normative-base',
  templateUrl: './normative-base.component.html',
  styleUrls: ['./normative-base.component.scss', '../../shared/common-components/uploader-base/upload-base.component.scss'],
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
  }

  onFinish() {
    this.isAwaiting = true;
    this.endpointService.sendNormatives(this.resultParams).then(response => {
      this.isSuccessSending = response;
      this.isAwaiting = false;
      this.showCheck = true;
      setTimeout(() => {
        this.showCheck = false;
      }, 1000);
    });
  }

  protected loadLastParams(): NormBaseResultParams {
    return this.storageService.getItem(LocalStorageConst.resultNormoParams) ?? new NormBaseResultParams();
  }
}
