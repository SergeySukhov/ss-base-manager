import { Component } from '@angular/core';
import { NetWorkerService } from './shared/workers-module/services/net-worker.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ss-base-manager';

  constructor(netWorkerService: NetWorkerService) {
    const worker = new Worker('./workers/net-worker/main.worker', { type: 'module' });
    netWorkerService.setupWorker(worker);
  }
}
