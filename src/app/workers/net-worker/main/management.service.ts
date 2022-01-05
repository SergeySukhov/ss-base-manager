import { Subject } from "rxjs";
import { NetWorkerRequest, NetMessageTypes, NetWorkerResponse, NetWorkerResponseAvailableBases, NetWorkerRequestAvailableBases, NetWorkerRequestUploadFormuls, NetWorkerResponseUploadFormuls, NetWorkerRequestUploadNormatives, NetWorkerResponseUploadNormatives, NetWorkerAddAvailableBases, NetWorkerEditAvailableBases, NetWorkerRemoveAvailableBases, NetWorkerResponseCommon, NetWorkerRequestAvailableBaseTypes, NetWorkerResponseAvailableBaseTypes } from "src/app/shared/models/net-messages/net-worker-messages";
import { AvailableBaseAdditionInfo } from "src/app/shared/models/server-models/AvailableBaseAdditionInfo";
import { AvailableNormativeBaseType } from "src/app/shared/models/server-models/AvailableNormativeBaseType";
import { ManagementSystemBase } from "src/app/shared/models/worker-models/management-system-base";
import { environment } from "src/environments/environment";
import { MessageHandler } from "../message-services/message-handler.service";

export class ManagementSystem extends ManagementSystemBase {
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
      case NetMessageTypes.getAvailableBaseTypes:
        this.sendRequestGetBasesTypes(request);
        break;
      case NetMessageTypes.sendFormulsUpload:
        this.sendUploadFormulas(request);
        break;
      case NetMessageTypes.sendNormativesUpload:
        this.sendUploadNormatives(request);
        break;
      case NetMessageTypes.managerAddNodes:
        this.sendManagerAddNodes(request);
        break;
      case NetMessageTypes.managerRemoveNodes:
        this.sendManagerRemoveNodes(request);
        break;
      case NetMessageTypes.managerEditNodes:
        this.sendManagerEditNodes(request);
        break;
    }
  }

  private async sendManagerAddNodes(request: NetWorkerAddAvailableBases) {

    const response: NetWorkerResponseCommon = {
      guid: request.guid,
      messageType: request.messageType,
    }
    const timeout = setTimeout(() => {
      this.messageHandler.toClient(response);
    }, 5000)
    const sentNodeGuids: string[] = request.data.rootNodes.map(x => x.guid);
    request.data.rootNodes.forEach(x => {
      const sub = this.managerAddNodeCommand(x);
      sub.subscribe(resp => {
        const idx = sentNodeGuids.findIndex(guid => guid === x.guid);
        if (idx > -1) sentNodeGuids.splice(idx, 1);
        if (!sentNodeGuids.length) {
          clearTimeout(timeout);
          this.messageHandler.toClient(response);
        }
      });
    });

  }

  managerAddNodeCommand(node: AvailableNormativeBaseType): Subject<boolean> {
    const resultSub = new Subject<boolean>();
    const data = JSON.stringify(node);
    console.log("!! | sendManagerAddNodes | data", data)
    const sender = new XMLHttpRequest();

    sender.withCredentials = false;
    sender.open("POST", environment.manager + "normativebasetype");

    sender.setRequestHeader('Access-Control-Allow-Origin', '*');
    sender.setRequestHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    sender.setRequestHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    sender.setRequestHeader("Content-Type", "application/json");
    sender.timeout = 5000;
    sender.onreadystatechange = async () => {
      if (sender.readyState == XMLHttpRequest.DONE && sender.response) {
        console.log("!! | sender.onreadystatechange= | sender", sender)
        if (sender.status === 200) {
          resultSub.next(true);
        } else {
          resultSub.next(false);
        }
        resultSub.complete();

      }
    }
    sender.send(data);
    return resultSub;
  }

  private async sendManagerRemoveNodes(request: NetWorkerRemoveAvailableBases) {
    console.log("!! | sendManagerRemoveNodes | request", request)
    const response: NetWorkerResponseCommon = {
      guid: request.guid,
      messageType: request.messageType,
    }

    const timeout = setTimeout(() => {
      this.messageHandler.toClient(response);
    }, 5000)

    const sentNodeGuids: string[] = request.data.guids;

    request.data.guids.forEach(x => {
      const sub = this.managerRemoveNodeCommand(x);
      sub.subscribe(resp => {
        const idx = sentNodeGuids.findIndex(guid => guid === x);
        if (idx > -1) sentNodeGuids.splice(idx, 1);
        if (!sentNodeGuids.length) {
          clearTimeout(timeout);
          this.messageHandler.toClient(response);
        }
      });
    });

  }

  managerRemoveNodeCommand(guid: string): Subject<boolean> {
    const resultSub = new Subject<boolean>();

    const sender = new XMLHttpRequest();

    sender.withCredentials = false;
    sender.open("Delete", environment.manager + "normativebasetype" + "/" + guid);

    sender.setRequestHeader('Access-Control-Allow-Origin', '*');
    sender.setRequestHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    sender.setRequestHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    sender.timeout = 5000;

    sender.onreadystatechange = async () => {
      if (sender.readyState == XMLHttpRequest.DONE && sender.response) {
        console.log("!! | sender.onreadystatechange= | sender", sender)
        if (sender.status === 200) {
          resultSub.next(true);
        } else {
          resultSub.next(false);
        }
        resultSub.complete();

      }
    }
    sender.send();
    return resultSub;
  }


  private async sendManagerEditNodes(request: NetWorkerEditAvailableBases) {

    const response: NetWorkerResponseCommon = {
      guid: request.guid,
      messageType: request.messageType,
    }

    const sentNodeGuids: string[] = request.data.rootNodes.map(x => x.guid);
    request.data.rootNodes.forEach(x => {
      const sub = this.managerEditRootNodeCommand(x);
      sub.subscribe(resp => {
        const idx = sentNodeGuids.findIndex(guid => guid === x.guid);
        if (idx > -1) sentNodeGuids.splice(idx, 1);
        if (!sentNodeGuids.length) {
          this.messageHandler.toClient(response);
        }
      });
    });
    sentNodeGuids.push(...request.data.normoNodes.map(x => x.guid));
    request.data.normoNodes.forEach(x => {
      const sub = this.managerEditNormoNodeCommand(x);
      sub.subscribe(resp => {
        const idx = sentNodeGuids.findIndex(guid => guid === x.guid);
        if (idx > -1) sentNodeGuids.splice(idx, 1);
        if (!sentNodeGuids.length) {
          this.messageHandler.toClient(response);
        }
      });
    });
  }

  managerEditRootNodeCommand(node: AvailableNormativeBaseType): Subject<boolean> {
    const resultSub = new Subject<boolean>();
    const data = JSON.stringify(node);
    const sender = new XMLHttpRequest();

    sender.withCredentials = false;
    sender.open("PUT", environment.manager + "normativebasetype");

    sender.setRequestHeader('Access-Control-Allow-Origin', '*');
    sender.setRequestHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    sender.setRequestHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    sender.setRequestHeader("Content-Type", "application/json");
    sender.timeout = 5000;

    sender.onreadystatechange = async () => {
      if (sender.readyState == XMLHttpRequest.DONE && sender.response) {
        if (sender.status === 200) {
          resultSub.next(true);
        } else {
          resultSub.next(false);
        }
        resultSub.complete();

      }
    }
    sender.send(data);
    return resultSub;
  }
  managerEditNormoNodeCommand(node: AvailableBaseAdditionInfo): Subject<boolean> {
    const resultSub = new Subject<boolean>();
    const data = JSON.stringify(node);
    const sender = new XMLHttpRequest();

    sender.withCredentials = false;
    sender.open("PUT", environment.manager + "additioninfo");

    sender.setRequestHeader('Access-Control-Allow-Origin', '*');
    sender.setRequestHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    sender.setRequestHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    sender.setRequestHeader("Content-Type", "application/json");
    sender.timeout = 5000;

    sender.onreadystatechange = async () => {
      if (sender.readyState == XMLHttpRequest.DONE && sender.response) {
        console.log("!! | sender.onreadystatechange= | sender", sender)
        if (sender.status === 200) {
          console.log("!! | sender.onreadystatechange= | OK", sender)
          resultSub.next(true);
        } else {
          resultSub.next(false);
        }
        resultSub.complete();
      }
    }
    sender.send(data);
    return resultSub;
  }

  private async sendRequestGetBasesTypes(request: NetWorkerRequestAvailableBaseTypes) {
    const sender = new XMLHttpRequest();
    const response: NetWorkerResponseAvailableBaseTypes = {
      guid: request.guid,
      messageType: NetMessageTypes.getAvailableBaseTypes,
      data: null
    }

    sender.withCredentials = false;

    sender.open("GET", environment.manager + "normativebasetype");
    sender.setRequestHeader('Access-Control-Allow-Origin', '*');
    sender.setRequestHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
    sender.setRequestHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
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

  private async sendRequestGetBases(request: NetWorkerRequestAvailableBases) {
    const sender = new XMLHttpRequest();
    const response: NetWorkerResponseAvailableBases = {
      guid: request.guid,
      messageType: NetMessageTypes.getAvailableNormoBases,
      data: null
    }

    sender.withCredentials = false;

    sender.open("GET", environment.manager + "additioninfo/normoBaseType?baseType=" + request.data.type);
    sender.setRequestHeader('Access-Control-Allow-Origin', '*');
    sender.setRequestHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
    sender.setRequestHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
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
    sender.open("POST", environment.formuls + "uploader");

    sender.setRequestHeader('Access-Control-Allow-Origin', '*');
    sender.setRequestHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    sender.setRequestHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
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
    const sender = new XMLHttpRequest();
    const response: NetWorkerResponseUploadNormatives = {
      guid: request.guid,
      messageType: request.messageType,
    }

    var data = new FormData();
    data.append("xmlFile", request.data.fileNormatives);
    data.append("normoGuid", request.data.normoGuid);
    data.append("type", request.data.normoGuid);
    data.append("deploy", "" + request.data.isDeploy);

    sender.withCredentials = false;
    sender.open("POST", environment.normo + "uploader");

    sender.setRequestHeader('Access-Control-Allow-Origin', '*');
    sender.setRequestHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    sender.setRequestHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    sender.timeout = 5000;

    sender.onreadystatechange = async () => {
      if (sender.readyState == XMLHttpRequest.DONE && sender.response) {
        if (sender.status === 200) {
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