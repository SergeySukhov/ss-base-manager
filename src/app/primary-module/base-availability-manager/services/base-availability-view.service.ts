import { Injectable } from "@angular/core";
import { WorkCategoryPipe } from "src/app/core/pipes/work-type.pipe";
import { IndeciesDataViewNode } from "src/app/secondary-module/table-indecies-control/table-indecies-control.component";
import { NormoBaseDataView } from "src/app/secondary-module/table-normo-control/table-normo-control.component";
import { CommonNodes, DataViewNode, DataViewRoot } from "src/app/shared/common-components/table-control-base/table-control-base";
import { AvailableBaseAdditionInfo } from "src/app/shared/models/server-models/AvailableBaseAdditionInfo";
import { AvailableBaseIndexInfo, ReleasePeriodType } from "src/app/shared/models/server-models/AvailableBaseIndexInfo";
import { WorkCategory } from "src/app/shared/models/server-models/AvailableIndexWorkCategory";
import { AvailableNormativeBaseType, AvailabilityNodes, BaseType } from "src/app/shared/models/server-models/AvailableNormativeBaseType";
import { DateIndeciesHelper } from "src/app/shared/utils/date-indecies.helper.service";
import { AvailabilityBaseEndpointService } from "./availability-base.endpoint.service";

@Injectable()
export class BaseAvailabilityViewService {

    constructor(private endpointService: AvailabilityBaseEndpointService,
        private workCatPipe: WorkCategoryPipe,) {
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
        this.endpointService.sendRootEditNodes(nodes.map(this.mapToBaseType));
    }

    editNormoNodes(nodes: NormoBaseDataView[]) {
        this.endpointService.sendNormoEditNodes(nodes.map(this.mapToAdditionalInfo));
    }

    editIndeciesNodes(nodes: IndeciesDataViewNode[]) {
        this.endpointService.sendIndexesEditNodes(nodes.map(this.mapToIndexInfo));
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

    mapToIndexInfo(x: IndeciesDataViewNode): AvailableBaseIndexInfo {
        const mappedIndNode: AvailableBaseIndexInfo = x.data;
        mappedIndNode.isAvailable = !!x.availability;
        const period = DateIndeciesHelper.toPeriodFromString(x.name.periodValue)
        mappedIndNode.releasePeriodType = period?.periodType ?? ReleasePeriodType.Month;
        mappedIndNode.releasePeriodValue = period?.value ?? 0;
        mappedIndNode.year = x.name.year;
        mappedIndNode.isCancelled = x.isCancelled;
        mappedIndNode.parentIndex.workCategory = this.workCatPipe.backTransform(x.name.workCategory) ?? WorkCategory.Build;
        return mappedIndNode;
    }

    mapToAdditionalInfo(x: NormoBaseDataView): AvailableBaseAdditionInfo {
        const mappedNormoNode: AvailableBaseAdditionInfo = x.data;
        mappedNormoNode.name = x.name;
        mappedNormoNode.isAvailable = !!x.availability;
        mappedNormoNode.isCancelled = x.isCancelled;
        return mappedNormoNode;
    }

    mapToBaseType(x: DataViewRoot): AvailableNormativeBaseType {
        const mappedRootNode: AvailableNormativeBaseType = x.data;

        mappedRootNode.availabilityNodes = x.availableChilds ?? [];
        mappedRootNode.isAvailable = !!x.availability;
        mappedRootNode.isCancelled = x.isCancelled;
        mappedRootNode.typeName = x.name;
        return mappedRootNode;
    }

    mapToViewRoot(baseTypeInfo: AvailableNormativeBaseType): DataViewRoot {
        const rootNode: DataViewRoot = {
            guid: baseTypeInfo.guid,
            availability: baseTypeInfo.isAvailable,
            name: baseTypeInfo.typeName,
            baseTypeName: baseTypeInfo.typeName,
            isCancelled: baseTypeInfo.isCancelled,
            data: baseTypeInfo,
            isRoot: true,
            isExpand: true,
            availableChilds: baseTypeInfo.availabilityNodes,
          };
        return rootNode;
    }

    mapToViewAdditional(normoDataBaseInfo: AvailableBaseAdditionInfo, baseTypeInfo: AvailableNormativeBaseType): NormoBaseDataView {
        return {
            guid: normoDataBaseInfo.guid,
            availability: normoDataBaseInfo.isAvailable,
            name: normoDataBaseInfo.name,
            baseTypeName: baseTypeInfo.typeName,
            isCancelled: normoDataBaseInfo.isCancelled,
            isRoot: false,
            data: normoDataBaseInfo,
            parentGuid: baseTypeInfo.guid,
          }
    }

    mapToViewIndex(indecyDataBaseInfo: AvailableBaseIndexInfo, baseTypeInfo: AvailableNormativeBaseType): IndeciesDataViewNode {
        return {
            guid: indecyDataBaseInfo.guid,
            availability: indecyDataBaseInfo.isAvailable,
            name: {
              periodValue: DateIndeciesHelper.GetPeriod(indecyDataBaseInfo),
              year: indecyDataBaseInfo.year,
              workCategory: this.workCatPipe.transform(indecyDataBaseInfo.parentIndex.workCategory),
            },
            baseTypeName: baseTypeInfo.typeName,
            isCancelled: indecyDataBaseInfo.isCancelled,
            isRoot: false,
            data: indecyDataBaseInfo,
            parentGuid: baseTypeInfo.guid,
          }
    }
}