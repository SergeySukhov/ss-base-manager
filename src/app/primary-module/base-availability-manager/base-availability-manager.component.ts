import { Component, OnInit } from '@angular/core';
import { BaseType } from 'src/app/shared/models/server-models/normative-base-info';
import { AvailabilityBaseEndpointService } from './services/availability-base.endpoint.service';

@Component({
  selector: 'ss-base-availability-manager',
  templateUrl: './base-availability-manager.component.html',
  styleUrls: ['./base-availability-manager.component.scss'],
  providers: [
    AvailabilityBaseEndpointService
  ]
})
export class BaseAvailabilityManagerComponent implements OnInit {

  data: string[] = [];

  constructor(private endpointService: AvailabilityBaseEndpointService) {

  }

  ngOnInit(): void {
    this.endpointService.getAvailableNormativeBases(BaseType.TSN_MGE).then(result => {
      if (result?.length) {
        this.data = result.map(x => x.name);
      }
    });
  }

}
