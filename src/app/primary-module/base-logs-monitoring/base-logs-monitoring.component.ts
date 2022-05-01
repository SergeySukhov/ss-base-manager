import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MatTabChangeEvent } from "@angular/material/tabs";
import { NotificationMessage } from 'src/app/core/common/models/notification.models';
import { LocalStorageConst } from "src/app/core/services/local-storage.service";
import { NotificationService } from 'src/app/core/services/notification.service';
import { UserService } from 'src/app/core/services/user-services/user.service';
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
  public mainTabIndex = localStorage.getItem(LocalStorageConst.monitoringMainTabIndex) ?? 0;
  private logApis = new Map<string, LogApiService>();

  constructor(private userService: UserService, private endpointService: BaseLogMonitoringEndpointService,
    private notificationService: NotificationService) { }

  ngAfterViewInit(): void {
  }

  ngOnInit() {
    this.serviceTabs.push("Все");
    this.serviceTabs.push(... new Set<string>(this.allLogs.map(x => x.fromService)));

    this.notificationService.notificationChange?.subscribe(notification => {
      if (!this.serviceTabs.find(x => x === notification.fromService)) {
        this.serviceTabs.push(notification.fromService);
        this.logApis.get("Все")?.addLog(notification);
        return;
      }

      this.serviceTabs.filter(x => x === "Все" || x === notification.fromService).forEach(tabName => {
        const api = this.logApis.get(tabName);
        if (api) {
          api.addLog(notification);
        }
      });
    });
  }

  getLogApi(api: LogApiService, tabName: string) {
    this.logApis.set(tabName, api);
    if (tabName === "Все") {
      api.setLogs(this.allLogs);
    } else {
      api.setLogs(this.allLogs.filter(log => log.fromService === tabName));
    }
  }

  selectedMainTabChange(event: MatTabChangeEvent) {
    this.mainTabIndex = event.index;
    localStorage.setItem(LocalStorageConst.monitoringMainTabIndex, "" + event.index);
  }


}
