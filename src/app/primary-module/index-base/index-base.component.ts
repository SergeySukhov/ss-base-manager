import { Component, OnInit } from '@angular/core';
import { LocalStorageService, LocalStorageConst } from 'src/app/core/services/local-storage.service';
import { UploadComponentBase } from 'src/app/shared/common-components/uploader-base/upload-base.component';
import { AvailableBaseIndexInfo } from 'src/app/shared/models/server-models/AvailableBaseIndexInfo';
import { IndexBaseResultParams } from './models/index-base.model';
import { IndexBaseDeclarationService } from './services/index-base.declaration.service';
import { IndexBaseEndpointService } from './services/index-base.endpoint.service';

@Component({
  selector: 'ss-index-base',
  templateUrl: './index-base.component.html',
  styleUrls: ['./index-base.component.scss', '../../shared/common-components/uploader-base/upload-base.component.scss'],
  providers: [
    IndexBaseEndpointService,
    IndexBaseDeclarationService,
  ]
})
export class IndexBaseComponent extends UploadComponentBase<AvailableBaseIndexInfo, IndexBaseResultParams> implements OnInit {

  constructor(protected declarationService: IndexBaseDeclarationService, protected endpointService: IndexBaseEndpointService,
    protected storageService: LocalStorageService) {

    super(declarationService, endpointService, storageService, LocalStorageConst.resultIndexParams);
  }

  ngOnInit() {
  }

  onFinish() {
    this.isAwaiting = true;
    this.endpointService.sendIndecies(this.resultParams).then(response => {
      this.isSuccessSending = response;
      this.isAwaiting = false;
      this.showCheck = true;
      setTimeout(() => {
        this.showCheck = false;
      }, 1000);
    });
  }

  protected loadLastParams(): IndexBaseResultParams {
    return this.storageService.getItem(LocalStorageConst.resultIndexParams) ?? new IndexBaseResultParams();
  }
}
