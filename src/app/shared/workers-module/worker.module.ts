import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NetWorkerService } from './services/net-worker.service';

@NgModule({
  declarations: [
  ],
  exports: [
  ],
  imports: [
    CommonModule,
  ],
  providers: [
    NetWorkerService
  ]
})
export class WorkerModule { }
