import { Injectable } from "@angular/core";
import { NetMessageTypes } from "src/app/shared/models/net-messages/net-worker-messages";
import { AvailableBaseAdditionInfo } from "src/app/shared/models/server-models/AvailableBaseAdditionInfo";
import { AvailableNormativeBaseType } from "src/app/shared/models/server-models/AvailableNormativeBaseType";
import { NetWorkerService } from "src/app/shared/workers-module/services/net-worker.service";
import { EndpointBaseService } from "../../../core/services/base-services/endpoint-base.service";

@Injectable()
export class AvailabilityBaseEndpointService extends EndpointBaseService {

    constructor(protected netWorker: NetWorkerService) {
        super(netWorker);
    }

    async sendAddNodes(nodes: AvailableNormativeBaseType[]) {
        const avBT = await this.netWorker.postMessageToWorkerAsync({
            messageType: NetMessageTypes.managerAddNodes,
            data: {rootNodes: nodes}
        });
        
    }

    async sendRemoveNodes(guids: string[]) {
        const avBT = await this.netWorker.postMessageToWorkerAsync({
            messageType: NetMessageTypes.managerRemoveNodes,
            data: {guids}
        });
    }

    async sendEditNodes(rootNodes: AvailableNormativeBaseType[], normoNodes: AvailableBaseAdditionInfo[]) {
        const avBT = await this.netWorker.postMessageToWorkerAsync({
            messageType: NetMessageTypes.managerEditNodes,
            data: {rootNodes, normoNodes}
        });
    }

}
