import { NetMessageTypes, NetWorkerRequest, NetWorkerResponse } from "src/app/shared/models/net-messages/net-worker-request";
import { MessageHandler } from "../message-services/message-handler.service";

export enum CommandNames {
  Echo = "Echo",
}

export enum RequestName {
  Echo = "Echo",
}

export class ManagementSystem {

  constructor(private messageHandler: MessageHandler) {
  }

  protected async init() {
  }

  public async handleCommand(request: NetWorkerRequest) {
    switch (request.messageType) {
      case NetMessageTypes.init:
        break;
    }
  }

  public async handleRequest(request: NetWorkerRequest) {
    switch (request.messageType) {
      case NetMessageTypes.init:
        this.sendRequest(RequestName.Echo, request);
        break;
    }
  }

  private sendRequest(requestName: RequestName, request: NetWorkerRequest) {
    console.log("!! | file: management.service.ts | request", request)
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