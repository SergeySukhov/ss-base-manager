import { AfterViewInit, Component, OnInit } from '@angular/core';
import { NotificationMessage } from 'src/app/core/common/models/notification.models';
import { NotificationService } from 'src/app/core/services/notification.service';
import { UserService } from 'src/app/core/services/user.service';
import { LogApiService } from 'src/app/secondary-module/log-viewer/services/log-api.service';
import { BaseLogMonitoringEndpointService } from './services/base-log-monitoring.endpoint.service';

@Component({
  selector: 'ss-base-logs-monitoring',
  templateUrl: './base-logs-monitoring.component.html',
  styleUrls: ['./base-logs-monitoring.component.scss'],
  providers: [
    BaseLogMonitoringEndpointService,
  ]
})
export class BaseLogsMonitoringComponent implements OnInit, AfterViewInit {

  public serviceTabs: string[] = [];
  public allLogs: NotificationMessage[] = this.notificationService.allLogs;

  private logApis = new Map<string, LogApiService>();

  constructor(private userService: UserService, private endpointService: BaseLogMonitoringEndpointService,
    private notificationService: NotificationService) { }

  ngAfterViewInit(): void {
  }

  ngOnInit() {
    this.serviceTabs.push("Все");
  }

  getLogApi(api: LogApiService, tabName: string) {
    this.logApis.set(tabName, api);

    api.setLogs(this.allLogs);

    this.notificationService.notificationChange?.subscribe(notification => {
      if (!this.serviceTabs.find(x => x === notification.fromService)) {
        this.serviceTabs.push(notification.fromService);
      }

      this.serviceTabs.filter(x => x === "Все" || x === notification.fromService).forEach(tabName => {
        const api = this.logApis.get(tabName);
        if (api) {
          api.addLog(notification);
        }
      });
    });
  }
  

}
