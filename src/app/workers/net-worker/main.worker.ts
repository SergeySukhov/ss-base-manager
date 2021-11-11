/// <reference lib="webworker" />

import { MessageHandler } from "./message-services/message-handler.service";

const messageHandler = new MessageHandler(self)

addEventListener('message', ({ data }) => {
  messageHandler.toWorker(data);
});
