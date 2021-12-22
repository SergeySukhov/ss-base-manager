import { NetWorkerRequest, NetMessageTypes, NetWorkerResponse, NetWorkerResponseTest, NetWorkerRequestTest } from "src/app/shared/models/net-messages/net-worker-messages";
import { ManagementSystemBase } from "src/app/shared/models/worker-models/management-system-base";
import { MessageHandler } from "../message-services/message-handler.service";

export class ManagementSystem extends ManagementSystemBase {
  serverUrl = "http://localhost:5002/additioninfo"
  constructor(private messageHandler: MessageHandler) {
    super();
  }

  public async handleMessage(request: NetWorkerRequest) {
    switch (request.messageType) {
      case NetMessageTypes.init:
        this.replySuccess(request.guid, request.messageType);
        break;
      case NetMessageTypes.serverTest:
        this.sendRequestTest(request);
        break;
    }
  }

  private async sendRequestTest(request: NetWorkerRequestTest) {
    console.log("!! | sendRequestTest | request", request)
    const sender = new XMLHttpRequest();
    const response: NetWorkerResponseTest = {
      guid: request.guid,
      messageType: NetMessageTypes.serverTest,
      data: undefined
    }

    sender.withCredentials = false;
    const requestBody = ``;

    sender.open("GET", this.serverUrl);
    sender.setRequestHeader('Access-Control-Allow-Origin', '*/*');
    console.log("!! | sendRequestTest | sender", sender)
    sender.timeout = 5000;

    sender.onreadystatechange = async () => {
      if (sender.readyState == XMLHttpRequest.DONE && sender.response) {
        if (sender.status === 200) {
          const senderObj = JSON.parse(sender.response);
          console.log("!! | sender.onreadystatechange= | senderObj", senderObj)

          // this.messageHandler.toClient(response);
        } else {
          this.errorHandler(response);
        }
      }
    }
    this.setSenderHandlers(sender, response);
    sender.send();
  }


  private setSenderHandlers(sender: XMLHttpRequest, response: NetWorkerResponse) {
    sender.ontimeout = () => {
      this.errorHandler(response)
      sender.abort();
    }
    sender.onerror = (e) => {
    console.log("!! | setSenderHandlers | sender", sender)
    console.log("!! | setSenderHandlers | e", e)
      this.errorHandler(response)
    }
  }

  private errorHandler(response: NetWorkerResponse, errMesage?: string) {
    response.data = {
      isSuccess: false,
      errorDescription: errMesage ?? "Нет доступа к сервисам"
    }
    this.messageHandler.toClient(response);
  }

  private replySuccess(guid: string | undefined, messageType: NetMessageTypes.init) {
    this.messageHandler.toClient({
      guid,
      messageType,
    });
  }
}