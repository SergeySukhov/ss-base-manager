﻿import { MessageExchanger } from "../message-exchanger/message-exchanger.service";
import { AuthWorkerMessageType, AuthMessageType } from "../../../app/shared/modules/CoreModule/models/worker-messages/worker-message-types";
import { BehaviorSubject, Subject } from "rxjs";
import { UnitOfWork } from "../indexed-db-service/unit-of-work.service";
import { TokenService } from "../auth-system/token.service";
import { AuthSystemService } from "../auth-system/auth-system.service";
import { DbService } from "../../shared/indexed-db-v2/db.service";
import { DatabaseType } from "../../shared/indexed-db-v2/models/db-manager";
import { UpdateTokenData } from "../../../app/SMR/core/connection-to-workers-module/net-proxy-smr/models/worker-messages/worker-request-smr";
import { Token } from "../../../app/sharedAll/base-connection-to-workers-module/models/token.model";
import { AppType } from "../../../app/sharedAll/app-global-module/models/app-shared-types.model";
import { WorkerId } from "../../../app/sharedAll/base-connection-to-workers-module/worker-channel/worker-id.model";
import { WorkerServiceMessageType } from "../../../app/sharedAll/base-connection-to-workers-module/models/base-worker-message-type";
import { AuthWorkerRequest, BaseWorkerRequest } from "../../../app/shared/modules/CoreModule/models/worker-messages/worker-request";
import { AuthWorkerResponse } from "../../../app/shared/modules/CoreModule/models/worker-messages/worker-response";

/** Система верхнего уровня воркера. Принимает сообщения, перенаправляет их, инициализирует системы */
export class ManagementSystem {
  /** Сервис работы с данными из indexedDb */
  public unitOfWork: UnitOfWork;

  /** Сервис для работы с токенами */
  public tokenService: TokenService;

  /** Система авторизации */
  private authSystem: AuthSystemService;

  /** Последний полученный токен авторизации */
  private lastUpdatedToken: Token;

  /** Кто то уже запросил получение токена, одновременно несколько запросов на сервер идти не должно, это вызывает ошибки */
  private tokenRequestInProcess: boolean;

  /** Событие о том что пришел новый токен с Auth */
  private tokenReceived: Subject<AuthWorkerResponse> = new Subject<AuthWorkerResponse>();

