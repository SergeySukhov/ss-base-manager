import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/core/services/user.service';
import { BaseLogMonitoringEndpointService } from './services/base-log-monitoring.endpoint.service';

@Component({
  selector: 'ss-base-logs-monitoring',
  templateUrl: './base-logs-monitoring.component.html',
  styleUrls: ['./base-logs-monitoring.component.scss'],
  providers: [BaseLogMonitoringEndpointService,
  ]
})
export class BaseLogsMonitoringComponent implements OnInit {



  constructor(private userService: UserService, private endpointService: BaseLogMonitoringEndpointService) { }

  ngOnInit() {
    const sub = this.endpointService.subNotifications(this.userService.userId);
    sub.subscribe(x => {
      console.log("!! | ngOnInit | x", x)

    })
    this.userService.userChange.subscribe(() => {
      this.endpointService.closeAllSubs();
    });
  }

}
