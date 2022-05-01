import { DatePipe, KeyValue } from "@angular/common";
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { NotificationUploadProcessInfo, UploadProcessState } from "src/app/core/common/models/notification.models";
import { ProcStatePipe } from "src/app/core/pipes/proc-state.pipe";

interface MatBarState {
  mode: "indeterminate" | "determinate",
  value: number,
  newClass: string;
}

@Component({
  selector: 'ss-upload-process-card',
  templateUrl: './upload-process-card.component.html',
  styleUrls: ['./upload-process-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploadProcessCardComponent implements OnInit {

  @Input() data: NotificationUploadProcessInfo | null = null;

  get procId() {
    return "ID процесса: " + this.data?.requestGuid.substring(0, 8) ?? "-";
  }

  get procStateText() {
    return "Состояние процесса: " + this.procPipe.transform(this.data?.state) ?? "-";
  }

  get procStateForBar(): MatBarState {
    const barState: MatBarState = { mode: "indeterminate", value: 100, newClass: "" };
    if (this.data) {
      switch (this.data.state) {
        case UploadProcessState.deploying:
        case UploadProcessState.processing:
          barState.mode = "indeterminate";

          break;
        case UploadProcessState.inited:
        case UploadProcessState.error:
        case UploadProcessState.success:
          barState.mode = "determinate";
          barState.value = this.data.state === UploadProcessState.inited ? 0 : 100;
          break;
      }
      if (this.data.state === UploadProcessState.success) {
        barState.newClass = "successEnd";
      }
      if (this.data.state === UploadProcessState.error) {
        barState.newClass = "errorEnd";
      }
    }
    return barState;
  }

  get procInfoRows(): KeyValue<string, string>[] {
    const infos: KeyValue<string, string>[] = [];
    infos.push({
      key: "Имя базы",
      value: this.data?.baseName ?? "-"
    });
    infos.push({
      key: "Дата создания",
      value: this.datePipe.transform(this.data?.creationTime, "dd.MM | HH:mm:ss") ?? "-"
    });
    infos.push({
      key: "Дата обновления",
      value: this.datePipe.transform(this.data?.lastUpdateTime, "dd.MM | HH:mm:ss") ?? "-"
    });
    infos.push({
      key: "Описание",
      value: this.data?.description ?? "-"
    });
    return infos;
  }



  constructor(private procPipe: ProcStatePipe, private datePipe: DatePipe) { }

  ngOnInit(): void {
  }

}
