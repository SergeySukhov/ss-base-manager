import { Injectable } from "@angular/core";
import { NetMessageTypes } from "src/app/shared/models/net-messages/net-worker-messages";
import { AvailableBaseAdditionInfo, } from "src/app/shared/models/server-models/AvailableBaseAdditionInfo";
import { AvailabilityNodes, AvailableNormativeBaseType, BaseType } from "src/app/shared/models/server-models/AvailableNormativeBaseType";
import { NetWorkerService } from "src/app/shared/workers-module/services/net-worker.service";
import { v4 } from "uuid";

@Injectable()
export abstract class EndpointBaseService {

    constructor(protected netWorker: NetWorkerService) {
    }

    public async getAvailableBaseTypes(): Promise<AvailableNormativeBaseType[] | null> {
        const a = new Promise<AvailableNormativeBaseType[]>((resolve, reject) => {
            setTimeout(() => {
                resolve([{
                    guid: v4(),
                    isCancelled: false,
                    availabilityNodes: [AvailabilityNodes.Normatives],
                    isAvailable: true,
                    type: BaseType.TSN,
                    typeName: "qeqwqew"

                },{
                    guid: v4(),
                    isCancelled: false,
                    availabilityNodes: [AvailabilityNodes.Normatives],
                    isAvailable: false,
                    type: BaseType.TSN_MGE_13,
                    typeName: "xxxxxxxxxx"

                }, ]);
            }, 100);
        });
        return a;

        const avBT = await this.netWorker.postMessageToWorkerAsync({
            messageType: NetMessageTypes.getAvailableBaseTypes,
        });
        const mappedAvailableBases = avBT?.data as AvailableNormativeBaseType[]
        if (!!mappedAvailableBases?.length) {
            return mappedAvailableBases;
        } else {
            return null;
        }
    }

    public async getAvailableNormativeBases(baseType: BaseType): Promise<AvailableBaseAdditionInfo[] | null> {
        const a = new Promise<AvailableBaseAdditionInfo[]>((resolve, reject) => {
            setTimeout(() => {
                resolve([{
                    guid: v4(),
                    name: "Dopolnenie idi naxuy 1",
                    additionNumber: 1,
                    additionRegexp: "",
                    isAvailable: true,
                    isCancelled: false,
                    shortName: "rew     eqe e   weew",
                    type: BaseType.TSN,
                    parentBaseType: BaseType.TSN,
                },{
                    guid: v4(),
                    name: "Dopolnenie idi naxuy 2",
                    additionNumber: 1,
                    additionRegexp: "",
                    isAvailable: false,
                    isCancelled: false,
                    shortName: "rew     eqe e   weew",
                    type: BaseType.TSN,
                    parentBaseType: BaseType.TSN,
                },].filter(x => x.type === baseType));
            }, 100);
        });
        return a;

        const avNB = await this.netWorker.postMessageToWorkerAsync({
            messageType: NetMessageTypes.getAvailableNormoBases,
            data: {type: baseType},
        });
        const mappedAvailableBases = avNB?.data as AvailableBaseAdditionInfo[]
        if (!!mappedAvailableBases?.length) {
           return mappedAvailableBases;
        } else {
            return null;
        }
    }
}