import { Component } from '@angular/core';
import { Message, MessageService } from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';
import { AuthWorkerService } from "./shared/workers-module/services/auth-worker.service";
import { NetWorkerService } from './shared/workers-module/services/net-worker.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],

})
export class AppComponent {
  title = 'ss-base-manager';

  constructor(netWorkerService: NetWorkerService, authWorkerService: AuthWorkerService,
  ) {

    const authWorker = new Worker(new URL('./workers/auth-worker/main.worker', import.meta.url), { type: 'module' });
    authWorkerService.setupWorker(authWorker);

    const worker = new Worker(new URL('./workers/net-worker/main.worker', import.meta.url), { type: 'module' });
    netWorkerService.setupWorker(worker);
  }
}
