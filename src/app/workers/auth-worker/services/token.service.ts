// import jwt_decode from "jwt-decode";
import { UUID } from "angular2-uuid";
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
        guid: UUID.UUID(),
        accessToken: accessToken,
        date: Date.now(),
        refreshToken: refreshToken,
      }
      this.dbService.add(token);
    return;
  }

  /** Записать токен обновления */
  public async updRefreshToken(value: string): Promise<void> {
    return;
  }

    /** Удалить токен */
    public async removeToken(): Promise<void> {
      return;
    }
}
