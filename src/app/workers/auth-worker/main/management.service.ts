import { Token } from "@angular/compiler";
import { Subject } from "rxjs";
import { AuthWorkerResponse, AuthWorkerRequest } from "src/app/shared/models/auth-messages/auth-worker-messages";
import { NetWorkerRequest, NetMessageTypes, NetWorkerResponse } from "src/app/shared/models/net-messages/net-worker-request";
// import { AuthSystemService } from "../auth-system/auth-system.service";
// import { TokenService } from "../auth-system/token.service";
import { MessageHandler } from "../message-services/message-handler.service";

/** Система верхнего уровня воркера. Принимает сообщения, перенаправляет их, инициализирует системы */
export class ManagementSystem {

  // /** Сервис для работы с токенами */
  // public tokenService: TokenService;

  // /** Система авторизации */
  // private authSystem: AuthSystemService;
  /** Узел для получения токена */
  private urlGetToken: string = "";
  /** Последний полученный токен авторизации */
  private lastUpdatedToken: Token | undefined;

  /** Кто то уже запросил получение токена, одновременно несколько запросов на сервер идти не должно, это вызывает ошибки */
  private tokenRequestInProcess: boolean = false;

  /** Событие о том что пришел новый токен с Auth */
  private tokenReceived: Subject<AuthWorkerResponse> = new Subject<AuthWorkerResponse>();

  constructor(private messageHandler: MessageHandler) {
    // this.tokenService = new TokenService();
    // this.authSystem = new AuthSystemService(messageHandler, this.tokenService);
    const IdentityUrl = "http://localhost:63654" + "/identity";

    this.urlGetToken = IdentityUrl + "/token";

    // /** Подписка на сообщения. Диспетчеризация сообщений */
    // messageExchanger.messageReceived.subscribe(async (request: AuthWorkerRequest) => {
    //   // ожидание инициализации воркера
    //   await this.checkInit(request.type);

    //   // Передача сообщения конкретному обработчику
    //   switch (request.type) {
    //     case WorkerServiceMessageType.authorize:
    //       const authResponse: AuthWorkerResponse = await this.authSystem.login(request.data.login, request.data.password, request.data.isHash);
    //       authResponse.messageId = request.messageId;
    //       this.messageExchanger.send(authResponse);
    //       break;
    //     default:
    //       throw new Error("Не задан обработчик для сообщения с типом " + request.type);
    //   }
    // });
  }

  public async handleMessage(request: NetWorkerRequest) {
        this.sendRequest(request);
        switch (request.messageType) {
      // case NetMessageTypes.init:
      //   this.sendRequest(request);
      //   break;
    }
  }

  // ================================================================================================================================
  //                                                  PRIVATE METHODS
  // ================================================================================================================================

  private async sendRequest(request: AuthWorkerRequest) {
    console.log("!! | sendRequest | request", request)
    const sender = new XMLHttpRequest();
    const searchParams = new URLSearchParams();
    searchParams.append("username", request.data.username);
    searchParams.append("password", request.data.password);
    searchParams.append("grant_type", "password");
    // searchParams.append("grant_type", isHash ? "hash" : "password");
    searchParams.append("scope", "offline_access");

    const requestBody = searchParams.toString().replace("&", ",");
    console.log("!! | sendRequest | requestBody", requestBody)

    sender.open("POST", this.urlGetToken, true);
    sender.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    // sender.withCredentials = 
    // { "Content-Type": "application/x-www-form-urlencoded" }
    sender.onreadystatechange = () => {
        console.log("!! sender resp", sender.response);
        if (sender.readyState == XMLHttpRequest.DONE && sender.status == 200) {
        // this.messageHandler.toClient(response);
      }
    }
    sender.onerror = (e) => {
      console.error("!! error onreadystatechange", e)
    }

    sender.send(JSON.stringify(requestBody));
  }
}
