import { Component, OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { LocalStorageConst, LocalStorageService } from 'src/app/core/services/local-storage.service';
import { IndeciesCommonNodes, IndeciesDataViewNode, IndeciesDataViewRoot } from 'src/app/secondary-module/table-indecies-control/table-indecies-control.component';
import { NormoBaseDataView, NormoDataViewNode, NormoDataViewRoot } from 'src/app/secondary-module/table-normo-control/table-normo-control.component';
import { CommonNodes, DataViewNode, DataViewRoot } from 'src/app/shared/common-components/table-control-base/table-control-base';
import { AvailableBaseAdditionInfo } from 'src/app/shared/models/server-models/AvailableBaseAdditionInfo';
import { AvailableBaseIndexInfo } from 'src/app/shared/models/server-models/AvailableBaseIndexInfo';
import { AvailabilityNodes, AvailableNormativeBaseType, BaseType } from 'src/app/shared/models/server-models/AvailableNormativeBaseType';
import { AvailabilityBaseEndpointService } from './services/availability-base.endpoint.service';
import { BaseAvailabilityViewService } from './services/base-availability-view.service';

@Component({
  selector: 'ss-base-availability-manager',
  templateUrl: './base-availability-manager.component.html',
  styleUrls: ['./base-availability-manager.component.scss'],
  providers: [
    AvailabilityBaseEndpointService,
    BaseAvailabilityViewService,
  ]
})
export class BaseAvailabilityManagerComponent implements OnInit {

  isLoading = false;
  normativeData: NormoBaseDataView[] = [];
  indeciesData: IndeciesCommonNodes[] = [];

  /** Обновление внутренних данных узла при добавлении */
  updAddingRoot: DataViewRoot | null = null;

  lastTab: number = 0;

  constructor(private viewService: BaseAvailabilityViewService, private storageService: LocalStorageService) {
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

  handleAddRootNodes(nodes: { viewData: DataViewRoot, type: BaseType }[]) {
    const updNodes = this.viewService.addRootNodes(nodes);
    updNodes.forEach(node => {
      this.updAddingRoot = node;
    })
  }

  handleRemoveNodes(nodes: CommonNodes[]) {
    this.viewService.removeNodes(nodes);
  }

  isRootNode(node: CommonNodes): node is DataViewRoot {
    return node.isRoot;
  } 

  handleEditRootAndNormoNodes(nodes: NormoBaseDataView[]) {
    const rootNodes: NormoDataViewRoot[] = [];
    const normoNodes: NormoDataViewNode[] = [];

    nodes.forEach(x => {
      if (this.isRootNode(x)) {
        rootNodes.push(x);
      } else {
        normoNodes.push(x);
      }
    })

    this.viewService.editRootNodes(rootNodes);
    this.viewService.editNormoNodes(normoNodes);
  }

  handleEditRootAndIndeciesNodes(nodes: IndeciesCommonNodes[]) {
    const rootNodes: IndeciesDataViewRoot[] = [];
    const indeciesNodes: IndeciesDataViewNode[] = [];

    nodes.forEach(x => {
      if (this.isRootNode(x)) {
        rootNodes.push(x);
      } else {
        indeciesNodes.push(x);
      }
    })

    this.viewService.editRootNodes(rootNodes);
    this.viewService.editIndeciesNodes(indeciesNodes);
  }

  private async loadIndeciesData() {
    const allAvTypes = await this.viewService.loadAvailableBaseTypes();
    if (!allAvTypes.length) {
      this.isLoading = false;
      return;
    }

    const availableIndexBases: AvailableBaseIndexInfo[] = await this.viewService.loadIndeciesData(allAvTypes);
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
      const basesByType = availableIndexBases.filter(x => x.type === baseTypeInfo.type);
      rootNode.hasChildren = !!basesByType.length;

      for (let indecyDataBaseInfo of basesByType) {
        viewBaseModel.push({
          guid: indecyDataBaseInfo.guid,
          availability: indecyDataBaseInfo.isAvailable,
          name: {
            value: "" + indecyDataBaseInfo.releasePeriodValue,
            periodType: indecyDataBaseInfo.releasePeriodType,
            year: indecyDataBaseInfo.year,
            workCategory: indecyDataBaseInfo.parentIndex.workCategory
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
    const allAvTypes = await this.viewService.loadAvailableBaseTypes();
    if (!allAvTypes.length) {
      this.isLoading = false;
      return;
    }

    const availableBases = await this.viewService.loadAdditionalData(allAvTypes);
    const viewBaseModel: NormoBaseDataView[] = [];

    for (let baseTypeInfo of allAvTypes) {
      const rootNode: NormoBaseDataView = {
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
          isRoot: false,
          data: normoDataBaseInfo,
          parentGuid: baseTypeInfo.guid,
        });
      }
    }
    this.normativeData = viewBaseModel;
  }
}
