import { Injectable } from "@angular/core";
import { IndeciesDataViewNode } from "src/app/secondary-module/table-indecies-control/table-indecies-control.component";
import { NormoBaseDataView } from "src/app/secondary-module/table-normo-control/table-normo-control.component";
import { CommonNodes, DataViewNode, DataViewRoot } from "src/app/shared/common-components/table-control-base/table-control-base";
import { AvailableBaseAdditionInfo } from "src/app/shared/models/server-models/AvailableBaseAdditionInfo";
import { AvailableBaseIndexInfo } from "src/app/shared/models/server-models/AvailableBaseIndexInfo";
import { AvailableNormativeBaseType, AvailabilityNodes, BaseType } from "src/app/shared/models/server-models/AvailableNormativeBaseType";
import { AvailabilityBaseEndpointService } from "./availability-base.endpoint.service";

@Injectable()
export class BaseAvailabilityViewService {

    constructor(private endpointService: AvailabilityBaseEndpointService,) {
    }

    addRootNodes(nodes: { viewData: DataViewRoot, type: BaseType }[]): DataViewRoot[] {
        const serverNodes = nodes.map(x => {
            const mappedRootNode: AvailableNormativeBaseType = {
                guid: x.viewData.guid,
                availabilityNodes: [AvailabilityNodes.Normatives, AvailabilityNodes.Indexes, AvailabilityNodes.Corrections],
                isAvailable: !!x.viewData.availability,
                isCancelled: x.viewData.isCancelled,
                type: x.type,
                typeName: x.viewData.name,
            };
            x.viewData.data = mappedRootNode;
            // this.updNode = x.viewData;
            return mappedRootNode;
        });
        this.endpointService.sendAddNodes(serverNodes);
        return nodes.map(x => x.viewData);
    }

    removeNodes(nodes: CommonNodes[]) {
        this.endpointService.sendRemoveNodes(nodes.map(x => x.guid));
    }

    editRootNodes(nodes: DataViewRoot[]) {
        this.endpointService.sendRootEditNodes(nodes.map(x => {
            const mappedRootNode: AvailableNormativeBaseType = x.data;

            if (x.isRoot) {
                mappedRootNode.availabilityNodes = x.availableChilds ?? [];
            }
            mappedRootNode.isAvailable = !!x.availability;
            mappedRootNode.isCancelled = x.isCancelled;
            mappedRootNode.typeName = x.name;

            return mappedRootNode;
        }));
    }

    editNormoNodes(nodes: NormoBaseDataView[]) {
        this.endpointService.sendNormoEditNodes(nodes.map(x => {
            const mappedNormoNode: AvailableBaseAdditionInfo = x.data;
            mappedNormoNode.name = x.name;
            mappedNormoNode.isAvailable = !!x.availability;
            mappedNormoNode.isCancelled = x.isCancelled;
            return mappedNormoNode;
        }));
    }

    editIndeciesNodes(nodes: IndeciesDataViewNode[]) {
        this.endpointService.sendIndexesEditNodes(nodes.map(x => {
            const mappedIndNode: AvailableBaseIndexInfo = x.data;
            mappedIndNode.isAvailable = !!x.availability;
            mappedIndNode.releasePeriodType = x.name.periodType;
            mappedIndNode.releasePeriodValue = Number.parseInt(x.name.periodValue);
            mappedIndNode.year = x.name.year;
            mappedIndNode.isCancelled = x.isCancelled;
            return mappedIndNode;
        }));
    }

    async loadAvailableBaseTypes(): Promise<AvailableNormativeBaseType[]> {
        return await this.endpointService.getAvailableBaseTypes() ?? [];
    }

    async loadIndeciesData(baseTypes: AvailableNormativeBaseType[]): Promise<AvailableBaseIndexInfo[]> {
        const indeciesInfoPromises: Promise<AvailableBaseIndexInfo[] | null>[] = [];

        baseTypes.forEach(x => {
            const promise = this.endpointService.getAvailableIndeciesBases(x.type);
            indeciesInfoPromises.push(promise);
        });

        const serverResponse = await Promise.all(indeciesInfoPromises);
        const availableBases: AvailableBaseIndexInfo[] = [];
        serverResponse.forEach(x => {
            if (!!x) {
                availableBases.push(...x);
            }
        });

        return availableBases;
    }

    async loadAdditionalData(baseTypes: AvailableNormativeBaseType[]): Promise<AvailableBaseAdditionInfo[]> {
        const additionalInfoPromises: Promise<AvailableBaseAdditionInfo[] | null>[] = [];

        baseTypes.forEach(x => {
            const promise = this.endpointService.getAvailableNormativeBases(x.type);
            additionalInfoPromises.push(promise);
        });

        const serverResponse = await Promise.all(additionalInfoPromises);
        const availableBases: AvailableBaseAdditionInfo[] = [];
        serverResponse.forEach(x => {
            if (!!x) {
                availableBases.push(...x);
            }
        });

        return availableBases;
    }
}