import { Injectable } from "@angular/core";
import { EndpointService } from "src/app/core/services/endpoint.service";
import { AuthMessageTypes } from "src/app/shared/models/auth-messages/auth-worker-messages";
import { NetMessageTypes } from "src/app/shared/models/net-messages/net-worker-messages";
import { BaseType, NormativeBaseInfo } from "src/app/shared/models/server-models/normative-base-info";
import { AuthWorkerService } from "src/app/shared/workers-module/services/auth-worker.service";
import { NetWorkerService } from "src/app/shared/workers-module/services/net-worker.service";
import { v4 } from "uuid";
import { NormBaseResultParams } from "../models/norm-base.models";

@Injectable()
export class NormativeBaseEndpointService { //  extends EndpointService {

    constructor(private netWorker: NetWorkerService) {
    }

    public async getAvailableNormativeBases(baseType: BaseType): Promise<NormativeBaseInfo[] | null> {
        const a = new Promise<NormativeBaseInfo[]>((resolve, reject) => {
            setTimeout(() => {
                resolve([{
                   guid: v4(),
                   name: "Dopolnenie idi naxuy 1",
                   additionalNumber: 1,
                   
                }]);
            }, 100);
        });
        return a;

        // const avNB = await this.netWorker.postMessageToWorkerAsync({
        //     messageType: NetMessageTypes.getAvailableNormoBases,
        // });
        // const a = avNB?.data as AvailableBaseAdditionInfo[]
        // console.log("!! | getAvailableNormativeBases | a", a)
        // if (!!a?.length) {
        //     return a.map(x => {
        //         return { guid: x.guid, name: x.name, additionalNumber: x.additionNumber }
        //     });
        // } else {
        //     return null;
        // }
    }

    public async sendNormatives(finalData: NormBaseResultParams): Promise<void> {
        if (!finalData.fileNormatives) {
            return;
        }

        const avNB = await this.netWorker.postMessageToWorkerAsync({
            messageType: NetMessageTypes.sendNormativesUpload,
            data: {
                addonNumber: finalData.normBaseChoice?.additionalNumber ?? 11,
                fileNormatives: finalData.fileNormatives,
                normoGuid: finalData.addBase?.guid ?? finalData.normBaseChoice?.guid ?? "",
                isDeploy: finalData.needDeploy
            },
        });
    }
}
