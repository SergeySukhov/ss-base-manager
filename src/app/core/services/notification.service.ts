import { Injectable } from "@angular/core";
import { MessageService, PrimeNGConfig } from "primeng/api";
import { Subject } from "rxjs";
import { NetSubTypes } from "src/app/shared/models/net-messages/net-worker-messages";
import { NetWorkerService } from "src/app/shared/workers-module/services/net-worker.service";
import { v4 } from "uuid";

@Injectable()
export class NotificationService {

    public notificationChange: Subject<any> | null = null;

    constructor(
        private messageService: MessageService, private primengConfig: PrimeNGConfig,
        protected netWorker: NetWorkerService,
    ) {
  
    }

    initNotifications(userContextId: string) {
        this.subNotifications(userContextId);
    }

    showNotification() {
        this.messageService.add({
            severity: 'success', summary: 'Service Message', detail: 'Via MessageService', life: 5000,
            closable: false, sticky: false,
        });
    }

    closeAllSubs() {
        this.notificationChange?.complete();
        this.notificationChange = null;
    }
    
    private subNotifications(userContextId: string) {
        if (this.notificationChange !== null) {
            return;
        }
        const sub = this.netWorker.initSub({
            guid: v4(),
            messageType: NetSubTypes.notificationSub,
            needSub: true,
            data: userContextId,
        });
        this.notificationChange = sub;
        const resultSub = new Subject<string>();
        sub.subscribe(x => {
            resultSub.next(x.data);

            // if (x.data.lvl === "important") {
            //     this.showNotification(x.data.message);
            // }
        });
    }

    
}

