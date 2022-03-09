import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { action, observable, observe, reaction } from 'mobx';
import { NotificationMessage, NotificationType } from 'src/app/core/common/models/notification.models';
import { LogApiService } from './services/log-api.service';

@Component({
  selector: 'ss-log-viewer',
  templateUrl: './log-viewer.component.html',
  styleUrls: ['./log-viewer.component.scss'],
  providers: [LogApiService]
})
export class LogViewerComponent implements OnInit {

  @Output() api = new EventEmitter<LogApiService>();

  constructor(public logApi: LogApiService) { }

  ngOnInit(): void {
    this.api.emit(this.logApi);
  }

  openLog(guid: string) {
    const log = this.logApi.notificationMessageData.find(x => x.notificationMessage.guid === guid);
    if (log) {
      log.isOpened = !log.isOpened;
    }
  }

}
