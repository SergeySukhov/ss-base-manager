import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { NetMessageTypes, NetSubTypes } from "src/app/shared/models/net-messages/net-worker-messages";
import { AvailableBaseAdditionInfo } from "src/app/shared/models/server-models/AvailableBaseAdditionInfo";
import { AvailableNormativeBaseType } from "src/app/shared/models/server-models/AvailableNormativeBaseType";
import { NetWorkerService } from "src/app/shared/workers-module/services/net-worker.service";
import { v4 } from "uuid";
import { EndpointBaseService } from "../../../core/services/base-services/endpoint-base.service";

@Injectable()
export class BaseLogMonitoringEndpointService extends EndpointBaseService {

    private innerSub: Subject<any>[] = [];

    constructor(protected netWorker: NetWorkerService) {
        super(netWorker);
    }

    subNotifications(userContextId: string): Subject<string> {
        const sub = this.netWorker.initSub({
            guid: v4(),
            messageType: NetSubTypes.notificationSub,
            needSub: true,
            data: userContextId,
        });
        this.innerSub.push(sub);
        const resultSub = new Subject<string>();
        sub.subscribe(x => {
            resultSub.next(x.data);
        });
        return resultSub;
    }

    closeAllSubs() {
        this.innerSub.forEach(s => {
            s.complete();
        });
        this.innerSub = [];
    }

}
