import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { NotificationUploadProcessInfo, UploadProcessState } from "src/app/core/common/models/notification.models";
import { EndpointBaseService } from "src/app/core/services/base-services/endpoint-base.service";
import { NetMessageTypes, NetSubTypes, NWRequestUploadInfoSub, NWSetUser, NWSubMessage, NWSubUploadProcessInfo } from "src/app/shared/models/net-messages/net-worker-messages";
import { NetWorkerService } from "src/app/shared/workers-module/services/net-worker.service";
import { environment } from "src/environments/environment";
import { v4 } from "uuid";

@Injectable()
export class UploadProcessesMonitoringEndpoint extends EndpointBaseService {

    public get uploadProcessInfoSub(): Subject<NotificationUploadProcessInfo> {
        return this.pUploadProcessInfoSub;
    }

    private pUploadProcessInfoSub = new Subject<NotificationUploadProcessInfo>();

    constructor(protected netWorker: NetWorkerService) {
        super(netWorker);
        this.sendUploadingInfoSubRequest();
    }

    public async getAllUploadProcess(): Promise<NotificationUploadProcessInfo[] | null> {
        if (environment.isTest) {
            return [{
                state: UploadProcessState.processing,
                creationTime: Date.now().toString(),
                lastUpdateTime: Date.now().toString(),
                baseName: "qwe",
                description: "asdasfafasdasfafasdasfafasdasfaf asdasfafasdasfafasdasfafasdasfaf asdasfafasdasfafasdasfafasdasfaf asdasfafasdasfafasdasfaf",
                requestGuid: "1",
            }]
        }

        const avNB = await this.netWorker.postMessageToWorkerAsync({
            messageType: NetMessageTypes.getUploadProcessInfo,
            isSub: false,
        });
        return await avNB?.data?.message;
    }

    private sendUploadingInfoSubRequest() {
        const req: NWRequestUploadInfoSub = {
            isSub: true,
            messageType: NetSubTypes.uploadProcessInfo,
            guid: v4(),
        }
        if (environment.isTest) {
            let i = 0;
            let inter = setInterval(() => {
                const oldProc = {
                    state: Math.round(Math.random() * 4),
                    creationTime: Date.now().toString(),
                    lastUpdateTime: Date.now().toString(),
                    baseName: "ЙЦЙУ",
                    description: "description  ----  " + v4(),
                    requestGuid: v4(),
                };
                this.pUploadProcessInfoSub.next(oldProc);
                i++;
                if (i >= 3) clearInterval(inter);
            }, 1000)
        }

        this.netWorker.requestSub(req).subscribe(x => {
            const data = x.data?.message as NotificationUploadProcessInfo;
            this.pUploadProcessInfoSub.next(data);
        });
    }
}