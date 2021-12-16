import { Token } from "@angular/compiler";
import { Subject } from "rxjs";
import { AuthWorkerResponse, AuthWorkerRequestBase, AuthMessageTypes, AuthWorkerRequest, AuthWorkerRequestLogin, AuthWorkerResponseLogin, AuthWorkerRequestRefresh, AuthWorkerResponseRefresh } from "src/app/shared/models/auth-messages/auth-worker-messages";
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

  public async handleMessage(request: AuthWorkerRequest) {
    switch (request.messageType) {
      case AuthMessageTypes.login:
        this.sendRequestLogin(request);
        break;
      case AuthMessageTypes.refresh:
        this.sendRequestRefresh(request);
        break;
    }
  }

  // ================================================================================================================================
  //                                                  PRIVATE METHODS
  // ================================================================================================================================

  private async sendRequestLogin(request: AuthWorkerRequestLogin) {
    const sender = new XMLHttpRequest();

    sender.withCredentials = false;
    const requestBody = `username=${request.data.username}&password=${request.data.password}&grant_type=password&scope=offline_access`;

    sender.open("POST", this.urlGetToken);
    sender.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    sender.setRequestHeader('Access-Control-Allow-Origin', '*');
    sender.timeout = 5000;

    const response: AuthWorkerResponseLogin = {
      guid: request.guid,
      messageType: AuthMessageTypes.login,
      data: undefined
    }

    sender.ontimeout = () => {
      response.data = {
        isSuccess: false,
        errorDescription: "Время ожидания истекло"
      }
      sender.abort();
      this.messageHandler.toClient(response);
    }
    sender.onreadystatechange = () => {
      if (sender.readyState == XMLHttpRequest.DONE && sender.response) {
        console.log("!! sender resp", sender.response);
        const senderObj = JSON.parse(sender.response);
        if (sender.status === 200) {
          if (senderObj.token_type) {
            response.data = {
              isSuccess: true,
              refreshToken: senderObj.refresh_token
            };
            // TODO: indxdb save
          } else {
            response.data = {
              isSuccess: false,
              errorDescription: "Неверное имя пользователя или пароль"
            }
          }
        } else {
          response.data = {
            isSuccess: false,
            errorDescription: "Нет доступа к сервису авторизации"
          }
        }
        this.messageHandler.toClient(response);
      }
    }
    sender.onerror = (e) => {
      response.data = {
        isSuccess: false,
        errorDescription: "Нет доступа к сервису авторизации"
      }
      this.messageHandler.toClient(response);
      // console.error("!! error onreadystatechange", e)
    }

    sender.send(requestBody);
  }

  private async sendRequestRefresh(request: AuthWorkerRequestRefresh) {
    const sender = new XMLHttpRequest();

    sender.withCredentials = false;
    const requestBody = `grant_type=refresh_token&refresh_token=${request.data.token}&scope=offline_access`;

    sender.open("POST", this.urlGetToken);
    sender.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    sender.setRequestHeader('Access-Control-Allow-Origin', '*');
    sender.timeout = 5000;

    const response: AuthWorkerResponseRefresh = {
      guid: request.guid,
      messageType: AuthMessageTypes.refresh,
      data: undefined
    }

    sender.ontimeout = () => {
      response.data = {
        isSuccess: false,
        errorDescription: "Время ожидания истекло"
      }
      sender.abort();
      this.messageHandler.toClient(response);
    }
    sender.onreadystatechange = () => {
      if (sender.readyState == XMLHttpRequest.DONE && sender.response) {
        console.log("!! sender resp", sender.response);
        const senderObj = JSON.parse(sender.response);
        if (sender.status === 200) {
          if (senderObj.token_type) {
            response.data = {
              isSuccess: true,
              refreshToken: senderObj.refresh_token
            };
            // TODO: indxdb save
          } else {
            response.data = {
              isSuccess: false,
              errorDescription: "Неверное имя пользователя или пароль"
            }
          }
        } else {
          response.data = {
            isSuccess: false,
            errorDescription: "Нет доступа к сервису авторизации"
          }
        }
        this.messageHandler.toClient(response);
      }
    }
    sender.onerror = (e) => {
      response.data = {
        isSuccess: false,
        errorDescription: "Нет доступа к сервису авторизации"
      }
      this.messageHandler.toClient(response);
      // console.error("!! error onreadystatechange", e)
    }

    sender.send(requestBody);
  }
}
