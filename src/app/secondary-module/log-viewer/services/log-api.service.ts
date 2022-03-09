import { Injectable } from "@angular/core";
import { NotificationMessage, NotificationType } from "src/app/core/common/models/notification.models";

interface NotificationMessageView {
    notificationMessage: NotificationMessage;
    isOpened: boolean;
    styleClass: string;
  }

@Injectable()
export class LogApiService {
    // TODO: по хорошему нужна прослойка viewService
    notificationMessageData: NotificationMessageView[] = [];

    private allLogs: NotificationMessage[] | undefined;

    constructor() {
    }

    getAllLogs() {
        return this.allLogs;
    }

    addLog(log: NotificationMessage) {
        this.allLogs?.unshift(log);
        this.notificationMessageData.unshift(this.mapNots(log));
    }

    setLogs(logs: NotificationMessage[]) {
        this.allLogs?.unshift(...logs);
        this.notificationMessageData.unshift(...logs.map(log => this.mapNots(log)));
    }

    private mapNots(value: NotificationMessage): NotificationMessageView {
        return {
            notificationMessage: value,
            isOpened: false,
            styleClass: this.logTypeClass(value),
        };
    }

    private logTypeClass(log: NotificationMessage): string {
        return log.type === NotificationType.error ? "err-log"
          : log.type === NotificationType.warn ? "warn-log" : "";
      }
}