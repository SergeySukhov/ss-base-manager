import { Injectable } from "@angular/core";
import { UUID } from "angular2-uuid";
import { NetMessageTypes } from "src/app/shared/models/net-messages/net-worker-messages";
import { NormativeBaseInfo } from "src/app/shared/models/server-models/normative-base-info";
import { NetWorkerService } from "src/app/shared/workers-module/services/net-worker.service";
import { FormBaseResultParams } from "../models/form-base.models";

@Injectable()
export class FormulaBaseEndpointService { //  extends EndpointService {

    constructor(private netWorker: NetWorkerService) {
    }

    public async getAvailableNormativeBases(): Promise<NormativeBaseInfo[]> {
        const a = new Promise<NormativeBaseInfo[]>((resolve, reject) => {
            setTimeout(() => {
                resolve([{
                   guid: UUID.UUID(),
                   name: "Dopolnenie idi naxuy 1"
                }, {
                    guid: UUID.UUID(),
                    name: "Dopolnenie idi naxuy 2"
                 },]);
            }, 1000);
        });
        return a;

        // const avNB = await this.netWorker.postMessageToWorkerAsync({
        //     messageType: NetMessageTypes.serverTest,
        //     data: {}
        // });
        // console.log("!! | getAvailableNB | avNB", avNB)
        // return [];
    }

    public async sendFormuls(finalData: FormBaseResultParams): Promise<void> {
        if (!finalData.file) {
            return;
        }
        
        const avNB = await this.netWorker.postMessageToWorkerAsync({
            messageType: NetMessageTypes.sendFormulsUpload,
            data: {
                addonNumber: 1,
                file: finalData.file,
                fileLocation: finalData.fileLocation,
                normoGuid: finalData.normBaseChoice,

            },
        });
        console.log("!! | getAvailableNB | avNB", avNB)
    }
}
