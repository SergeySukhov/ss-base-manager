import { Component, Input, OnInit } from '@angular/core';
import { action, observable, reaction } from 'mobx';
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

  @observable openedLogs = new Map<string, boolean>();

  isOpened(guid: string): boolean {
    console.log("!! guid", guid);
    return !!this.openedLogs.get(guid);
  }

  constructor() { }

  ngOnInit(): void {
    }

  logTypeClass(log: NotificationMessage): string {
    return log.type === NotificationType.error ? "err-log"
      : log.type === NotificationType.warn ? "warn-log" : "";
  }

  @action openLog(guid: string) {
    this.openedLogs.set(guid, !this.openedLogs.get(guid));

    // if (this.openedLogs.has(guid)) {
    // } else {
    //   this.openedLogs.set(guid, true);
    // }
  }

}
