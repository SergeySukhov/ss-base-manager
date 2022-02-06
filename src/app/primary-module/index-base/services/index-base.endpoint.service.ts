import { Injectable } from "@angular/core";
import { NetMessageTypes } from "src/app/shared/models/net-messages/net-worker-messages";
import { NetWorkerService } from "src/app/shared/workers-module/services/net-worker.service";
import { EndpointBaseService } from "../../../core/services/base-services/endpoint-base.service";
import { IndexBaseResultParams } from "../models/index-base.model";

@Injectable()
export class IndexBaseEndpointService extends EndpointBaseService {

    constructor(protected netWorker: NetWorkerService) {
        super(netWorker);
    }

    public async sendIndecies(finalData: IndexBaseResultParams): Promise<void> {
        if (!finalData.mainFile) {
            return;
        }

        const avNB = await this.netWorker.postMessageToWorkerAsync({
            messageType: NetMessageTypes.sendIndeciesUpload,
            isSub: false,
            data: {
                additionNumber: finalData.addBase?.base.additionNumber ?? finalData.baseChoice?.additionNumber ?? 1,
                file: finalData.mainFile,
                
                overhead: finalData.nr,
                profit: finalData.sp,
                isDeploy: finalData.needDeploy,
                year: finalData.addBase?.base?.year ?? finalData.baseChoice?.year ?? 0,
                periodType: finalData.addBase?.base.releasePeriodType ?? finalData.baseChoice?.releasePeriodType ?? 0,
                periodValue: finalData.addBase?.base.releasePeriodValue ?? finalData.baseChoice?.releasePeriodValue ?? 0,
                baseType: finalData.baseType,
                addBase: finalData.addBase ? {
                    guid: finalData.addBase.base.guid,
                } : undefined,

            },
        }, false);
    }
}
