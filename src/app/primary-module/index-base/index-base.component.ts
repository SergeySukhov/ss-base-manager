import { Component, OnInit } from '@angular/core';
import { StepperData } from 'src/app/secondary-module/stepper/models/stepper-model';
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
  public resultParams: IndexBaseResultParams = new IndexBaseResultParams();
  public tempProgress = 0;
  public errorMessages = "";

  constructor(private declarationService: IndexBaseDeclarationService, private endpointService: IndexBaseEndpointService) { }

  async ngOnInit() {
    const avTypes = await this.endpointService.getAvailableBaseTypes();
    if (avTypes?.length) {
      this.data = this.declarationService.getStepperModel(this, avTypes);
    } else {
      this.errorMessages = "!! ошибка загрузки";
    }
  }

  onFinish() {
    this.endpointService.sendIndecies(this.resultParams);
    this.tempProgress = 1;
    const tempInterval = setInterval(() => {
      this.tempProgress += 2;
      if (this.tempProgress >= 100) {
        clearInterval(tempInterval);
      }
    }, 50)
  }

  onModelChange() {
  }

}
