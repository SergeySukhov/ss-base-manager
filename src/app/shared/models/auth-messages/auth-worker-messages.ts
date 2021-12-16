import { BaseWorkerMessage } from "../base-worker-message";

export enum AuthMessageTypes {
  init,
  login,
  refresh,
  logout,
}


export interface AuthWorkerRequestBase<T extends AuthMessageTypes> extends BaseWorkerMessage {
  messageType: T,
}

export interface AuthWorkerRequestLogin extends AuthWorkerRequestBase<AuthMessageTypes.login> {
  data: {
    username: string;
    password: string;
  }
}

export interface AuthWorkerRequestInit extends AuthWorkerRequestBase<AuthMessageTypes.init> {
}
export interface AuthWorkerRequestLogout extends AuthWorkerRequestBase<AuthMessageTypes.logout> {
}
export interface AuthWorkerRequestRefresh extends AuthWorkerRequestBase<AuthMessageTypes.refresh> {
  data: {
    username: string;
    password: string;
  }
}

export type AuthWorkerRequest = AuthWorkerRequestLogin | AuthWorkerRequestInit | AuthWorkerRequestRefresh | AuthWorkerRequestLogout;

/////////////////////////

/** Ответное сообщение с воркера авторизации */
export interface AuthWorkerResponseBase<T extends AuthMessageTypes> extends BaseWorkerMessage {
  messageType: T,
}

export interface AuthWorkerResponseLogin extends AuthWorkerResponseBase<AuthMessageTypes.login> {
  data: AuthError | boolean | undefined;
}

export interface AuthWorkerResponseCommon extends AuthWorkerResponseBase<AuthMessageTypes.init | AuthMessageTypes.refresh> {
  isOk: boolean;
  data: any;
}

export type AuthWorkerResponse = AuthWorkerResponseLogin | AuthWorkerResponseCommon; 


export interface AuthError {
  error: boolean,
  errorDescription: string;
}

/** Модель для токена авторизации/рефреш токена */
export interface Token {
  /** Зашифрованная строка токена */
  token: string;
  /** Время, когда истекает токен в миллисекундах. Внимание - не время действия, а timestmp когда токен становится невалидным! */
  validTill?: number;
  /** Имя пользователя */
  userName?: string;
  /** Тип токена */
  tokenType: TokenType;
  /** Роли */
  roles?: string[];
}

/** тип токена */
export enum TokenType {
  accessToken = "accessToken",
  refreshToken = "refreshToken",
}