import { BaseWorkerMessage } from "../base-worker-message";

/** Ответное сообщение с воркера авторизации */
export interface AuthWorkerResponse extends  BaseWorkerMessage {

}
/** Сообщение воркеру пересчета */
export interface AuthWorkerRequest extends  BaseWorkerMessage {
    data: {
        username: string;
        password: string;
    }
}

export interface AuthWorkerResponse {
  accessToken: string;
  userName: string;
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