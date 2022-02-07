import { Component, Input, OnInit } from '@angular/core';
import { NotificationMessage, NotificationType } from 'src/app/core/common/models/notification.models';


@Component({
  selector: 'ss-log-viewer',
  templateUrl: './log-viewer.component.html',
  styleUrls: ['./log-viewer.component.scss']
})
export class LogViewerComponent implements OnInit {

  @Input() filter: { serviceName: string, time: string, message: string } | undefined;

  @Input() logsData: NotificationMessage[] | undefined;
  @Input() oldLogsData: NotificationMessage[] | undefined;
  // TODO: переделать
  get logs(): NotificationMessage[] {
    if (!!this.filter && this.logsData) {
      return this.logsData.reverse().filter(x => !this.filter?.serviceName || x.fromService.includes(this.filter.serviceName));
    } else {
      return this.logsData ?? [];
    }
  }



  constructor() { }

  ngOnInit(): void {
  }

  logTypeClass(log: NotificationMessage): string {
    return log.type === NotificationType.error ? "err-log"
      : log.type === NotificationType.warn ? "warn-log" : "";
  }

}
