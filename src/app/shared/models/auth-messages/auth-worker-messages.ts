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
    // token: string;
  }
}

export type AuthWorkerRequest = AuthWorkerRequestLogin | AuthWorkerRequestInit | AuthWorkerRequestRefresh | AuthWorkerRequestLogout;

/////////////////////////

/** Ответное сообщение с воркера авторизации */
export interface AuthWorkerResponseBase<T extends AuthMessageTypes> extends BaseWorkerMessage {
  messageType: T,
}

export interface AuthWorkerResponseLogin extends AuthWorkerResponseBase<AuthMessageTypes.login> {
  data: AuthError | AuthSuccess | undefined;
}

export interface AuthWorkerResponseRefresh extends AuthWorkerResponseBase<AuthMessageTypes.refresh> {
  data: AuthError | AuthSuccess | undefined;
}

export interface AuthWorkerResponseCommon extends AuthWorkerResponseBase<AuthMessageTypes.init> {
  isOk: boolean;
  data: any | undefined;
}

export type AuthWorkerResponse = AuthWorkerResponseLogin | AuthWorkerResponseRefresh | AuthWorkerResponseCommon;

export interface AuthData<T extends boolean> {
  isSuccess: T;
}

export interface AuthError extends AuthData<false> {
  errorDescription: string;
}

export interface AuthSuccess extends AuthData<true> {
  // refreshToken: string;
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