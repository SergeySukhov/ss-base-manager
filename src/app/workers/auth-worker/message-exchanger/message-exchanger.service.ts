import { Subject } from "rxjs/internal/Subject";
import { AuthWorkerRequest } from "../../../app/shared/modules/CoreModule/models/worker-messages/worker-request";
import { AuthWorkerResponse } from "../../../app/shared/modules/CoreModule/models/worker-messages/worker-response";
import { ManagementSystem } from "../management-system/management-system.service";
import { WorkerMessagingSystem } from "../../shared/messaging-system/messaging-system.service";

/** Система обмена сообщениями между воркерами и клиентом */
export class MessageExchanger extends WorkerMessagingSystem<AuthWorkerResponse> {
  readonly messageResponse = new Subject<AuthWorkerResponse>();

  constructor(protected worker: any) {
    super(worker);

    new ManagementSystem(this);
  }

  // Сообщения с клиента на воркер
  public fromClient(event: AuthWorkerRequest) {
    this.analyseMessage(event);
  }
}
