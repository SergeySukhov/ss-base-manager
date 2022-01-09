import { AfterViewInit, Component, OnInit } from '@angular/core';
import { NotificationService } from 'src/app/core/services/notification.service';
import { UserService } from 'src/app/core/services/user.service';
import { BaseLogMonitoringEndpointService } from './services/base-log-monitoring.endpoint.service';

@Component({
  selector: 'ss-base-logs-monitoring',
  templateUrl: './base-logs-monitoring.component.html',
  styleUrls: ['./base-logs-monitoring.component.scss'],
  providers: [
    BaseLogMonitoringEndpointService,
  ]
})
export class BaseLogsMonitoringComponent implements OnInit {

  readonly allLogs: string[] = [];

  constructor(private userService: UserService, private endpointService: BaseLogMonitoringEndpointService,
    private notificationService: NotificationService) { }

  ngOnInit() {
    this.notificationService.notificationChange?.subscribe(notification => {
      this.allLogs.push(notification);
    });
  }

}
