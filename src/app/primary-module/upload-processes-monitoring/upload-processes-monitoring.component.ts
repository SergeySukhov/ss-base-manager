import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, Renderer2 } from '@angular/core';
import { NotificationUploadProcessInfo } from "src/app/core/common/models/notification.models";
import { UploadProcessesMonitoringEndpoint } from "./services/upload-processes-monitoring-endpoint.service";

enum ProcSort {
  state,
  createDate,
  lastUpdate,
}

@Component({
  selector: 'ss-upload-processes-monitoring',
  templateUrl: './upload-processes-monitoring.component.html',
  styleUrls: ['./upload-processes-monitoring.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploadProcessesMonitoringComponent implements OnInit {

  public get sortViewData(): string {
    switch (this.pSortState) {
      case ProcSort.state:
        return "Состояние";
      case ProcSort.createDate:
        return "Дата создания";
      case ProcSort.lastUpdate:
        return "Дата обновления";
    }
  }
  public allProcesses: NotificationUploadProcessInfo[] = [];

  private pSortState = ProcSort.createDate;


  constructor(private endpointService: UploadProcessesMonitoringEndpoint, private changeDetector: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.endpointService.getAllUploadProcess().then(processes => {
      const actualProcesses = processes?.filter(x => !!x?.requestGuid)
      if (actualProcesses?.length) {
        this.allProcesses.push(...actualProcesses);
        this.sortProcCard();
        this.changeDetector.markForCheck();
      }
    });

    this.endpointService.uploadProcessInfoSub.subscribe(updProcess => {
      if (!updProcess?.requestGuid) return;
      const processIndex = this.allProcesses.findIndex(x => x.requestGuid === updProcess.requestGuid)
      if (processIndex > -1) {
        this.allProcesses.splice(processIndex);
      }
      this.allProcesses.push(updProcess);

      this.sortProcCard();
      this.changeDetector.markForCheck();
    });
  }

  onSortChange() {
    this.pSortState += 1;
    if (this.pSortState > 2) this.pSortState = 0;
    this.sortProcCard();
    this.changeDetector.markForCheck();
  }

  private sortProcCard() {
    switch (this.pSortState) {
      case ProcSort.state:
        this.allProcesses.sort((a, b) => {
          return a.state - b.state;
        });
        break;
      case ProcSort.createDate:
        this.allProcesses.sort((a, b) => {
          return a.creationTime.localeCompare(b.creationTime);
        });
        break;
      case ProcSort.lastUpdate:
        this.allProcesses.sort((a, b) => {
          return a.lastUpdateTime.localeCompare(b.lastUpdateTime);
        });
        break;
    }
  }
}
