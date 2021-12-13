import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NetWorkerService } from './services/net-worker.service';
import { AuthWorkerService } from "./services/auth-worker.service";

@NgModule({
  declarations: [
  ],
  exports: [
  ],
  imports: [
    CommonModule,
  ],
  providers: [
    AuthWorkerService,
    NetWorkerService
  ]
})
export class WorkerModule { }
