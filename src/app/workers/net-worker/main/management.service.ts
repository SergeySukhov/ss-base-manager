import { Subject } from "rxjs";
import { ImoprtanceLevel, NotificationType } from "src/app/core/common/models/notification.models";
import { NWRequest, NetMessageTypes, NWResponse, NWResponseAvailableBases, NWRequestAvailableBases, NWRequestUploadFormuls, NWResponseUploadFormuls, NWRequestUploadNormatives, NWResponseUploadNormatives, NWAddAvailableBases, NWEditAvailableBases, NWRemoveAvailableBases, NWResponseCommon, NWRequestAvailableBaseTypes, NWResponseAvailableBaseTypes, NetSubTypes, NWInitSubBase, NWRequestSub, NWSubMessage, NWRequestNotificationSub, NWRequestAvailableIndeciesBases, NWResponseAvailableIndeciesBases, NWRequestUploadIndecies, NWResponseUploadIndecies } from "src/app/shared/models/net-messages/net-worker-messages";
import { AvailableBaseAdditionInfo } from "src/app/shared/models/server-models/AvailableBaseAdditionInfo";
import { AvailableNormativeBaseType } from "src/app/shared/models/server-models/AvailableNormativeBaseType";
import { ManagementSystemBase } from "src/app/shared/models/worker-models/management-system-base";
import { environment } from "src/environments/environment";
import { v4 } from "uuid";
import { MessageHandler } from "../message-services/message-handler.service";
import { HubConnectionService } from "./hub-connection.service";

export class ManagementSystem extends ManagementSystemBase {
  private netWorkerEvents = new Subject<{ message: string, type: NotificationType, importance: ImoprtanceLevel }>();
  private hubService = new HubConnectionService(this.messageHandler, this.netWorkerEvents);


  constructor(private messageHandler: MessageHandler) {
    super();
    this.hubService.initHub();
  }