  /** Инициализация воркера */
  private init: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private messageExchanger: MessageExchanger) {
    /** Подписка на сообщения. Диспетчеризация сообщений */
    messageExchanger.messageReceived.subscribe(async (request: AuthWorkerRequest) => {
      // ожидание инициализации воркера
      await this.checkInit(request.type);

      // Передача сообщения конкретному обработчику
      switch (request.type) {
        // Служебные сообщения / запросы
        case WorkerServiceMessageType.initWorker:
          await this.initialize();
          this.messageExchanger.send(
            {
              message: "initialized",
              type: WorkerServiceMessageType.initWorker,
            },
            WorkerId.MainClient,
          );
          break;

        case AuthMessageType.checkRegistration:
          const isUserExistsResponse: AuthWorkerResponse = await this.authSystem.checkIfUserExists(request.data);
          isUserExistsResponse.messageId = request.messageId;
          this.messageExchanger.send(isUserExistsResponse);
          break;

        case AuthMessageType.registration:
          const registrationResponse: AuthWorkerResponse = await this.authSystem.registration(request.data);
          registrationResponse.messageId = request.messageId;
          this.messageExchanger.send(registrationResponse);
          break;

        case WorkerServiceMessageType.authorize:
          const authResponse: AuthWorkerResponse = await this.authSystem.login(request.data.login, request.data.password, request.data.isHash);
          authResponse.messageId = request.messageId;
          this.messageExchanger.send(authResponse);
          break;

        case AuthMessageType.getAuthToken:
          let tokenResp: AuthWorkerResponse<Token>;
          let token = await this.tokenService.getAccessToken();

          if (this.authSystem.isAuth && token && (await this.tokenService.isATAlive())) {
            // Если токен есть и он живой, просто создаем сообщение с токеном и отправляем
            tokenResp = {
              type: WorkerServiceMessageType.updateToken,
              data: token,
            };
          } else {
            // В противном случае надо запросить токен с сервера, при этом исключив возможность параллельной отправки нескольких таких запросов
            // Клонирование объекта необходимо, иначе при параллельных запросах один запрос может поменять id другого до отправки
            tokenResp = JSON.parse(JSON.stringify(await this.getAuthTokenInner()));
          }

          tokenResp.messageId = request.messageId;
          token = tokenResp.data;

          // Рассылаем токен только если он изменился
          if (!this.lastUpdatedToken || token.token !== this.lastUpdatedToken.token) {
            this.lastUpdatedToken = token;
            const isTokenNotEmpty = token.token !== "";
            this.sendTokenToWorkers(token, isTokenNotEmpty, request.requesterId);
          }

          // Отвечаем в любом случае тому кто запросил токен напрямую
          this.messageExchanger.send(tokenResp, request.requesterId);
          break;

        case WorkerServiceMessageType.unAuthorize:
          const logoutResponse: AuthWorkerResponse = await this.authSystem.logout();
          const emptyToken: Token = logoutResponse.data;
          this.sendTokenToWorkers(emptyToken, false);
          break;

        default:
          throw new Error("Не задан обработчик для сообщения с типом " + request.type);
      }
    });
  }

  // ================================================================================================================================
  //                                                  PRIVATE METHODS
  // ================================================================================================================================

  /** Получение auth токена с синхронизацией повторных запросов */
  private async getAuthTokenInner(): Promise<AuthWorkerResponse> {
    const promise = new Promise<AuthWorkerResponse>(async (resolve) => {
      // Если уже кто то вызвал refresh до этого, подписываемся на событие. Нужно чтобы не дергать сервер кучу раз
      if (this.tokenRequestInProcess) {
        const sub = this.tokenReceived.subscribe((response: AuthWorkerResponse) => {
          sub.unsubscribe();
          resolve(response);
        });
      } else {
        this.tokenRequestInProcess = true;
        const response = await this.authSystem.authByRefreshToken();
        this.tokenReceived.next(response);
        this.tokenRequestInProcess = false;
        resolve(response);
      }
    });
    return promise;
  }

  /** Рассылка обновленного токена авторизации на воркеры
   * @param token новый токен
   * @param authorize авторизация/деаторизация
   * @param requesterId этому воркеру НЕ отправляем токен, так как он его запросил и получит ответным сообщением
   */
  private sendTokenToWorkers(token: Token, authorize: boolean, requesterId?: WorkerId) {
    const tokenUpdated: BaseWorkerRequest<WorkerServiceMessageType> = {
      appType: AppType.ESTIMATEOFFICE,
      data: token,
      type: authorize ? WorkerServiceMessageType.updateToken : WorkerServiceMessageType.unAuthorize,
    };
    const workersId = [
      WorkerId.SearchWorker,
      WorkerId.CalcWorker,
      WorkerId.CalcWorkerSmr,
      WorkerId.CalcTotalsWorkerSmr,
      WorkerId.ReportWorker,
      WorkerId.CacheManagementWorker,
      WorkerId.FileManagerWorker,
    ];

    workersId.forEach((workerId) => {
      this.messageExchanger.send(tokenUpdated, workerId);
    });

    // Остальным воркерам посылаем событие в том случае, если не они сами запросили токен
    // Убрано по задаче 7372
    // if (requesterId !== WorkerId.NetProxyNcs) {
    //   const tokenUpdatedNetProxyNcs: BaseWorkerRequest<WorkerServiceMessageType> = {
    //     data: token,
    //     type: authorize ? WorkerServiceMessageType.updateToken : WorkerServiceMessageType.unAuthorize,
    //   };
    //   this.messageExchanger.send(tokenUpdatedNetProxyNcs, WorkerId.NetProxyNcs);
    // }

    if (requesterId !== WorkerId.NetProxySmr) {
      const tokenUpdatedNetProxyNcs: BaseWorkerRequest<WorkerServiceMessageType> = {
        data: {
          token: token,
        } as UpdateTokenData,
        type: authorize ? WorkerServiceMessageType.updateToken : WorkerServiceMessageType.unAuthorize,
      };
      this.messageExchanger.send(tokenUpdatedNetProxyNcs, WorkerId.NetProxySmr);
    }

    // Напоследок событие для основного клиента
    if (!requesterId) {
      const tokenUpdatedMain: AuthWorkerResponse = {
        type: WorkerServiceMessageType.updateToken,
        data: token,
      };
      this.messageExchanger.send(tokenUpdatedMain);
    }
  }

  /** Инициализирует воркер */
  private async initialize() {
    /** инициализация основных компонентов воркера */
    this.unitOfWork = new UnitOfWork();
    const ready = await DbService.dbAvailability(DatabaseType.Token);
    if (ready) {
      this.tokenService = new TokenService(this.unitOfWork);
    }
    this.authSystem = new AuthSystemService(this.messageExchanger, this.tokenService);
    this.init.next(true);
  }

  /**
   * Проверка инициализации воркера для дальнейшей работы
   * @param type тип сообщения
   */
  private async checkInit(type: AuthWorkerMessageType) {
    if (type !== WorkerServiceMessageType.initWorker) {
      if (!this.init.value) {
        const promise = new Promise<boolean>((resolve) => {
          this.init.subscribe((x) => {
            if (x) {
              resolve(true);
            }
          });
        });
        await promise;
      }
    }
  }
}
