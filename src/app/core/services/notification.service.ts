import { DatePipe } from "@angular/common";
import { Injectable } from "@angular/core";
import { MessageService, PrimeNGConfig } from "primeng/api";
import { Subject } from "rxjs";
import { NetSubTypes, NWSubMessage, NWSubNotificationMessage } from "src/app/shared/models/net-messages/net-worker-messages";
import { NetWorkerService } from "src/app/shared/workers-module/services/net-worker.service";
import { v4 } from "uuid";
import { ImoprtanceLevel, NotificationMessage, NotificationType } from "../common/models/notification.models";



@Injectable()
export class NotificationService {

    public notificationChange: Subject<NotificationMessage> | null = null;

    private endpointSub: Subject<NWSubMessage> | null = null;
    readonly allLogs: NotificationMessage[] = [];

    constructor(
        private messageService: MessageService,
        private datePipe: DatePipe,
        protected netWorker: NetWorkerService,
        private primengConfig: PrimeNGConfig,
    ) {
        this.primengConfig.ripple = true;
     }

    initNotifications() {
        if (this.notificationChange !== null) {
            return;
        }
        this.endpointSub = this.netWorker.requestSub({
            guid: v4(),
            messageType: NetSubTypes.notificationSub,
            isSub: true,
        });
        this.notificationChange = new Subject<NotificationMessage>();
        this.endpointSub.subscribe(x => {

            const message = x.data.message as NotificationMessage;

            if (!message.timeStamp) {
                message.timeStamp = this.datePipe.transform(Date.now(), "dd.MM | HH:mm:ss") ?? "";
            } else if (Number.parseInt(message.timeStamp) > 100000) {
                message.timeStamp = this.datePipe.transform(message.timeStamp, "dd.MM | HH:mm:ss") ?? "";
            }

            this.allLogs.unshift(message)
            this.notificationChange?.next(x.data.message);
            this.showNotification(x.data.message, x.data.message.imoprtance === ImoprtanceLevel.high);
        });
    }

    showNotification(notificationMessage: NotificationMessage, sticky = false) {
        const toStringType = notificationMessage.type === NotificationType.info ?
            "info" : notificationMessage.type === NotificationType.error ? "error" : "warn";

        this.messageService.add({
            severity: toStringType,
            summary: notificationMessage.fromService,
            detail: notificationMessage.message,
            life: sticky ? undefined : 5000,
            closable: sticky,
            sticky,

        });
    }

    closeAllSubs() {
        this.notificationChange?.complete();
        this.notificationChange = null;
        this.endpointSub?.complete();
        this.endpointSub = null;
        this.netWorker.requestSub({
            guid: v4(),
            messageType: NetSubTypes.closeAllSubs,
            isSub: true,
        });
    }
}

