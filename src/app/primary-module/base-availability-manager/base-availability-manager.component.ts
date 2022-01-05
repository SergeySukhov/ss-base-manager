import { Component, OnInit } from '@angular/core';
import { BaseDataView } from 'src/app/secondary-module/table-control/table-control.component';
import { AvailableBaseAdditionInfo } from 'src/app/shared/models/server-models/AvailableBaseAdditionInfo';
import { AvailableNormativeBaseType, BaseType } from 'src/app/shared/models/server-models/AvailableNormativeBaseType';
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
  data: BaseDataView[] = [];

  constructor(private endpointService: AvailabilityBaseEndpointService) {
  }

  ngOnInit() {
    this.loadData();
  }

  async loadData() {
    this.isLoading = true;
    const allAvTypes = await this.endpointService.getAvailableBaseTypes();
    console.log("!! | loadData | allAvTypes", allAvTypes)

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
    console.log("!! | loadData | availableBases", availableBases)

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
    this.data = viewBaseModel;
    this.isLoading = false;
  }

  handleAddNodes(nodes: BaseDataView[]) {
    this.endpointService.sendAddNodes(nodes.map(x => {
      const mappedRootNode: AvailableNormativeBaseType = {
        guid: x.guid,
        availabilityNodes: x.availableChilds ?? [],
        isAvailable: !!x.availability,
        isCancelled: x.isCancelled,
        type: BaseType.TSN_MGE,
        typeName: x.name,
      };
      return mappedRootNode;
    }));
  }

  handleRemoveNodes(nodes: BaseDataView[]) {
    this.endpointService.sendRemoveNodes(nodes.map(x => x.guid));
  }

  handleEditNodes(nodes: BaseDataView[]) {
    const rootNodes = nodes.filter(x => !!x.isRoot);
    const normoNodes = nodes.filter(x => !x.isRoot);

    this.endpointService.sendEditNodes(rootNodes.map(x => {
      const mappedRootNode: AvailableNormativeBaseType = x.data;
      
      mappedRootNode.availabilityNodes = x.availableChilds ?? [];
      mappedRootNode.isAvailable = !!x.availability;
      mappedRootNode.isCancelled = x.isCancelled;
      mappedRootNode.typeName = x.name;
      return mappedRootNode;
    }),
      normoNodes.map(x => {
        const mappedNormoNode: AvailableBaseAdditionInfo = x.data;
        mappedNormoNode.name = x.name;
        mappedNormoNode.isAvailable = !!x.availability;
        mappedNormoNode.isCancelled = x.isCancelled;
        return mappedNormoNode;
      }));
  }
}