  public async handleMessage(request: NWRequest | NWRequestSub) {
    if (request.isSub) {
      switch (request.messageType) {
        case NetSubTypes.notificationSub:
          this.hubService.createNotificationSub(request);
          this.createWorkerNotificationSub(request);
          this.netWorkerEvents.next({ message: "Воркер инициализирован", type: NotificationType.info, importance: ImoprtanceLevel.low });
          break;
        case NetSubTypes.closeAllSubs:
          this.netWorkerEvents.complete();
          break;
      }
    } else {
      switch (request.messageType) {
        case NetMessageTypes.init:
          this.replySuccess(request.guid, request.messageType);
          break;
        case NetMessageTypes.getAvailableNormoBases:
          this.sendRequestGetBases(request);
          break;
        case NetMessageTypes.getAvailableIndeciesBases:
          this.sendRequestGetIndeciesBases(request);
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
        case NetMessageTypes.sendIndeciesUpload:
          this.sendUploadIndecies(request);
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

  }

  private createWorkerNotificationSub(initSubRequest: NWRequestNotificationSub) {
    this.netWorkerEvents.subscribe(x => {
      const netSubMessage: NWSubMessage = {
        guid: initSubRequest.guid,
        messageType: initSubRequest.messageType,
        isSub: true,
        data: {
          message: {
            guid: v4(),
            fromService: "Воркер клиента",
            imoprtance: x.importance,
            type: x.type,
            message: x.message,
            timeStamp: Date.now().toString()
          }
        },
      }
      this.messageHandler.toClient(netSubMessage);
    });

  }

  private async sendManagerAddNodes(request: NWAddAvailableBases) {

    const response: NWResponseCommon = {
      guid: request.guid,
      messageType: request.messageType,
      isSub: false,
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

  private async sendManagerEditNodes(request: NWEditAvailableBases) {

    const response: NWResponseCommon = {
      guid: request.guid,
      messageType: request.messageType,
      isSub: false,
    }

    const sentNodeGuids: string[] = request.data.rootNodes?.map(x => x.guid) ?? [];
    request.data.rootNodes?.forEach(x => {
      const sub = this.managerEditRootNodeCommand(x);
      sub.subscribe(resp => {
        const idx = sentNodeGuids.findIndex(guid => guid === x.guid);
        if (idx > -1) sentNodeGuids.splice(idx, 1);
        if (!sentNodeGuids.length) {
          this.messageHandler.toClient(response);
        }
      });
    });
    if (request.data.normoNodes) {
      sentNodeGuids.push(...request.data.normoNodes.map(x => x.guid));
      request.data.normoNodes?.forEach(x => {
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
  }

  private async sendManagerRemoveNodes(request: NWRemoveAvailableBases) {
    const response: NWResponseCommon = {
      guid: request.guid,
      messageType: request.messageType,
      isSub: false,
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

  private async sendRequestGetBasesTypes(request: NWRequestAvailableBaseTypes) {
    const sender = new XMLHttpRequest();
    const response: NWResponseAvailableBaseTypes = {
      guid: request.guid,
      messageType: NetMessageTypes.getAvailableBaseTypes,
      isSub: false,
      data: null,
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

  private async sendRequestGetBases(request: NWRequestAvailableBases) {
    const sender = new XMLHttpRequest();
    const response: NWResponseAvailableBases = {
      guid: request.guid,
      messageType: NetMessageTypes.getAvailableNormoBases,
      isSub: false,
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

  private async sendRequestGetIndeciesBases(request: NWRequestAvailableIndeciesBases) {
    const sender = new XMLHttpRequest();
    const response: NWResponseAvailableIndeciesBases = {
      guid: request.guid,
      messageType: NetMessageTypes.getAvailableIndeciesBases,
      isSub: false,
      data: null
    }

    sender.withCredentials = false;

    // sender.open("GET", environment.manager + "indexinfo/normoBaseType?baseType=" + request.data.type);
    // TODO: является ли новой
    sender.open("GET", environment.manager + "indexinfo");
    sender.setRequestHeader('Access-Control-Allow-Origin', '*');
    sender.setRequestHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
    sender.setRequestHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
    sender.timeout = 5000;

    sender.onreadystatechange = async () => {
      if (sender.readyState == XMLHttpRequest.DONE && sender.response) {
        if (sender.status === 200) {
          const senderObj = JSON.parse(sender.response);
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

  private async sendUploadFormulas(request: NWRequestUploadFormuls) {

    const sender = new XMLHttpRequest();
    const response: NWResponseUploadFormuls = {
      guid: request.guid,
      messageType: request.messageType,
      isSub: false,
    }

    let data = new FormData();
    data.append("SourceFile", request.data.file);
    data.append("AdditionNumber", "" + request.data.addonNumber);
    data.append("Guid", request.data.normoGuid);
    data.append("Deploy", "" + request.data.isDeploy);
    data.append("ContextId", this.hubService.connectionId ?? "");
    data.append("IsNewDatabase", "" + !!request.data.isAdd);
    data.append("Type", "" + request.data.baseType);

    sender.withCredentials = false;
    sender.open("POST", environment.formuls + "uploader");

    sender.setRequestHeader('Access-Control-Allow-Origin', '*');
    sender.setRequestHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    sender.setRequestHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    sender.timeout = 5000;

    sender.onreadystatechange = async () => {
      if (sender.readyState == XMLHttpRequest.DONE) {
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

  private async sendUploadNormatives(request: NWRequestUploadNormatives) {
    const sender = new XMLHttpRequest();
    const response: NWResponseUploadNormatives = {
      guid: request.guid,
      messageType: request.messageType,
      isSub: false,
    }

    var data = new FormData();
    data.append("xmlFile", request.data.fileNormatives);
    data.append("normoGuid", request.data.normoGuid);
    data.append("type", request.data.normoGuid);
    data.append("deploy", "" + request.data.isDeploy);
    data.append("ContextId", this.hubService.connectionId ?? "");
    data.append("IsNewDatabase", "" + !!request.data.addBase);
    data.append("Type", "" + request.data.baseType);

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

  private async sendUploadIndecies(request: NWRequestUploadIndecies) {
    const sender = new XMLHttpRequest();
    const response: NWResponseUploadIndecies = {
      guid: request.guid,
      messageType: request.messageType,
      isSub: false,
    }

    var data = new FormData();
    data.append("xmlFile", request.data.file);
    data.append("normoGuid", request.data.normoGuid);
    data.append("type", request.data.normoGuid);
    data.append("deploy", "" + request.data.isDeploy);
    data.append("ContextId", this.hubService.connectionId ?? "");
    data.append("IsNewDatabase", "" + !!request.data.addBase);
    data.append("Type", "" + request.data.baseType);

    sender.withCredentials = false;
    sender.open("POST", environment.indecies + "uploader");

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

  private setSenderHandlers(sender: XMLHttpRequest, response: NWResponse) {
    sender.ontimeout = () => {
      this.errorHandler(response)
      sender.abort();
    }
    sender.onerror = (e) => {
      this.errorHandler(response)
    }
  }

  private errorHandler(response: NWResponse, errMesage?: string) {
    response.data = {
      isSuccess: false,
      errorDescription: errMesage ?? "Нет доступа к сервисам"
    }
    this.netWorkerEvents.next({ message: "При выполнении операции возникла ошибка", importance: ImoprtanceLevel.high, type: NotificationType.warn })
    this.messageHandler.toClient(response);
  }

  private replySuccess(guid: string | undefined, messageType: NetMessageTypes.init) {
    this.messageHandler.toClient({
      guid,
      messageType,
      isSub: false,
    });
  }

  private managerAddNodeCommand(node: AvailableNormativeBaseType): Subject<boolean> {
    const resultSub = new Subject<boolean>();
    const data = JSON.stringify(node);
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
  private managerRemoveNodeCommand(guid: string): Subject<boolean> {
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
  private managerEditRootNodeCommand(node: AvailableNormativeBaseType): Subject<boolean> {
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
  private managerEditNormoNodeCommand(node: AvailableBaseAdditionInfo): Subject<boolean> {
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

}