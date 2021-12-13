import Axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import { AuthMessageType } from "../../../app/shared/modules/CoreModule/models/worker-messages/worker-message-types";
import { AuthWorkerResponse } from "../../../app/shared/modules/CoreModule/models/worker-messages/worker-response";
import { MessageExchanger } from "../message-services/message-exchanger.service";
import {
  IdentityResponse,
  IdentityRegistrationError,
  IdentityError,
  IdentityUserExistsResponse,
} from "../../../app/shared/modules/AuthModule/models/identity-response.model";
import { LoginErrorType } from "../../../app/shared/modules/CoreModule/models/server-types/auth/login-error.model";
import { TokenService } from "./token.service";
import { TokenType, Token } from "../../../app/sharedAll/base-connection-to-workers-module/models/token.model";
import { WorkerServiceMessageType } from "../../../app/sharedAll/base-connection-to-workers-module/models/base-worker-message-type";

// ================================================================================================================================
// Модели для ответов с Identity
// ================================================================================================================================

interface BaseServerResponse {
  error?: string;
  // eslint-disable-next-line camelcase
  error_description?: string;
}
/** Ответ на запрос токена */
interface ServerTokenResponse extends BaseServerResponse {
  // eslint-disable-next-line camelcase
  access_token?: string;
  // eslint-disable-next-line camelcase
  expires_in?: number;
  // eslint-disable-next-line camelcase
  refresh_token?: string;
  scope?: string;
  // eslint-disable-next-line camelcase
  token_type?: string;
}

/** Ответ на запрос проверки уникальности полей пользователя при регистрации
 * Если запрашивается для проверки только одно поле, то второе (и результат его проверки) д.б. = null
 */
export interface ServerUserExistsResponse {
  /** Признак успешного завершения проверки */
  success: boolean;
  /** Запрашиваемое для проверки имя пользователя (Логин) */
  userName: string;
  /** Запрашиваемая для проверки почта пользователя */
  email: string;
  /** Признак того, что выбранное пользователем имя (логин) уникально */
  isLoginFree: boolean;
  /** Признак того, что указанный пользователем адрес EMail уникален */
  isMailFree: boolean;
}

// ================================================================================================================================
// AuthSystemService
// ================================================================================================================================

/** Сервис авторизации. Обрабатывает сообщения с клиента, связывается с Identity, оповещает другие воркере о смене состояния */
export class AuthSystemService {
  /** Сигнал об изменении состояния авторизации */
  public isAuth = false;

  /** Узел для получения токена */
  private urlGetToken: string = "";

  /** Объект http-клиента */
  private axios: AxiosInstance;

  // Конфигурации http-клиента
  private axiosJsonConfg: AxiosRequestConfig;

  private axiosUrlEncodedConfg: AxiosRequestConfig;

  constructor(private messageExchanger: MessageExchanger, private tokenService: TokenService) {
    this.initSystem();
  }

  // ================================================================================================================================
  //                                                       PUBLIC METHODS
  // ================================================================================================================================

