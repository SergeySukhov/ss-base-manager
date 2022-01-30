import { Component, OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { LocalStorageConst, LocalStorageService } from 'src/app/core/services/local-storage.service';
import { IndeciesCommonNodes, IndeciesDataViewRoot } from 'src/app/secondary-module/table-indecies-control/table-indecies-control.component';
import { BaseDataView } from 'src/app/secondary-module/table-normo-control/table-normo-control.component';
import { AvailableBaseAdditionInfo } from 'src/app/shared/models/server-models/AvailableBaseAdditionInfo';
import { AvailableBaseIndexInfo } from 'src/app/shared/models/server-models/AvailableBaseIndexInfo';
import { AvailabilityNodes, AvailableNormativeBaseType, BaseType } from 'src/app/shared/models/server-models/AvailableNormativeBaseType';
import { AvailabilityBaseEndpointService } from './services/availability-base.endpoint.service';

@Component({
  selector: 'ss-base-availability-manager',
  templateUrl: './base-availability-manager.component.html',
  styleUrls: ['./base-availability-manager.component.scss'],
  providers: [
    AvailabilityBaseEndpointService
  ]
})
export class BaseAvailabilityManagerComponent implements OnInit {

  isLoading = false;
  normativeData: BaseDataView[] = [];
  indeciesData: IndeciesCommonNodes[] = [];

  /** Обновление внутренних данных узла при добавлении */
  updNode: BaseDataView | null = null;

  lastTab: number = 0;

  constructor(private endpointService: AvailabilityBaseEndpointService, private storageService: LocalStorageService) {
  }

  ngOnInit() {
    this.lastTab = this.storageService.getItem(LocalStorageConst.lastControlTab) ?? 0;
    this.loadData();
  }

  onTabChange(event: number) {
    this.lastTab = event;
    this.storageService.setItem(LocalStorageConst.lastControlTab, event);
    this.loadData();
  }

  async loadData() {
    this.isLoading = true;
    switch (this.lastTab) {
      case 0:
        await this.loadNormativesData();
        break;
      case 1:
        await this.loadIndeciesData();
        break;
      default:
        return;
    }

    this.isLoading = false;
  }

  handleAddRootNodes(nodes: { viewData: BaseDataView, type: BaseType }[]) {
    this.endpointService.sendAddNodes(nodes.map(x => {
      const mappedRootNode: AvailableNormativeBaseType = {
        guid: x.viewData.guid,
        availabilityNodes: [AvailabilityNodes.Normatives, AvailabilityNodes.Indexes, AvailabilityNodes.Corrections],
        isAvailable: !!x.viewData.availability,
        isCancelled: x.viewData.isCancelled,
        type: x.type,
        typeName: x.viewData.name,
      };
      x.viewData.data = mappedRootNode;
      this.updNode = x.viewData;
      return mappedRootNode;
    }));
  }

  handleRemoveNodes(nodes: BaseDataView[]) {
    this.endpointService.sendRemoveNodes(nodes.map(x => x.guid));
  }

  handleEditRootAndNormoNodes(nodes: BaseDataView[]) {
    const rootNodes = nodes.filter(x => !!x.isRoot);
    const normoNodes = nodes.filter(x => !x.isRoot);

    this.endpointService.sendRootEditNodes(rootNodes.map(x => {
      const mappedRootNode: AvailableNormativeBaseType = x.data;

      mappedRootNode.availabilityNodes = x.availableChilds ?? [];
      mappedRootNode.isAvailable = !!x.availability;
      mappedRootNode.isCancelled = x.isCancelled;
      mappedRootNode.typeName = x.name;

      return mappedRootNode;
    }));

    this.endpointService.sendNormoEditNodes(normoNodes.map(x => {
      const mappedNormoNode: AvailableBaseAdditionInfo = x.data;
      mappedNormoNode.name = x.name;
      mappedNormoNode.isAvailable = !!x.availability;
      mappedNormoNode.isCancelled = x.isCancelled;
      return mappedNormoNode;
    }));

  }

  private async loadIndeciesData() {
    const allAvTypes = await this.endpointService.getAvailableBaseTypes();
    const allBasesPromises: Promise<AvailableBaseIndexInfo[] | null>[] = [];
    if (!allAvTypes?.length) {
      this.isLoading = false;
      return;
    }


    allAvTypes.forEach(x => {
      const promise = this.endpointService.getAvailableIndeciesBases(x.type);
      allBasesPromises.push(promise);
    });

    const serverResponse = await Promise.all(allBasesPromises);
    const availableBases: AvailableBaseIndexInfo[] = [];
    serverResponse.forEach(x => {
      if (!!x) {
        availableBases.push(...x);
      }
    });

    const viewBaseModel: IndeciesCommonNodes[] = [];

    for (let baseTypeInfo of allAvTypes) {
      const rootNode: IndeciesDataViewRoot = {
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
      viewBaseModel.push(rootNode);
      const basesByType = availableBases.filter(x => x.type === baseTypeInfo.type);
      rootNode.hasChildren = !!basesByType.length;

      for (let indecyDataBaseInfo of basesByType) {
        viewBaseModel.push({
          guid: indecyDataBaseInfo.guid,
          availability: indecyDataBaseInfo.isAvailable,
          name: {
            date: "" + indecyDataBaseInfo.releasePeriodValue,
            period: "!!",
            year: indecyDataBaseInfo.year
          },
          baseTypeName: baseTypeInfo.typeName,
          isCancelled: indecyDataBaseInfo.isCancelled,
          isRoot: false,
          data: indecyDataBaseInfo,
          parentGuid: baseTypeInfo.guid,
        });
      }
    }
    this.indeciesData = viewBaseModel;
  }

  private async loadNormativesData() {
    const allAvTypes = await this.endpointService.getAvailableBaseTypes();

    const allBasesPromises: Promise<AvailableBaseAdditionInfo[] | null>[] = [];
    if (!allAvTypes?.length) {
      this.isLoading = false;
      return;
    }

    allAvTypes.forEach(x => {
      const promise = this.endpointService.getAvailableNormativeBases(x.type);
      allBasesPromises.push(promise);
    });

    const serverResponse = await Promise.all(allBasesPromises);
    const availableBases: AvailableBaseAdditionInfo[] = [];
    serverResponse.forEach(x => {
      if (!!x) {
        availableBases.push(...x);
      }
    });

    const viewBaseModel: BaseDataView[] = [];

    for (let baseTypeInfo of allAvTypes) {
      const rootNode: BaseDataView = {
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
      viewBaseModel.push(rootNode);
      const basesByType = availableBases.filter(x => x.type === baseTypeInfo.type);
      rootNode.hasChildren = !!basesByType.length;

      for (let normoDataBaseInfo of basesByType) {
        viewBaseModel.push({
          guid: normoDataBaseInfo.guid,
          availability: normoDataBaseInfo.isAvailable,
          name: normoDataBaseInfo.name,
          baseTypeName: baseTypeInfo.typeName,
          isCancelled: normoDataBaseInfo.isCancelled,

          data: normoDataBaseInfo,
          parentGuid: baseTypeInfo.guid,
        });
      }
    }
    this.normativeData = viewBaseModel;
  }
}
