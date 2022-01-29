import { Injectable } from "@angular/core";
import { NetMessageTypes } from "src/app/shared/models/net-messages/net-worker-messages";
import { AvailableBaseAdditionInfo } from "src/app/shared/models/server-models/AvailableBaseAdditionInfo";
import { AvailableBaseIndexInfo } from "src/app/shared/models/server-models/AvailableBaseIndexInfo";
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
            isSub: false,
            data: { rootNodes: nodes }
        });

    }

    async sendRemoveNodes(guids: string[]) {
        const avBT = await this.netWorker.postMessageToWorkerAsync({
            messageType: NetMessageTypes.managerRemoveNodes,
            isSub: false,

            data: { guids }
        });
    }

    async sendRootEditNodes(rootNodes: AvailableNormativeBaseType[]) {
        const avBT = await this.netWorker.postMessageToWorkerAsync({
            messageType: NetMessageTypes.managerEditNodes,
            isSub: false,

            data: { rootNodes }
        });
    }
    async sendNormoEditNodes(normoNodes: AvailableBaseAdditionInfo[]) {
        const avBT = await this.netWorker.postMessageToWorkerAsync({
            messageType: NetMessageTypes.managerEditNodes,
            isSub: false,
            data: { normoNodes }
        });
    }

    async sendIndexesEditNodes(indexNodes: AvailableBaseIndexInfo[]) {
        const avBT = await this.netWorker.postMessageToWorkerAsync({
            messageType: NetMessageTypes.managerEditNodes,
            isSub: false,

            data: { indexNodes }
        });
    }
}
