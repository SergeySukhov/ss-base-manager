// import jwt_decode from "jwt-decode";
import { v4 } from "uuid";
import { StorageService } from "../indexedDB/storage.service";


/** Сервис для работы с токенами авторизации */
export class TokenService {

  private dbService: StorageService;

  constructor() {
    this.dbService = new StorageService()
  }

  /** Получить токен обновления */
  public async getRefreshToken(): Promise<string | undefined> {
    const token = await this.dbService.getLastToken();
    return token?.refreshToken ?? undefined;
  }

  /** Получить токен доступа */
  public async getAccessToken(): Promise<string | undefined> {
    const token = await this.dbService.getLastToken();
    return token?.accessToken ?? undefined;
  }

  /** Записать токен доступа */
  public async addToken(accessToken: string, refreshToken: string): Promise<void> {
      const token = {
        guid: v4(),
        accessToken: accessToken,
        date: Date.now(),
        refreshToken: refreshToken,
      }
      this.dbService.add(token);
    return;
  }

    /** Удалить токен */
    public async removeToken(): Promise<void> {
      this.dbService.remove();
      return;
    }
}
