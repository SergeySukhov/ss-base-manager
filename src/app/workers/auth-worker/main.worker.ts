// Необходимо для логирования
import "reflect-metadata";

import { MessageExchanger } from "./message-services/message-exchanger.service";

const messageExchanger = new MessageExchanger(self);

addEventListener("message", ($event: MessageEvent) => {
  messageExchanger.fromClient($event.data);
});
