import { Component, OnInit } from '@angular/core';
import { LocalStorageService, LocalStorageConst } from 'src/app/core/services/local-storage.service';
import { StepperData } from 'src/app/secondary-module/stepper/models/stepper-model';
import { NormBaseResultParams } from '../normative-base/models/norm-base.models';
import { IndexBaseResultParams } from './models/index-base.model';
import { IndexBaseDeclarationService } from './services/index-base.declaration.service';
import { IndexBaseEndpointService } from './services/index-base.endpoint.service';

@Component({
  selector: 'ss-index-base',
  templateUrl: './index-base.component.html',
  styleUrls: ['./index-base.component.scss'],
  providers: [
    IndexBaseEndpointService,
    IndexBaseDeclarationService,
  ]
})
export class IndexBaseComponent implements OnInit {

  public data: StepperData | null = null;
  public resultParams: IndexBaseResultParams;
  public errorMessages = "";

  constructor(private declarationService: IndexBaseDeclarationService, private endpointService: IndexBaseEndpointService,
    private storageService: LocalStorageService) {
    this.resultParams = this.storageService.getItem(LocalStorageConst.resultIndexParams) ?? new IndexBaseResultParams();
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
      this.storageService.setItem(LocalStorageConst.resultIndexParams, this.resultParams);
    })
  }

  onFinish() {
    this.endpointService.sendIndecies(this.resultParams);
  }

  onModelChange() {
    this.declarationService.update(this.resultParams);
  }

}
