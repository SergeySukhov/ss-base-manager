import { NetMessageTypes, NetWorkerRequest, NetWorkerResponse } from "src/app/shared/models/net-messages/net-worker-request";
import { MessageHandler } from "../message-services/message-handler.service";

export enum MessageTypes {
  Echo = "Echo",
}


export class ManagementSystem {

  constructor(private messageHandler: MessageHandler) {
  }

  protected async init() {
  }

  public async handleMessage(request: NetWorkerRequest) {
    switch (request.messageType) {
      case NetMessageTypes.init:
        this.sendRequest(MessageTypes.Echo, request);
        break;
    }
  }

  private sendRequest(requestName: MessageTypes, request: NetWorkerRequest) {
    const sender = new XMLHttpRequest();

    sender.open("POST", "http://localhost:5000/" + requestName, true);
    sender.setRequestHeader('Content-Type', 'application/json');

    sender.onreadystatechange = () => {
      if (sender.readyState == XMLHttpRequest.DONE && sender.status == 200) {
        const response: NetWorkerResponse = {
          guid: request.guid,
          data: sender.response,
          isError: false,
          messageType: request.messageType
        }
        this.messageHandler.toClient(response);
      }
    }
    sender.onerror = (e) => {
      console.error("!! error onreadystatechange", e)
    }

    sender.send(JSON.stringify({ CommandName: requestName, Data: JSON.stringify(request.data) }));
  }
}