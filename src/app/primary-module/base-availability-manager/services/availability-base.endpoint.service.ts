import { Injectable } from "@angular/core";
import { NetMessageTypes } from "src/app/shared/models/net-messages/net-worker-messages";
import { BaseType, NormativeBaseInfo } from "src/app/shared/models/server-models/normative-base-info";
import { NetWorkerService } from "src/app/shared/workers-module/services/net-worker.service";
import { v4 } from "uuid";

@Injectable()
export class AvailabilityBaseEndpointService {

    constructor(private netWorker: NetWorkerService) {
    }

    public async getAvailableNormativeBases(baseType: BaseType): Promise<NormativeBaseInfo[] | null> {
        const a = new Promise<NormativeBaseInfo[]>((resolve, reject) => {
            setTimeout(() => {
                resolve([{
                   guid: v4(),
                   name: "Dopolnenie idi naxuy 1",
                   additionalNumber: 1,
                   
                }, {
                    guid: v4(),
                    name: "Dopolnenie idi naxuy 1",
                    additionalNumber: 1,
                    
                 },{
                    guid: v4(),
                    name: "Dopolnenie idi naxuy 1",
                    additionalNumber: 1,
                    
                 },{
                    guid: v4(),
                    name: "Dopolnenie idi naxuy 1",
                    additionalNumber: 1,
                    
                 },{
                    guid: v4(),
                    name: "Dopolnenie idi naxuy 1",
                    additionalNumber: 1,
                    
                 },{
                    guid: v4(),
                    name: "Dopolnenie idi naxuy 1",
                    additionalNumber: 1,
                    
                 },{
                    guid: v4(),
                    name: "Dopolnenie idi naxuy 1",
                    additionalNumber: 1,
                    
                 },{
                    guid: v4(),
                    name: "Dopolnenie idi naxuy 1",
                    additionalNumber: 1,
                    
                 },{
                    guid: v4(),
                    name: "Dopolnenie idi naxuy 1",
                    additionalNumber: 1,
                    
                 },{
                    guid: v4(),
                    name: "Dopolnenie idi naxuy 1",
                    additionalNumber: 1,
                    
                 },{
                    guid: v4(),
                    name: "Dopolnenie idi naxuy 1",
                    additionalNumber: 1,
                    
                 },{
                    guid: v4(),
                    name: "Dopolnenie idi naxuy 1",
                    additionalNumber: 1,
                    
                 },{
                    guid: v4(),
                    name: "Dopolnenie idi naxuy 1",
                    additionalNumber: 1,
                    
                 },{
                    guid: v4(),
                    name: "Dopolnenie idi naxuy 1",
                    additionalNumber: 1,
                    
                 },{
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
}
