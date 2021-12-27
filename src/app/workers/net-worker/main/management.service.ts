import { NetWorkerRequest, NetMessageTypes, NetWorkerResponse, NetWorkerResponseAvailableBases, NetWorkerRequestAvailableBases, NetWorkerRequestUploadFormuls, NetWorkerResponseUploadFormuls, NetWorkerRequestUploadNormatives, NetWorkerResponseUploadNormatives } from "src/app/shared/models/net-messages/net-worker-messages";
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
        this.sendRequestGetBases(request);
        break;
      case NetMessageTypes.sendFormulsUpload:
        this.sendUploadFormulas(request);
        break;
      case NetMessageTypes.sendNormativesUpload:
        this.sendUploadNormatives(request);
        break;
    }
  }

  private async sendRequestGetBases(request: NetWorkerRequestAvailableBases) {
    const sender = new XMLHttpRequest();
    const response: NetWorkerResponseAvailableBases = {
      guid: request.guid,
      messageType: NetMessageTypes.getAvailableNormoBases,
      data: null
    }

    sender.withCredentials = false;

    sender.open("GET", "http://localhost:5001");
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
          response.data = senderObj;
          this.messageHandler.toClient(response);
        } else {
          this.errorHandler(response);
        }
      }
    }
    this.setSenderHandlers(sender, response);
    sender.send();
  }

  private async sendUploadFormulas(request: NetWorkerRequestUploadFormuls) {
    console.log("!! | sendRequestTest | request", request)

    const sender = new XMLHttpRequest();
    const response: NetWorkerResponseUploadFormuls = {
      guid: request.guid,
      messageType: request.messageType,
    }

    var data = new FormData();
    data.append("nrSpCsv", request.data.file);
    data.append("addonNumber", "" + request.data.addonNumber);
    data.append("normoGuid", request.data.normoGuid);
    data.append("deploy", "" + request.data.isDeploy);

    sender.withCredentials = false;
    sender.open("POST", "http://localhost:5002/uploader");

    sender.setRequestHeader('Access-Control-Allow-Origin', '*');
    sender.setRequestHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    sender.setRequestHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    console.log("!! | sendRequestTest | sender", sender)
    sender.timeout = 5000;

    sender.onreadystatechange = async () => {
      console.log("!! | sender.onreadystatechange= | sender", sender)
      console.log("!! | sender.onreadystatechange= | sender.status", sender.status)
      if (sender.readyState == XMLHttpRequest.DONE && sender.response) {
        if (sender.status === 200) {
          const senderObj = JSON.parse(sender.response);
          console.log("!! | sender.onreadystatechange= | senderObj", senderObj)

          this.messageHandler.toClient(response);
        } else {
          this.errorHandler(response);
        }
      }
    }

    this.setSenderHandlers(sender, response);
    sender.send(data);
  }

  private async sendUploadNormatives(request: NetWorkerRequestUploadNormatives) {
    console.log("!! | sendRequestTest | request", request)
    
    const sender = new XMLHttpRequest();
    const response: NetWorkerResponseUploadNormatives = {
      guid: request.guid,
      messageType: request.messageType,
    }
    this.messageHandler.toClient(response);
    return;
    var data = new FormData();
    data.append("xmlFile", request.data.fileNormatives);
    data.append("normoGuid", request.data.normoGuid);
    data.append("type", request.data.normoGuid);
    data.append("deploy", "" + request.data.isDeploy);

    sender.withCredentials = false;
    sender.open("GET", "http://localhost:5000/uploader");

    sender.setRequestHeader('Access-Control-Allow-Origin', '*');
    sender.setRequestHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    sender.setRequestHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    console.log("!! | sendRequestTest | sender", sender)
    sender.timeout = 5000;

    sender.onreadystatechange = async () => {
      if (sender.readyState == XMLHttpRequest.DONE && sender.response) {
        if (sender.status === 200) {
          const senderObj = JSON.parse(sender.response);
          console.log("!! | sender.onreadystatechange= | senderObj", senderObj)

          this.messageHandler.toClient(response);
        } else {
          this.errorHandler(response);
        }
      }
    }

    this.setSenderHandlers(sender, response);
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