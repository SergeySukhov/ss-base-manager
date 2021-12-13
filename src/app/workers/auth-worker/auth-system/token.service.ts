import jwt_decode from "jwt-decode";
import { BehaviorSubject } from "rxjs/internal/BehaviorSubject";
import { Token, TokenType } from "src/app/shared/models/auth-messages/auth-worker-messages";

/** Сервис для работы с токенами авторизации */
export class TokenService {
  /** Оповещение об обнаружении плохого токена */
  public badTokenDetected = new BehaviorSubject<boolean>(false);

  /** Оповещение о смене токена доступа */
  public accessTokenChange = new BehaviorSubject<string>("");

  /** Оповещение о смене пользователя */
  public userChanged = new BehaviorSubject<string>("");

  constructor() {
      // this.unitOfWork.tokenRepository.getToken(TokenType.accessToken).then((token: Token) => {
      //   this.handleAccessToken(token);
      // });
  }

  /** Получить токен обновления */
  public async getRefreshToken(): Promise<Token | undefined> {
    // return this.unitOfWork.tokenRepository.getToken(TokenType.refreshToken);
  }

  /** Получить токен доступа */
  public async getAccessToken(): Promise<Token | undefined> {
    // return this.unitOfWork.tokenRepository.getToken(TokenType.accessToken);
  }

  /** Получение пользователя по токену */
  public async getUser(): Promise<string> {
    const token = await this.getAccessToken();
    if (token) {
      return token.userName ?? "";
    }
    return "";
  }

  /** Жив ли токен доступа */
  public async isATAlive(): Promise<boolean> {
    const token = await this.getAccessToken();
    const isTokenExpired = this.isTokenExpired(token);
    return !isTokenExpired;
  }

  /** Установить токены в IDB */
  public async setTokens(accesToken: string, refreshToken: string) {
    const decoded = jwt_decode(accesToken) as any;

    const newAccessToken: Token = {
      token: accesToken,
      validTill: decoded.exp * 1000,
      tokenType: TokenType.accessToken,
      userName: decoded.UserUnicIdent,
      roles: decoded.role,
    };

    const newRefreshToken: Token = {
      token: refreshToken,
      tokenType: TokenType.refreshToken,
    };

    // await this.unitOfWork.tokenRepository.setToken(newAccessToken);
    // await this.unitOfWork.tokenRepository.setToken(newRefreshToken);
    this.handleAccessToken(newAccessToken);
  }

  /** Обработка пришедшего токена */
  public handleAccessToken(token: Token | null) {
    if (!token || token.token === "") {
      this.accessTokenChange.next("");
      this.userChanged.next("");
    } else {
      this.accessTokenChange.next(token.token);
      this.userChanged.next(token.userName ?? "ПОЛЬЗОВАТЕЛЬ НЕ ЗАДАН");
    }
  }

  /** Возвращает true если токен просрочен */
  private isTokenExpired(token?: Token): boolean {
    return token?.validTill ? token.validTill - 30000 < Date.now() : true;
  }
}
