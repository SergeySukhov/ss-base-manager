import { NetWorkerRequest, NetMessageTypes, NetWorkerResponse, NetWorkerResponseAvailableBases, NetWorkerRequestAvailableBases, NetWorkerRequestUploadFormuls, NetWorkerResponseUploadFormuls } from "src/app/shared/models/net-messages/net-worker-messages";
import { ManagementSystemBase } from "src/app/shared/models/worker-models/management-system-base";
import { MessageHandler } from "../message-services/message-handler.service";

export class ManagementSystem extends ManagementSystemBase {
  serverUrl = "http://localhost:5000/additioninfo"
  constructor(private messageHandler: MessageHandler) {
    super();
  }

  public async handleMessage(request: NetWorkerRequest) {
    switch (request.messageType) {
      case NetMessageTypes.init:
        this.replySuccess(request.guid, request.messageType);
        break;
      case NetMessageTypes.getAvailableNormoBases:
        this.sendRequestTest(request);
        break;
      case NetMessageTypes.sendFormulsUpload:
        this.sendUploadTest(request);
        break;
    }
  }

  private async sendRequestTest(request: NetWorkerRequestAvailableBases) {
    console.log("!! | sendRequestTest | request", request)
    const sender = new XMLHttpRequest();
    const response: NetWorkerResponseAvailableBases = {
      guid: request.guid,
      messageType: NetMessageTypes.getAvailableNormoBases,
      data: undefined
    }

    sender.withCredentials = false;
    const requestBody = ``;

    sender.open("GET", this.serverUrl);
    sender.setRequestHeader('Access-Control-Allow-Origin', '*');
    sender.setRequestHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
    sender.setRequestHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
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

  private async sendUploadTest(request: NetWorkerRequestUploadFormuls) {
    console.log("!! | sendRequestTest | request", request)

    const sender = new XMLHttpRequest();
    const response: NetWorkerResponseUploadFormuls = {
      guid: request.guid,
      messageType: NetMessageTypes.sendFormulsUpload,
    }

    var data = new FormData();
    data.append("nrSpCsv", request.data.file);
    data.append("addonNumber", "" + request.data.addonNumber);
    data.append("normoGuid", request.data.normoGuid);

    sender.withCredentials = false;

    sender.setRequestHeader('Access-Control-Allow-Origin', '*');
    sender.setRequestHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    sender.setRequestHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    sender.setRequestHeader('Content-Type', 'multipart/form-data');
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
    sender.open("POST", "http://localhost:5000/uploader");
    sender.send(data);
  }

  private setSenderHandlers(sender: XMLHttpRequest, response: NetWorkerResponse) {
    sender.ontimeout = () => {
      this.errorHandler(response)
      sender.abort();
    }
    sender.onerror = (e) => {
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