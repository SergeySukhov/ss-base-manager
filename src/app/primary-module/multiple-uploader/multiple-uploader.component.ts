import { Component, OnInit } from '@angular/core';
import { LocalStorageConst, LocalStorageService } from 'src/app/core/services/local-storage.service';
import { StepperData } from 'src/app/secondary-module/stepper/models/stepper-model';
import { NormativeBaseEndpointService } from '../normative-base/services/normative-base.endpoint.service';
import { MultipleUploadResultParams } from './models/multiple-upload-result-params.model';
import { MultipleUploaderDeclarationService } from './services/multiple-uploader.declaration.service';
import { MultipleUploaderEndpointService } from './services/multiple-uploader.endpoint.service';

@Component({
  selector: 'ss-multiple-uploader',
  templateUrl: './multiple-uploader.component.html',
  styleUrls: ['./multiple-uploader.component.scss', '../../shared/common-components/uploader-base/upload-base.component.scss'],
  providers: [MultipleUploaderDeclarationService, MultipleUploaderEndpointService]
})
export class MultipleUploaderComponent implements OnInit {

  public isError = false;
  public errorMessage = "";
  public isAwaiting = false;

  public data: StepperData | null = null;

  public resultParams: MultipleUploadResultParams;

  constructor(protected declarationService: MultipleUploaderDeclarationService, protected endpointService: MultipleUploaderEndpointService,
    protected storageService: LocalStorageService) {
    this.resultParams = this.loadLastParams();

  }

  async ngOnInit() {
    this.declarationService.updateParamsSub.subscribe(newParams => {
      this.resultParams = newParams;
      this.storageService.setItem(LocalStorageConst.resultMultipleUploadParams, this.resultParams);
    });

    this.init();
  }

  onModelChange() {
    console.log("!! | onModelChange | onModelChange")
  }

  tryReload() {
    this.init();
  }

  async init() {
    this.isAwaiting = true;
    const avTypes = await this.endpointService.getAvailableBaseTypes();
    if (avTypes?.length) {
      this.data = this.declarationService.getStepperModel(this, avTypes)
    } else {
      this.isError = true;
      this.errorMessage = "Ошибка загрузки";
    }
    this.isAwaiting = false;
  }

  protected loadLastParams(): MultipleUploadResultParams {
    return this.storageService.getItem(LocalStorageConst.resultMultipleUploadParams) ?? new MultipleUploadResultParams();
  }

  public onFinish() {
    this.endpointService.sendToUpload(this.resultParams);
  }
}
