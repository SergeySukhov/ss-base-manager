import { Injectable } from "@angular/core";
import { NetMessageTypes } from "src/app/shared/models/net-messages/net-worker-messages";
import { AvailableBaseAdditionInfo, NormativeBaseInfo } from "src/app/shared/models/server-models/normative-base-info";
import { NetWorkerService } from "src/app/shared/workers-module/services/net-worker.service";
import { FormBaseResultParams } from "../models/form-base.models";
// import { v4 } from 'uuid';

@Injectable()
export class FormulaBaseEndpointService { //  extends EndpointService {

    constructor(private netWorker: NetWorkerService) {
    }

    public async getAvailableNormativeBases(): Promise<NormativeBaseInfo[] | null> {
        // const a = new Promise<NormativeBaseInfo[]>((resolve, reject) => {
        //     setTimeout(() => {
        //         resolve([{
        //            guid: v4(),
        //            name: "Dopolnenie idi naxuy 1"
        //         }, {
        //             guid: v4(),
        //             name: "Dopolnenie idi naxuy 2"
        //          },]);
        //     }, 1000);
        // });
        // return a;

        const avNB = await this.netWorker.postMessageToWorkerAsync({
            messageType: NetMessageTypes.getAvailableNormoBases,
        });
        const a = avNB?.data as AvailableBaseAdditionInfo[]
        console.log("!! | getAvailableNormativeBases | a", a)
        if (!!a?.length) {
            return a.map(x => {
                return { guid: x.guid, name: x.name, additionalNumber: x.additionNumber }
            });
        } else {
            return null;
        }
    }

    public async sendFormuls(finalData: FormBaseResultParams): Promise<void> {
        console.log("!! | sendFormuls | finalData", finalData)
        if (!finalData.file || !finalData.normBaseChoice) {
            return;
        }

        const avNB = await this.netWorker.postMessageToWorkerAsync({
            messageType: NetMessageTypes.sendFormulsUpload,
            data: {
                addonNumber: finalData.normBaseChoice.additionalNumber,
                file: finalData.file,
                normoGuid: finalData.normBaseChoice.guid,
                isAdd: false,
                
            },
        });
        console.log("!! | getAvailableNB | avNB", avNB)
    }
}