  /**
   * Отправляет запрос на сервер для авторизации пользователя
   *
   * @param username имя пользователя под которым пытаемся авторизоваться
   * @param password пароль
   * @param rememberMe запоминать ли пользователя, чтобы не приходилось авторизоваться повторно
   */
  public async login(username: string, password: string, isHash: boolean): Promise<AuthWorkerResponse> {
    const searchParams = new URLSearchParams();
    searchParams.append("username", username);
    searchParams.append("password", password);
    searchParams.append("grant_type", isHash ? "hash" : "password");
    searchParams.append("scope", "offline_access");

    const requestBody = searchParams.toString();
    return this.axios
      .post<ServerTokenResponse>(this.urlGetToken, requestBody, this.axiosUrlEncodedConfg)
      .then(async (response: AxiosResponse<ServerTokenResponse>) => {
        const responseData = response.data;

        let error: IdentityError | null = null;
        if (!responseData.error) {
          await this.tokenService.setTokens(responseData.access_token ?? "", responseData.refresh_token ?? "");
        } else {
          error = responseData.error
            ? ({
              type: responseData.error,
              errorDescription: responseData.error_description,
            } as IdentityError)
            : null;
        }

        this.isAuth = !response.data.error;
        const workerResponse: AuthWorkerResponse = {
          type: WorkerServiceMessageType.authorize,
          data: {
            success: true,
            error: error,
          } as IdentityResponse<IdentityError>,
        };

        return workerResponse;
      })
      .catch(() => {
        const workerResponse: AuthWorkerResponse = {
          type: WorkerServiceMessageType.authorize,
          data: {
            success: false,
            error: {
              type: LoginErrorType.serviceUnavailable,
              errorDescription: "Сервис недоступен",
            } as IdentityError,
          } as IdentityResponse<IdentityError>,
        };
        return workerResponse;
      });
  }

  /**
   * Отправляет запрос на сервер для авторизации пользователя (используя refresh токен)
   */
  public async authByRefreshToken(): Promise<AuthWorkerResponse> {
    const refreshToken = await this.tokenService.getRefreshToken();

    if (!refreshToken) {
      return this.createTokenResponse(null);
    }

    const searchParams = new URLSearchParams();
    searchParams.append("grant_type", "refresh_token");
    searchParams.append("refresh_token", refreshToken.token);
    searchParams.append("scope", "offline_access");
    const requestBody = searchParams.toString();

    const config: AxiosRequestConfig = { headers: this.axiosUrlEncodedConfg };
    return this.axios
      .post<ServerTokenResponse>(this.urlGetToken, requestBody, config)
      .then(async (response: AxiosResponse<ServerTokenResponse>) => {
        const tokenResponse: ServerTokenResponse = response.data;
        if (!tokenResponse.error) {
          await this.tokenService.setTokens(tokenResponse.access_token ?? "", tokenResponse.refresh_token ?? "");

          if (!this.isAuth) {
            this.isAuth = true;
          }
          const token = await this.tokenService.getAccessToken();
          if (token) {
            const authResponse = await this.createTokenResponse(token);
            return authResponse;
          }
          throw new Error("Не удалось получить токен из внутреннего хранилища");
        } else {
          await this.tokenService.clearTokens();
          if (this.isAuth) {
            this.isAuth = false;
          }

          return this.createTokenResponse(null);
        }
      })
      .catch(async (err: AxiosError) => {
        if (!err.response || err.response.status === 400) {
          // Если наш refresh_token был отвергнут (недействителен, Bad Request)
          await this.tokenService.clearTokens();
          if (this.isAuth) {
            this.isAuth = false;
          }

          return this.createTokenResponse(null);
        } else {
          throw new Error(`Произошла ошибка при выполнении авторизации рефреш токеном ${err}`);
        }
      });
  }

  /** Создание сообщения об обновлении токена
   * @param token токен
   */
  public async createTokenResponse(token: Token | null): Promise<AuthWorkerResponse> {
    const tokenResponse = token !== null ? token : ({ token: "", tokenType: TokenType.accessToken } as Token);
    return {
      type: WorkerServiceMessageType.updateToken,
      data: tokenResponse,
    } as AuthWorkerResponse;
  }

  // ================================================================================================================================
  //                                                       PRIVATE METHODS
  // ================================================================================================================================

  /** Задание url для обращения к Identity */
  private async initSystem() {
    const IdentityUrl = "http://localhost:63654" + "/identity";

    this.urlGetToken = IdentityUrl + "/token";

    this.axios = Axios.create();
    this.axiosJsonConfg = {
      headers: { "Content-Type": "application/json" },
    };
    this.axiosUrlEncodedConfg = {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    };

    this.isAuth = await this.tokenService.isATAlive();
  }

}
