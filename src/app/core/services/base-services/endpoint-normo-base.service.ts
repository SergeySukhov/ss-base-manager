import { Injectable } from "@angular/core";
import { NetMessageTypes } from "src/app/shared/models/net-messages/net-worker-messages";
import { AvailableBaseAdditionInfo, } from "src/app/shared/models/server-models/AvailableBaseAdditionInfo";
import { AvailableBaseIndexInfo, ReleasePeriodType } from "src/app/shared/models/server-models/AvailableBaseIndexInfo";
import { WorkCategory } from "src/app/shared/models/server-models/AvailableIndexWorkCategory";
import { AvailabilityNodes, AvailableNormativeBaseType, BaseType } from "src/app/shared/models/server-models/AvailableNormativeBaseType";
import { NetWorkerService } from "src/app/shared/workers-module/services/net-worker.service";
import { environment } from "src/environments/environment";
import { v4 } from "uuid";
import { EndpointBaseService } from "./endpoint-base.service";

@Injectable()
export abstract class EndpointNormoBaseService extends EndpointBaseService {
    testServerless = environment.isTest;
    constructor(protected netWorker: NetWorkerService) {
        super(netWorker);
    }

    public async getAvailableBaseTypes(): Promise<AvailableNormativeBaseType[] | null> {
        if (this.testServerless) {
            const a = new Promise<AvailableNormativeBaseType[]>((resolve, reject) => {
                setTimeout(() => {
                    resolve([{
                        guid: v4(),
                        isCancelled: false,
                        availabilityNodes: [AvailabilityNodes.Normatives],
                        isAvailable: true,
                        type: BaseType.TSN,
                        typeName: "qeqwqew"

                    }, {
                        guid: v4(),
                        isCancelled: false,
                        availabilityNodes: [AvailabilityNodes.Normatives],
                        isAvailable: false,
                        type: BaseType.TSN_MGE_13,
                        typeName: "xxxxxxxxxx"

                    },]);
                }, 100);
            });
            return a;
        }
        const avBT = await this.netWorker.postMessageToWorkerAsync({
            messageType: NetMessageTypes.getAvailableBaseTypes,
            isSub: false,
        });
        const mappedAvailableBases = avBT?.data as AvailableNormativeBaseType[]
        if (!!mappedAvailableBases?.length) {
            return mappedAvailableBases;
        } else {
            return null;
        }
    }

    public async getAvailableNormativeBases(baseType: BaseType): Promise<AvailableBaseAdditionInfo[] | null> {
        if (this.testServerless) {
            const a = new Promise<AvailableBaseAdditionInfo[]>((resolve, reject) => {
                setTimeout(() => {
                    resolve([{
                        guid: "cf987c98-7631-4929-b594-d636f29b3a49", // v4(),
                        name: "Dopolnenie idi naxuy 1",
                        additionNumber: 1,
                        additionRegexp: "",
                        isAvailable: true,
                        isCancelled: false,
                        shortName: "rew     eqe e   weew",
                        type: BaseType.TSN,
                        parentBaseType: BaseType.TSN,
                    }, {
                        guid: "54148634-4072-42de-a149-c8872b38f43a", // v4(),
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
        }
        const avNB = await this.netWorker.postMessageToWorkerAsync({
            messageType: NetMessageTypes.getAvailableNormoBases,
            isSub: false,
            data: { type: baseType },
        });
        const mappedAvailableBases = avNB?.data as AvailableBaseAdditionInfo[]
        if (!!mappedAvailableBases?.length) {
            return mappedAvailableBases;
        } else {
            return null;
        }
    }

    public async getAvailableIndeciesBases(baseType: BaseType): Promise<AvailableBaseIndexInfo[] | null> {
        if (this.testServerless) {
            const a = new Promise<AvailableBaseIndexInfo[]>((resolve, reject) => {
                setTimeout(() => {
                    const a: AvailableBaseIndexInfo = {
                        guid: v4(),
                        additionNumber: 1,
                        isAvailable: true,
                        isCancelled: false,
                        type: BaseType.TSN,
                        releasePeriodType: ReleasePeriodType.Month,
                        year: 1999,
                        releasePeriodValue: 2,
                        techDocPath: "",
                        availableIndexWorkCategoryGuid: v4(),
                        parentIndex: {
                            guid: v4(),
                            availableNormativeBaseTypeGuid: "",
                            parentIndexName: "Parent Ind Name",
                            workCategory: WorkCategory.Build,   
                        }

                    }
                    const aa = [a];
                    for(let i = 0; i< 60; i++) {
                        const b = JSON.parse(JSON.stringify(a));
                        b.guid = v4();
                        aa.push(b);
                    }
                    resolve(aa.filter(x => x.type === baseType));
                }, 100);
            });
            return a;
        }

        const avNB = await this.netWorker.postMessageToWorkerAsync({
            messageType: NetMessageTypes.getAvailableIndeciesBases,
            isSub: false,
            data: { type: baseType },
        });
        const mappedAvailableBases = avNB?.data as AvailableBaseIndexInfo[]
        if (!!mappedAvailableBases?.length) {
            return mappedAvailableBases;
        } else {
            return null;
        }
    }
}