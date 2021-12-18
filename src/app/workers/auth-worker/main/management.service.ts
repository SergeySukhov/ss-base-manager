import { Token } from "@angular/compiler";
import { Subject } from "rxjs";
import { AuthWorkerResponse, AuthWorkerRequestBase, AuthMessageTypes, AuthWorkerRequest, AuthWorkerRequestLogin, AuthWorkerResponseLogin, AuthWorkerRequestRefresh, AuthWorkerResponseRefresh } from "src/app/shared/models/auth-messages/auth-worker-messages";
import { NetWorkerRequest, NetMessageTypes, NetWorkerResponse } from "src/app/shared/models/net-messages/net-worker-request";
import { TokenService } from "../services/token.service";
// import { AuthSystemService } from "../auth-system/auth-system.service";
// import { TokenService } from "../auth-system/token.service";
import { MessageHandler } from "../message-services/message-handler.service";

/** Система верхнего уровня воркера. Принимает сообщения, перенаправляет их, инициализирует системы */
export class ManagementSystem {

  /** Сервис для работы с токенами */
  public tokenService: TokenService;

  /** Узел для получения токена */
  private urlGetToken: string = "";

  /** Последний полученный токен авторизации */
  private lastUpdatedToken: Token | undefined;

  /** Кто то уже запросил получение токена, одновременно несколько запросов на сервер идти не должно, это вызывает ошибки */
  private tokenRequestInProcess: boolean = false;

  /** Событие о том что пришел новый токен с Auth */
  private tokenReceived: Subject<AuthWorkerResponse> = new Subject<AuthWorkerResponse>();

  constructor(private messageHandler: MessageHandler) {
    this.tokenService = new TokenService();
    // this.authSystem = new AuthSystemService(messageHandler, this.tokenService);
    const identityUrl = "http://localhost:63654" + "/identity";

    this.urlGetToken = identityUrl + "/token";
  }

  public async handleMessage(request: AuthWorkerRequest) {
    switch (request.messageType) {
      case AuthMessageTypes.init:
        this.messageHandler.toClient({ guid: request.guid, isOk: true, messageType: AuthMessageTypes.init, data: undefined });
        break;
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

    sender.onreadystatechange = async () => {
      if (sender.readyState == XMLHttpRequest.DONE && sender.response) {
        console.log("!! sender resp", sender.response);
        if (sender.status === 200) {
          const senderObj = JSON.parse(sender.response);
          if (senderObj.token_type) {
            response.data = {
              isSuccess: true,
            };
            await this.tokenService.addToken(JSON.stringify(senderObj.access_token), JSON.stringify(senderObj.refresh_token));
            this.messageHandler.toClient(response);
            return;
          }
        }
      }
      this.errorHandler(response)
    }
    this.setSenderHandlers(sender, response);
    sender.send(requestBody);
  }

  private async sendRequestRefresh(request: AuthWorkerRequestRefresh) {
    const sender = new XMLHttpRequest();
    const lastAuthToken = await this.tokenService.getRefreshToken();
    if (!lastAuthToken) {
      return;
    }

    sender.withCredentials = false;
    const requestBody = `grant_type=refresh_token&refresh_token=${lastAuthToken}&scope=offline_access`;

    sender.open("POST", this.urlGetToken);
    sender.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    sender.setRequestHeader('Access-Control-Allow-Origin', '*');
    sender.timeout = 5000;

    const response: AuthWorkerResponseRefresh = {
      guid: request.guid,
      messageType: AuthMessageTypes.refresh,
      data: undefined
    }

    sender.onreadystatechange = async () => {
      if (sender.readyState == XMLHttpRequest.DONE && sender.response) {
        if (sender.status === 200) {
          const senderObj = JSON.parse(sender.response);
          console.log("!! | sender.onreadystatechange= | senderObj", senderObj)
          if (senderObj.token_type) {
            response.data = {
              isSuccess: true,
            };
            await this.tokenService.updRefreshToken(JSON.stringify(senderObj.refresh_token))
            this.messageHandler.toClient(response);
            return;
          }
        }
      }
      this.errorHandler(response);
    }
    this.setSenderHandlers(sender, response);
    sender.send(requestBody);
  }

  private errorHandler(response: AuthWorkerResponse, errMesage?: string) {
    response.data = {
      isSuccess: false,
      errorDescription: errMesage ?? "Нет доступа к сервису авторизации"
    }
    this.messageHandler.toClient(response);
  }

  private setSenderHandlers(sender: XMLHttpRequest, response: AuthWorkerResponse) {
    sender.ontimeout = () => {
      this.errorHandler(response)
      sender.abort();
    }
    sender.onerror = (e) => {
      this.errorHandler(response)
    }
  }
}
